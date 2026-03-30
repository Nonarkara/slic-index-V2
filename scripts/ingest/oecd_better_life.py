"""
OECD Better Life Index Ingestion — fetches country-level indicators from the
OECD SDMX-JSON API and maps them as Tier 3 proxies to all SLIC cities in
each country.

Maps to:
  - housing_burden_raw (pressure, negative) ← Housing expenditure as % of gross
    adjusted disposable income (HO_HISH)
  - gross_income (pressure) ← Household net adjusted disposable income per capita
    USD PPP (IW_HADI)
  - working_time_pressure_raw (pressure, negative) ← Employees working very long
    hours (% of employees) (WL_EWLH)

Provider: oecd_better_life (Tier 3)
Update frequency: Annual

Usage:
    python3 scripts/ingest/oecd_better_life.py [--dry-run]
"""
from __future__ import annotations

import csv
import json
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    read_csv_rows,
    write_csv,
)
from ingest._shared_mappings import COUNTRY_TO_ISO3

PROVIDER_ID = "oecd_better_life"

# OECD BLI SDMX endpoint — uses the OECD data-explorer API
# The BLI dataset key: BLI
# Dimensions: INDICATOR.MEASURE.INEQUALITY
# We fetch total (TOT) inequality breakdown, value (VALUE) measure
OECD_BLI_BASE = "https://sdmx.oecd.org/public/rest/data/OECD.WISE.WEB,DSD_BLI@DF_BLI,1.0"

# Map ISO3 to OECD 3-letter codes (mostly the same but some differ)
# OECD uses ISO 3166-1 alpha-3 for most countries
ISO3_TO_OECD: dict[str, str] = {
    # Most are identical; override the exceptions
    v: v for v in COUNTRY_TO_ISO3.values()
}

# Indicators we want from BLI
INDICATORS = [
    {
        "oecd_indicator": "HO_HISH",
        "field": "housing_burden_raw",
        "label": "Housing burden raw",
        "pillar": "pressure",
        "source_title": "OECD Better Life Index: Housing expenditure (% of gross adjusted disposable income)",
        "notes_prefix": "auto_ingest=oecd_better_life",
    },
    {
        "oecd_indicator": "IW_HADI",
        "field": "gross_income",
        "label": "Gross income",
        "pillar": "pressure",
        "source_title": "OECD Better Life Index: Household net adjusted disposable income per capita (USD PPP)",
        "notes_prefix": "auto_ingest=oecd_better_life",
    },
    {
        "oecd_indicator": "WL_EWLH",
        "field": "working_time_pressure_raw",
        "label": "Working time pressure raw",
        "pillar": "pressure",
        "source_title": "OECD Better Life Index: Employees working very long hours (%)",
        "notes_prefix": "auto_ingest=oecd_better_life",
    },
]

# Tier 3 providers that we should NOT overwrite
HIGHER_TIER_PROVIDERS = {
    "city_official_portal",       # Tier 1
    "subnational_official_portal",  # Tier 2
}
# We CAN overwrite same-tier or lower-tier (Tier 4/5) or empty


def fetch_oecd_bli() -> dict[str, dict[str, float]]:
    """
    Fetch OECD Better Life Index data.
    Returns {oecd_indicator: {iso3: value}}.

    Uses the SDMX-JSON REST API. We try the newer OECD data explorer endpoint
    first, then fall back to the legacy v2 Stats API.
    """
    results: dict[str, dict[str, float]] = {
        spec["oecd_indicator"]: {} for spec in INDICATORS
    }

    # Try each indicator individually for reliability
    for spec in INDICATORS:
        indicator_code = spec["oecd_indicator"]
        print(f"  Fetching {indicator_code}...")

        # Method 1: OECD SDMX REST API (new data explorer)
        url = f"{OECD_BLI_BASE}/{indicator_code}..TOT?format=jsondata&detail=dataonly"
        data = _fetch_json(url)
        if data and _parse_sdmx_jsondata(data, indicator_code, results):
            continue

        # Method 2: Legacy OECD Stats v2 API
        legacy_url = (
            f"https://stats.oecd.org/SDMX-JSON/data/BLI/{indicator_code}.L.TOT/"
            f"all?dimensionAtObservation=allDimensions"
        )
        data = _fetch_json(legacy_url)
        if data and _parse_legacy_sdmx(data, indicator_code, results):
            continue

        # Method 3: Direct OECD Data API (JSON)
        direct_url = (
            f"https://data.oecd.org/api/sdmx-json/data/BLI/{indicator_code}+VALUE+TOT/"
            f"all?format=jsondata"
        )
        data = _fetch_json(direct_url)
        if data and _parse_sdmx_jsondata(data, indicator_code, results):
            continue

        print(f"    Warning: Could not fetch data for {indicator_code}")

    return results


def _fetch_json(url: str) -> dict | None:
    """Fetch JSON with proper headers."""
    req = Request(url)
    req.add_header("Accept", "application/json")
    req.add_header("User-Agent", "SLIC-Index-Ingest/1.0")
    try:
        with urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        return None


def _parse_sdmx_jsondata(data: dict, indicator_code: str,
                          results: dict[str, dict[str, float]]) -> bool:
    """Parse SDMX-JSON format (dataSets with observations keyed by dimension indices)."""
    try:
        structure = data.get("structure", data.get("data", {}))
        datasets = data.get("dataSets", [])
        if not datasets:
            return False

        # Find the REF_AREA dimension to get country codes
        dimensions = structure.get("dimensions", {})
        obs_dims = dimensions.get("observation", dimensions.get("series", []))

        # Try to find country dimension
        country_dim_idx = None
        country_values = []
        for idx, dim in enumerate(obs_dims):
            dim_id = dim.get("id", "")
            if dim_id in ("REF_AREA", "LOCATION", "COU"):
                country_dim_idx = idx
                country_values = [v.get("id", "") for v in dim.get("values", [])]
                break

        if country_dim_idx is None:
            return False

        observations = datasets[0].get("observations", {})
        if not observations:
            # Try series format
            series = datasets[0].get("series", {})
            for skey, sval in series.items():
                dims = skey.split(":")
                if len(dims) > country_dim_idx:
                    cidx = int(dims[country_dim_idx])
                    if cidx < len(country_values):
                        country_code = country_values[cidx]
                        obs = sval.get("observations", {})
                        # Get the latest observation
                        if obs:
                            latest_key = max(obs.keys(), key=int)
                            val = obs[latest_key]
                            if isinstance(val, list) and len(val) > 0 and val[0] is not None:
                                results[indicator_code][country_code] = float(val[0])
            return bool(results[indicator_code])

        for obs_key, obs_val in observations.items():
            dims = obs_key.split(":")
            if len(dims) > country_dim_idx:
                cidx = int(dims[country_dim_idx])
                if cidx < len(country_values):
                    country_code = country_values[cidx]
                    if isinstance(obs_val, list) and len(obs_val) > 0 and obs_val[0] is not None:
                        results[indicator_code][country_code] = float(obs_val[0])

        return bool(results[indicator_code])
    except (KeyError, IndexError, ValueError, TypeError):
        return False


def _parse_legacy_sdmx(data: dict, indicator_code: str,
                        results: dict[str, dict[str, float]]) -> bool:
    """Parse legacy OECD Stats SDMX-JSON format."""
    try:
        datasets = data.get("dataSets", [])
        if not datasets:
            return False

        structure = data.get("structure", {})
        dimensions = structure.get("dimensions", {}).get("observation", [])

        country_dim_idx = None
        country_values = []
        for idx, dim in enumerate(dimensions):
            dim_id = dim.get("id", "")
            if dim_id in ("LOCATION", "COU", "REF_AREA"):
                country_dim_idx = idx
                country_values = [v.get("id", "") for v in dim.get("values", [])]
                break

        if country_dim_idx is None:
            return False

        observations = datasets[0].get("observations", {})
        for obs_key, obs_val in observations.items():
            dims = obs_key.split(":")
            if len(dims) > country_dim_idx:
                cidx = int(dims[country_dim_idx])
                if cidx < len(country_values):
                    country_code = country_values[cidx]
                    if isinstance(obs_val, list) and len(obs_val) > 0 and obs_val[0] is not None:
                        results[indicator_code][country_code] = float(obs_val[0])

        return bool(results[indicator_code])
    except (KeyError, IndexError, ValueError, TypeError):
        return False


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("OECD Better Life Index Ingestion")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    print(f"Loaded {len(city_rows)} SLIC cities")

    # Build country-to-cities lookup
    country_to_cities: dict[str, list[dict[str, str]]] = {}
    for row in city_rows:
        country = row.get("country", "")
        if country:
            country_to_cities.setdefault(country, []).append(row)

    # Fetch OECD BLI data
    print("Fetching OECD Better Life Index data...")
    indicator_data = fetch_oecd_bli()

    for ind_code, country_map in indicator_data.items():
        print(f"  {ind_code}: data for {len(country_map)} countries")

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    total_updates = 0

    for spec in INDICATORS:
        ind_code = spec["oecd_indicator"]
        field = spec["field"]
        data_for_indicator = indicator_data.get(ind_code, {})

        if not data_for_indicator:
            print(f"  Skipping {field} — no data available")
            continue

        updates = 0

        for country, cities in country_to_cities.items():
            iso3 = COUNTRY_TO_ISO3.get(country)
            if iso3 is None:
                continue

            # Try ISO3 directly, or common OECD country codes
            value = data_for_indicator.get(iso3)
            if value is None:
                # Some OECD data uses 2-letter codes
                continue

            for city_row in cities:
                city_id = city_row["city_id"]
                key = (city_id, field)

                # Tier 3: don't overwrite Tier 1 or Tier 2
                existing = existing_by_key.get(key, {})
                existing_provider = existing.get("provider_id", "").strip()
                existing_value = existing.get("value", "").strip()

                if existing_provider in HIGHER_TIER_PROVIDERS:
                    continue  # Higher tier — skip

                # Also skip if same-tier provider already has a value
                # (unless it's us or empty)
                if existing_value and existing_provider and existing_provider not in (PROVIDER_ID, "world_bank", "ilo_ilostat", ""):
                    # Another Tier 3 already filled — check if we should prefer ours
                    # OECD BLI is generally more integrated, so we overwrite other Tier 3
                    pass

                rounded_value = round(value, 2)
                source_url = f"https://data.oecd.org/bli/"

                if key in existing_by_key:
                    row = existing_by_key[key]
                    row["value"] = str(rounded_value)
                    row["provider_id"] = PROVIDER_ID
                    row["source_url"] = source_url
                    row["source_title"] = spec["source_title"]
                    row["source_date"] = "2024-12-31"
                    row["notes"] = f"{spec['notes_prefix']}; indicator={ind_code}; country_proxy={country}"
                else:
                    new_row = {f: "" for f in CITY_INPUT_FIELDS}
                    new_row["city_id"] = city_id
                    new_row["display_name"] = city_id.split("-", 1)[1].replace("-", " ").title() if "-" in city_id else city_id
                    new_row["country"] = country
                    new_row["cohort"] = city_row.get("cohort", "")
                    new_row["field"] = field
                    new_row["label"] = spec["label"]
                    new_row["pillar"] = spec["pillar"]
                    new_row["required_for_ranking"] = "yes"
                    new_row["value"] = str(rounded_value)
                    new_row["provider_id"] = PROVIDER_ID
                    new_row["source_url"] = source_url
                    new_row["source_title"] = spec["source_title"]
                    new_row["source_date"] = "2024-12-31"
                    new_row["notes"] = f"{spec['notes_prefix']}; indicator={ind_code}; country_proxy={country}"
                    existing_rows.append(new_row)
                    existing_by_key[key] = new_row

                updates += 1

        print(f"  {field} ← {ind_code}: updated {updates} city rows")
        total_updates += updates

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
