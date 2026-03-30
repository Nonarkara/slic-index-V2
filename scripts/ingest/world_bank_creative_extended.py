"""
World Bank Country-to-City Proxy Ingestion — Extended Creative Pillar indicators.

Maps to:
  - entrepreneurial_dynamism_raw (creative, positive) ← IC.BUS.NDNS.ZS (new business density)
  - innovation_research_intensity_raw (creative, positive) ← GB.XPD.RSDV.GD.ZS (R&D % GDP)
  - investment_signal_raw (creative, positive) ← BX.KLT.DINV.WD.GD.ZS (FDI net inflows % GDP)
  - administrative_investment_friction_raw (creative, negative) ← IC.REG.DURS (days to start business)

Provider: world_bank (Tier 3)
Update frequency: Annual

Usage:
    python3 scripts/ingest/world_bank_creative_extended.py [--dry-run]
"""
from __future__ import annotations

import json
import socket
import sys
import time
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "scripts" / "ingest"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    read_csv_rows,
    write_csv,
)
from _shared_mappings import COUNTRY_TO_ISO3

WB_API = "https://api.worldbank.org/v2"

INDICATORS = [
    {
        "code": "IC.BUS.NDNS.ZS",
        "field": "entrepreneurial_dynamism_raw",
        "label": "New business density (per 1,000 working-age pop.)",
        "pillar": "creative",
        "source_title": "World Bank WDI: New business density (new registrations per 1,000 people ages 15-64)",
        "notes_prefix": "auto_ingest=world_bank_creative_extended",
        "scale": 1.0,
        "offset": 0.0,
        "stale_before": 2016,
    },
    {
        "code": "GB.XPD.RSDV.GD.ZS",
        "field": "innovation_research_intensity_raw",
        "label": "Research and development expenditure (% of GDP)",
        "pillar": "creative",
        "source_title": "World Bank WDI: Research and development expenditure (% of GDP)",
        "notes_prefix": "auto_ingest=world_bank_creative_extended",
        "scale": 1.0,
        "offset": 0.0,
        "stale_before": 2018,
    },
    {
        "code": "BX.KLT.DINV.WD.GD.ZS",
        "field": "investment_signal_raw",
        "label": "FDI net inflows (% of GDP)",
        "pillar": "creative",
        "source_title": "World Bank WDI: Foreign direct investment, net inflows (% of GDP)",
        "notes_prefix": "auto_ingest=world_bank_creative_extended",
        "scale": 1.0,
        "offset": 0.0,
        "stale_before": 2018,
    },
    {
        "code": "IC.REG.DURS",
        "field": "administrative_investment_friction_raw",
        "label": "Time required to start a business (days)",
        "pillar": "creative",
        "source_title": "World Bank WDI: Time required to start a business (days)",
        "notes_prefix": "auto_ingest=world_bank_creative_extended",
        "scale": 1.0,
        "offset": 0.0,
        "stale_before": 2016,
    },
]


def fetch_wb_indicator(indicator_code: str, retries: int = 3) -> dict[str, tuple[float, int, str]]:
    """Fetch latest values for all countries. Returns {iso3: (value, year, url)}."""
    url = f"{WB_API}/country/all/indicator/{indicator_code}?format=json&per_page=20000&mrv=10"
    payload = None
    for attempt in range(retries):
        req = Request(url)
        try:
            with urlopen(req, timeout=90) as resp:
                payload = json.loads(resp.read())
            break
        except (HTTPError, URLError, json.JSONDecodeError, socket.timeout, OSError) as exc:
            print(f"  Warning: attempt {attempt+1}/{retries} failed for {indicator_code}: {exc}")
            if attempt < retries - 1:
                time.sleep(5)
    if payload is None:
        return {}

    if not isinstance(payload, list) or len(payload) < 2:
        return {}

    results: dict[str, tuple[float, int, str]] = {}
    for row in payload[1]:
        iso3 = str(row.get("countryiso3code", "")).strip()
        value = row.get("value")
        year = row.get("date")
        if not iso3 or value is None or not year:
            continue
        try:
            year_int = int(year)
            value_float = float(value)
        except (ValueError, TypeError):
            continue
        if iso3 not in results or year_int > results[iso3][1]:
            source_url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator_code}?format=json&mrv=10"
            results[iso3] = (value_float, year_int, source_url)
    return results


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("World Bank Creative Extended Pillar Ingestion")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    country_to_cities: dict[str, list[dict[str, str]]] = {}
    for row in city_rows:
        country = row.get("country", "")
        if country:
            country_to_cities.setdefault(country, []).append(row)

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    total_updates = 0

    for spec in INDICATORS:
        code = spec["code"]
        field = spec["field"]
        print(f"Fetching {code} → {field}...")

        data = fetch_wb_indicator(code)
        print(f"  Got data for {len(data)} countries")

        updates = 0
        for country, cities in country_to_cities.items():
            iso3 = COUNTRY_TO_ISO3.get(country)
            if iso3 is None or iso3 not in data:
                continue

            value, year, source_url = data[iso3]

            if year < spec["stale_before"]:
                continue

            scaled = round(spec["offset"] + spec["scale"] * value, 2)

            for city_row in cities:
                city_id = city_row["city_id"]
                key = (city_id, field)

                existing = existing_by_key.get(key, {})
                existing_provider = existing.get("provider_id", "").strip()
                if existing_provider and existing_provider not in ("world_bank", ""):
                    continue

                if key in existing_by_key:
                    row = existing_by_key[key]
                    row["value"] = str(scaled)
                    row["provider_id"] = "world_bank"
                    row["source_url"] = source_url
                    row["source_title"] = spec["source_title"]
                    row["source_date"] = f"{year}-12-31"
                    row["notes"] = f"{spec['notes_prefix']}; indicator={code}; year={year}; country_proxy={country}"
                else:
                    new_row = {f: "" for f in CITY_INPUT_FIELDS}
                    new_row["city_id"] = city_id
                    new_row["display_name"] = city_row.get("display_name", city_id)
                    new_row["country"] = country
                    new_row["cohort"] = city_row.get("cohort", "")
                    new_row["field"] = field
                    new_row["label"] = spec["label"]
                    new_row["pillar"] = spec["pillar"]
                    new_row["required_for_ranking"] = "yes"
                    new_row["value"] = str(scaled)
                    new_row["provider_id"] = "world_bank"
                    new_row["source_url"] = source_url
                    new_row["source_title"] = spec["source_title"]
                    new_row["source_date"] = f"{year}-12-31"
                    new_row["notes"] = f"{spec['notes_prefix']}; indicator={code}; year={year}; country_proxy={country}"
                    existing_rows.append(new_row)
                    existing_by_key[key] = new_row

                updates += 1

        print(f"  Updated {updates} city rows")
        total_updates += updates
        time.sleep(1)

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
