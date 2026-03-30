"""
Teleport Cities Ingestion — fetches city-level cost-of-living data from
the Teleport API and maps it into SLIC city_inputs fields.

Maps to:
  - food_cost (pressure) ← "Restaurants" category median
  - rent (pressure) ← "Housing" category median rent
  - internet_cost (pressure) ← "Internet" category
  - transit_cost (pressure) ← "Transportation" category monthly pass
  - transit_access_commute_raw (viability, positive) ← "Commute" category
  - digital_infrastructure_raw (viability, positive) ← "Internet" speed metric

Provider: teleport_cities (Tier 4)
Update frequency: Quarterly (Teleport aggregates from Numbeo + partners)

Usage:
    python3 scripts/ingest/teleport_cities.py [--dry-run]
"""
from __future__ import annotations

import csv
import json
import re
import sys
import time
from difflib import SequenceMatcher
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

TELEPORT_BASE = "https://api.teleport.org/api"
PROVIDER_ID = "teleport_cities"

# Tier 4 — only write if field value is currently empty (don't overwrite higher tiers)
# Higher tier providers: Tier 1 (city_official_portal), Tier 2 (subnational),
# Tier 3 (national/international), so we never overwrite any existing provider.

# --- Mapping from Teleport detail categories to SLIC fields ---
# Each spec says which Teleport category + data item to extract.
FIELD_SPECS = [
    {
        "field": "food_cost",
        "label": "Food cost",
        "pillar": "pressure",
        "category": "Cost of Living",
        "data_id": "COST-RESTAURANT",
        "source_title": "Teleport API: Cost of Living — Restaurant Price Index",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
    {
        "field": "rent",
        "label": "Rent",
        "pillar": "pressure",
        "category": "Housing",
        "data_id": "HOUSING-RENT-LARGE",
        "source_title": "Teleport API: Housing — Large Apartment Rent",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
    {
        "field": "internet_cost",
        "label": "Internet cost",
        "pillar": "pressure",
        "category": "Internet Access",
        "data_id": "INTERNET-PRICE",
        "source_title": "Teleport API: Internet Access — Broadband Price",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
    {
        "field": "transit_cost",
        "label": "Transit cost",
        "pillar": "pressure",
        "category": "Transportation",
        "data_id": "TRANSPORTATION-PUBLIC-MONTHLY",
        "source_title": "Teleport API: Transportation — Monthly Public Transport Pass",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
    {
        "field": "transit_access_commute_raw",
        "label": "Transit access and commute raw",
        "pillar": "viability",
        "category": "Commute",
        "data_id": "COMMUTE-TIME",
        "source_title": "Teleport API: Commute — Average Commute Time (minutes)",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
    {
        "field": "digital_infrastructure_raw",
        "label": "Digital infrastructure raw",
        "pillar": "viability",
        "category": "Internet Access",
        "data_id": "INTERNET-SPEED",
        "source_title": "Teleport API: Internet Access — Average Download Speed (Mbps)",
        "notes_prefix": "auto_ingest=teleport_cities",
        "scale": 1.0,
    },
]

# --- Hard-coded slug mapping for SLIC cities that don't fuzzy-match well ---
SLUG_OVERRIDES: dict[str, str] = {
    "sg-singapore": "singapore",
    "ae-dubai": "dubai",
    "ae-abu-dhabi": "abu-dhabi",
    "qa-doha": "doha",
    "fr-paris": "paris",
    "at-vienna": "vienna",
    "ch-zurich": "zurich",
    "nl-amsterdam": "amsterdam",
    "dk-copenhagen": "copenhagen",
    "it-milan": "milan",
    "pt-porto": "porto",
    "ee-tallinn": "tallinn",
    "fi-helsinki": "helsinki",
    "ru-moscow": "moscow",
    "hu-budapest": "budapest",
    "pl-krakow": "krakow",
    "ro-bucharest": "bucharest",
    "rs-belgrade": "belgrade",
    "us-chicago": "chicago",
    "mx-mexico-city": "mexico-city",
    "ca-toronto": "toronto",
    "ca-montreal": "montreal",
    "ca-vancouver": "vancouver",
    "br-sao-paulo": "sao-paulo",
    "ar-buenos-aires": "buenos-aires",
    "cl-santiago": "santiago",
    "co-bogota": "bogota",
    "co-medellin": "medellin",
    "za-cape-town": "cape-town",
    "ke-nairobi": "nairobi",
    "nz-auckland": "auckland",
    "au-sydney": "sydney",
    "au-melbourne": "melbourne",
    "au-brisbane": "brisbane",
    "au-perth": "perth",
    "au-adelaide": "adelaide",
    "nz-wellington": "wellington",
    "tw-taipei": "taipei",
    "kr-busan": "busan",
    "cn-shanghai": "shanghai",
    "cn-chengdu": "chengdu",
    "cn-chongqing": "chongqing",
    "cn-hangzhou": "hangzhou",
    "cn-guangzhou": "guangzhou",
    "jp-fukuoka": "fukuoka",
    "in-bengaluru": "bangalore",
    "in-hyderabad": "hyderabad",
    "in-pune": "pune",
    "pk-karachi": "karachi",
    "pk-lahore": "lahore",
    "pk-islamabad": "islamabad",
    "bd-dhaka": "dhaka",
    "lk-colombo": "colombo",
    "th-bangkok": "bangkok",
    "th-chiang-mai": "chiang-mai",
    "my-kuala-lumpur": "kuala-lumpur",
    "id-jakarta": "jakarta",
    "kh-phnom-penh": "phnom-penh",
    "il-tel-aviv": "tel-aviv",
    "sa-riyadh": "riyadh",
    "sa-jeddah": "jeddah",
    "jo-amman": "amman",
    "us-pittsburgh": "pittsburgh",
    "mx-guadalajara": "guadalajara",
    "pe-lima": "lima",
    "uy-montevideo": "montevideo",
    "pa-panama-city": "panama-city",
    "cr-san-jose": "san-jose",
    "ma-casablanca": "casablanca",
    "gh-accra": "accra",
    "fr-lyon": "lyon",
    "es-valencia": "valencia",
    "de-munich": "munich",
    "se-gothenburg": "gothenburg",
    "hr-zagreb": "zagreb",
    "lt-vilnius": "vilnius",
    "lv-riga": "riga",
    "ge-tbilisi": "tbilisi",
    "si-ljubljana": "ljubljana",
    "us-minneapolis": "minneapolis-saint-paul",
    "us-raleigh": "raleigh",
    "br-curitiba": "curitiba",
    "it-bologna": "bologna",
    "at-graz": "graz",
    "pl-katowice": "katowice",
    "pl-gdansk": "gdansk",
    "sk-bratislava": "bratislava",
    "eg-alexandria": "alexandria",
    "np-kathmandu": "kathmandu",
    "ie-cork": "cork",
    "no-bergen": "bergen",
    "do-santo-domingo": "santo-domingo",
    "cn-shenzhen": "shenzhen",
    "cn-tianjin": "tianjin",
    "jp-sapporo": "sapporo",
    "jp-kobe": "kobe",
}


def fetch_json(url: str) -> dict | None:
    """Fetch a JSON endpoint; return parsed dict or None on error."""
    req = Request(url)
    req.add_header("Accept", "application/json")
    try:
        with urlopen(req, timeout=30) as resp:
            return json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        return None


def get_teleport_slugs() -> dict[str, str]:
    """Return {lowercase_name: slug} for all Teleport urban areas."""
    data = fetch_json(f"{TELEPORT_BASE}/urban_areas/")
    if not data:
        print("ERROR: Could not fetch Teleport urban areas index.")
        return {}
    slugs: dict[str, str] = {}
    for item in data.get("_links", {}).get("ua:item", []):
        name = item.get("name", "")
        href = item.get("href", "")
        # Extract slug from href like .../urban_areas/slug:bangkok/
        match = re.search(r"slug:([^/]+)", href)
        if match and name:
            slugs[name.lower()] = match.group(1)
    return slugs


def fuzzy_match_slug(city_name: str, country: str, teleport_slugs: dict[str, str]) -> str | None:
    """Try to match a SLIC city name to a Teleport slug via fuzzy matching."""
    city_lower = city_name.lower()

    # Direct match
    if city_lower in teleport_slugs:
        return teleport_slugs[city_lower]

    # Try "city, country" format that Teleport sometimes uses
    with_country = f"{city_lower}, {country.lower()}"
    if with_country in teleport_slugs:
        return teleport_slugs[with_country]

    # Fuzzy match — require at least 0.7 similarity
    best_score = 0.0
    best_slug = None
    for tname, tslug in teleport_slugs.items():
        # Compare against both the full name and the slug
        score = max(
            SequenceMatcher(None, city_lower, tname).ratio(),
            SequenceMatcher(None, city_lower, tslug.replace("-", " ")).ratio(),
        )
        if score > best_score:
            best_score = score
            best_slug = tslug

    if best_score >= 0.7:
        return best_slug
    return None


def extract_detail_value(details: dict, category_label: str, data_id: str) -> float | None:
    """Extract a specific numeric value from Teleport /details/ response."""
    for cat in details.get("categories", []):
        if cat.get("label", "").lower() != category_label.lower():
            continue
        for item in cat.get("data", []):
            item_id = item.get("id", "")
            if item_id.upper() == data_id.upper():
                # Value can be in float_value, int_value, currency_dollar_value, percent_value
                for vkey in ("currency_dollar_value", "float_value", "int_value", "percent_value"):
                    val = item.get(vkey)
                    if val is not None:
                        try:
                            return float(val)
                        except (ValueError, TypeError):
                            pass
    return None


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("Teleport Cities Ingestion")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # Load city universe
    city_universe_path = ROOT / "src" / "data" / "slic_city_universe.csv"
    city_rows = read_csv_rows(city_universe_path)
    print(f"Loaded {len(city_rows)} SLIC cities")

    # Fetch Teleport slug index
    print("Fetching Teleport urban areas index...")
    teleport_slugs = get_teleport_slugs()
    if not teleport_slugs:
        print("FATAL: No Teleport slugs fetched. Aborting.")
        return 1
    print(f"  Found {len(teleport_slugs)} Teleport urban areas")

    # Build city_id → slug mapping
    city_slug_map: dict[str, str] = {}
    unmatched = []
    for city in city_rows:
        city_id = city["city_id"]
        # Check hard-coded overrides first
        if city_id in SLUG_OVERRIDES:
            city_slug_map[city_id] = SLUG_OVERRIDES[city_id]
            continue
        # Derive a display name from city_id (e.g., "th-bangkok" → "Bangkok")
        city_name = city_id.split("-", 1)[1].replace("-", " ").title() if "-" in city_id else city_id
        slug = fuzzy_match_slug(city_name, city.get("country", ""), teleport_slugs)
        if slug:
            city_slug_map[city_id] = slug
        else:
            unmatched.append(city_id)

    print(f"  Matched {len(city_slug_map)} cities, {len(unmatched)} unmatched")
    if unmatched:
        print(f"  Unmatched: {', '.join(unmatched[:20])}")

    # Load existing city_inputs
    existing_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in existing_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    total_updates = 0
    cities_fetched = 0

    for city in city_rows:
        city_id = city["city_id"]
        slug = city_slug_map.get(city_id)
        if not slug:
            continue

        # Fetch details for this city
        details_url = f"{TELEPORT_BASE}/urban_areas/slug:{slug}/details/"
        details = fetch_json(details_url)
        if not details:
            print(f"  Warning: Could not fetch details for {city_id} (slug={slug})")
            continue

        cities_fetched += 1
        city_updates = 0

        for spec in FIELD_SPECS:
            field = spec["field"]
            key = (city_id, field)

            # Only write if field is currently empty (Tier 4 never overwrites)
            existing = existing_by_key.get(key, {})
            existing_value = existing.get("value", "").strip()
            existing_provider = existing.get("provider_id", "").strip()
            if existing_value and existing_provider and existing_provider != PROVIDER_ID:
                continue  # Higher-tier data exists — skip

            value = extract_detail_value(details, spec["category"], spec["data_id"])
            if value is None:
                continue

            scaled = round(value * spec["scale"], 2)
            source_url = f"https://teleport.org/cities/{slug}/"

            if key in existing_by_key:
                row = existing_by_key[key]
                row["value"] = str(scaled)
                row["provider_id"] = PROVIDER_ID
                row["source_url"] = source_url
                row["source_title"] = spec["source_title"]
                row["source_date"] = "2026-01-01"
                row["notes"] = f"{spec['notes_prefix']}; slug={slug}"
            else:
                new_row = {f: "" for f in CITY_INPUT_FIELDS}
                new_row["city_id"] = city_id
                new_row["display_name"] = city_id.split("-", 1)[1].replace("-", " ").title() if "-" in city_id else city_id
                new_row["country"] = city.get("country", "")
                new_row["cohort"] = city.get("cohort", "")
                new_row["field"] = field
                new_row["label"] = spec["label"]
                new_row["pillar"] = spec["pillar"]
                new_row["required_for_ranking"] = "yes"
                new_row["value"] = str(scaled)
                new_row["provider_id"] = PROVIDER_ID
                new_row["source_url"] = source_url
                new_row["source_title"] = spec["source_title"]
                new_row["source_date"] = "2026-01-01"
                new_row["notes"] = f"{spec['notes_prefix']}; slug={slug}"
                existing_rows.append(new_row)
                existing_by_key[key] = new_row

            city_updates += 1

        if city_updates > 0:
            total_updates += city_updates

        # Rate-limit: 200ms between city fetches
        time.sleep(0.2)

        if cities_fetched % 20 == 0:
            print(f"  Fetched {cities_fetched} cities so far ({total_updates} data points)...")

    print(f"\nFetched details for {cities_fetched} cities")
    print(f"Total data points: {total_updates}")

    if dry_run:
        print(f"\nDRY RUN — {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
