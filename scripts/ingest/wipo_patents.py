"""
World Bank Patent Data Ingestion — fetches resident + non-resident patent
applications, normalises per million population, and maps to
innovation_research_intensity_raw for every city in the SLIC universe.

Indicators:
  - IP.PAT.RESD  (patent apps, residents)
  - IP.PAT.NRES  (patent apps, non-residents)
  - SP.POP.TOTL  (total population, for per-million normalisation)

Maps to:
  - innovation_research_intensity_raw (capability, positive)

Provider: world_bank (Tier 3 — country proxy)
Update frequency: Annual

Usage:
    python3 scripts/ingest/wipo_patents.py [--dry-run]
"""
from __future__ import annotations

import csv
import json
import socket
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
from seed_country_context_from_world_bank_exports import COUNTRY_TO_ISO3

WB_API = "https://api.worldbank.org/v2"

FIELD = "innovation_research_intensity_raw"
LABEL = "Innovation / research intensity"
PILLAR = "capability"
SOURCE_TITLE = "World Bank WDI: Patent applications (residents + non-residents) per million population"
NOTES_PREFIX = "auto_ingest=wipo_patents_proxy"
STALE_BEFORE = 2016


def fetch_wb_indicator(indicator_code: str) -> dict[str, tuple[float, int, str]]:
    """Fetch latest values for all countries. Returns {iso3: (value, year, url)}."""
    url = f"{WB_API}/country/all/indicator/{indicator_code}?format=json&per_page=20000&mrv=10"
    req = Request(url)
    try:
        with urlopen(req, timeout=120) as resp:
            payload = json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError, socket.timeout, TimeoutError, OSError) as exc:
        print(f"  Warning: World Bank request failed for {indicator_code}: {exc}")
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

    print("WIPO Patent Data Ingestion (World Bank proxy)")
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

    # Fetch all three indicators
    print("Fetching IP.PAT.RESD (resident patent applications)...")
    resident = fetch_wb_indicator("IP.PAT.RESD")
    print(f"  Got data for {len(resident)} countries")
    time.sleep(1)

    print("Fetching IP.PAT.NRES (non-resident patent applications)...")
    non_resident = fetch_wb_indicator("IP.PAT.NRES")
    print(f"  Got data for {len(non_resident)} countries")
    time.sleep(1)

    print("Fetching SP.POP.TOTL (total population)...")
    population = fetch_wb_indicator("SP.POP.TOTL")
    print(f"  Got data for {len(population)} countries")
    time.sleep(1)

    # Combine: (resident + non-resident) / population * 1_000_000
    patents_per_million: dict[str, tuple[float, int, str]] = {}
    for iso3 in set(list(resident.keys()) + list(non_resident.keys())):
        if iso3 not in population:
            continue
        pop_val = population[iso3][0]
        if pop_val <= 0:
            continue

        res_val = resident.get(iso3, (0, 0, ""))[0]
        nres_val = non_resident.get(iso3, (0, 0, ""))[0]
        total_patents = res_val + nres_val
        per_million = round(total_patents / pop_val * 1_000_000, 2)

        # Use the most recent year from either indicator
        year = max(
            resident.get(iso3, (0, 0, ""))[1],
            non_resident.get(iso3, (0, 0, ""))[1],
        )
        source_url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/IP.PAT.RESD?format=json&mrv=10"
        patents_per_million[iso3] = (per_million, year, source_url)

    print(f"\nComputed patents-per-million for {len(patents_per_million)} countries")

    total_updates = 0
    for country, cities in country_to_cities.items():
        iso3 = COUNTRY_TO_ISO3.get(country)
        if iso3 is None or iso3 not in patents_per_million:
            continue

        value, year, source_url = patents_per_million[iso3]

        if year < STALE_BEFORE:
            continue

        for city_row in cities:
            city_id = city_row["city_id"]
            key = (city_id, FIELD)

            existing = existing_by_key.get(key, {})
            existing_provider = existing.get("provider_id", "").strip()
            if existing_provider and existing_provider not in ("world_bank", ""):
                continue

            if key in existing_by_key:
                row = existing_by_key[key]
                row["value"] = str(value)
                row["provider_id"] = "world_bank"
                row["source_url"] = source_url
                row["source_title"] = SOURCE_TITLE
                row["source_date"] = f"{year}-12-31"
                row["notes"] = f"{NOTES_PREFIX}; indicators=IP.PAT.RESD+IP.PAT.NRES; norm=per_million_pop; year={year}; country_proxy={country}"
            else:
                new_row = {f: "" for f in CITY_INPUT_FIELDS}
                new_row["city_id"] = city_id
                new_row["display_name"] = city_row.get("display_name", city_id)
                new_row["country"] = country
                new_row["cohort"] = city_row.get("cohort", "")
                new_row["field"] = FIELD
                new_row["label"] = LABEL
                new_row["pillar"] = PILLAR
                new_row["required_for_ranking"] = "yes"
                new_row["value"] = str(value)
                new_row["provider_id"] = "world_bank"
                new_row["source_url"] = source_url
                new_row["source_title"] = SOURCE_TITLE
                new_row["source_date"] = f"{year}-12-31"
                new_row["notes"] = f"{NOTES_PREFIX}; indicators=IP.PAT.RESD+IP.PAT.NRES; norm=per_million_pop; year={year}; country_proxy={country}"
                existing_rows.append(new_row)
                existing_by_key[key] = new_row

            total_updates += 1

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
