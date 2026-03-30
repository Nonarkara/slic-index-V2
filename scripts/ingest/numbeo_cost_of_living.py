"""
Cost-of-Living Estimation via World Bank GNI + Regional Expenditure Ratios.

Since Numbeo data cannot be scraped programmatically, this script uses:
  1. World Bank GNI per capita PPP (NY.GNP.PCAP.PP.CD) for gross_income
  2. Regional household expenditure ratios from World Bank / ILO surveys
     to estimate rent, utilities, transit_cost, internet_cost, food_cost

All values are monthly USD PPP.

Maps to (all pressure pillar):
  - gross_income     ← GNI per capita PPP / 12
  - rent             ← regional % of gross_income
  - utilities        ← regional % of gross_income
  - transit_cost     ← regional % of gross_income
  - internet_cost    ← regional % of gross_income
  - food_cost        ← regional % of gross_income

Provider: world_bank_col_estimate (Tier 4 estimated)
Update frequency: Annual

Usage:
    python3 scripts/ingest/numbeo_cost_of_living.py [--dry-run]
"""
from __future__ import annotations

import json
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
    PROVIDERS_PATH,
    PROVIDER_FIELDS,
    read_csv_rows,
    write_csv,
)
from _shared_mappings import COUNTRY_TO_ISO3

WB_API = "https://api.worldbank.org/v2"
PROVIDER_ID = "world_bank_col_estimate"

# --------------------------------------------------------------------------- #
# Regional expenditure shares (% of gross monthly income)
# Based on World Bank household consumption expenditure surveys and
# ILO Global Wage Reports. These are reasonable mid-range estimates.
# --------------------------------------------------------------------------- #
REGIONAL_SHARES: dict[str, dict[str, float]] = {
    "East Asia": {
        "rent": 0.25,
        "utilities": 0.06,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.20,
    },
    "Southeast Asia": {
        "rent": 0.20,
        "utilities": 0.05,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.22,
    },
    "Western, Northern, and Southern Europe": {
        "rent": 0.35,
        "utilities": 0.07,
        "transit_cost": 0.05,
        "internet_cost": 0.015,
        "food_cost": 0.15,
    },
    "Southern/Eastern Europe and Eurasia": {
        "rent": 0.25,
        "utilities": 0.08,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.20,
    },
    "North America": {
        "rent": 0.35,
        "utilities": 0.07,
        "transit_cost": 0.05,
        "internet_cost": 0.02,
        "food_cost": 0.15,
    },
    "Oceania": {
        "rent": 0.30,
        "utilities": 0.06,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.15,
    },
    "Middle East": {
        "rent": 0.25,
        "utilities": 0.05,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.18,
    },
    "South Asia": {
        "rent": 0.15,
        "utilities": 0.05,
        "transit_cost": 0.03,
        "internet_cost": 0.01,
        "food_cost": 0.25,
    },
    "Africa": {
        "rent": 0.20,
        "utilities": 0.06,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.25,
    },
    "Latin America": {
        "rent": 0.25,
        "utilities": 0.06,
        "transit_cost": 0.04,
        "internet_cost": 0.015,
        "food_cost": 0.22,
    },
}

# City-level adjustments for known expensive/cheap cities relative to country
# Multiplier applied to all cost fields (not income). >1 = more expensive.
CITY_COST_MULTIPLIERS: dict[str, float] = {
    # Significantly more expensive than country average
    "sg-singapore": 1.35,
    "ae-dubai": 1.25,
    "ae-abu-dhabi": 1.20,
    "qa-doha": 1.20,
    "il-tel-aviv": 1.30,
    "ch-zurich": 1.25,
    "fr-paris": 1.30,
    "au-sydney": 1.25,
    "nz-auckland": 1.15,
    "ca-toronto": 1.20,
    "ca-vancouver": 1.25,
    "us-chicago": 1.10,
    "nl-amsterdam": 1.20,
    "dk-copenhagen": 1.15,
    "it-milan": 1.20,
    "kr-busan": 0.85,  # Cheaper than Seoul-based national average
    "jp-fukuoka": 0.80,
    "jp-sapporo": 0.80,
    "jp-kobe": 0.85,
    "jp-hiroshima": 0.80,
    "cn-shanghai": 1.30,
    "cn-shenzhen": 1.20,
    "cn-guangzhou": 1.10,
    "cn-chengdu": 0.85,
    "cn-chongqing": 0.80,
    "cn-hangzhou": 1.10,
    "cn-tianjin": 0.85,
    "tw-taipei": 1.15,
    "tw-kaohsiung": 0.85,
    "tw-taichung": 0.90,
    "in-bengaluru": 1.15,
    "in-hyderabad": 1.05,
    "in-pune": 1.05,
    "br-sao-paulo": 1.20,
    "ar-buenos-aires": 1.15,
    "mx-mexico-city": 1.15,
    "za-johannesburg": 1.10,
    "za-cape-town": 1.10,
    "ke-nairobi": 1.15,
    "ru-moscow": 1.30,
    "hu-budapest": 1.10,
    "pl-krakow": 1.05,
    "de-munich": 1.25,
    "se-gothenburg": 0.90,
    "no-bergen": 0.95,
    "es-valencia": 0.85,
    "fr-lyon": 0.85,
    # Significantly cheaper
    "th-chiang-mai": 0.65,
    "th-hat-yai": 0.60,
    "th-phuket": 0.90,
    "my-george-town": 0.80,
    "my-kuching": 0.70,
    "my-kota-kinabalu": 0.70,
    "my-melaka": 0.65,
    "id-surabaya": 0.75,
    "ph-cebu-city": 0.80,
    "vn-da-nang": 0.75,
    "kh-phnom-penh": 0.90,
    "lk-kandy": 0.80,
    "np-pokhara": 0.75,
    "pk-islamabad": 0.95,
    "pk-lahore": 0.85,
    "pk-karachi": 0.90,
    "bd-chattogram": 0.80,
    "co-medellin": 0.80,
    "br-curitiba": 0.85,
    "br-florianopolis": 0.90,
    "cl-valparaiso": 0.80,
    "ec-cuenca": 0.75,
    "pe-arequipa": 0.75,
    "bw-gaborone": 0.85,
    "na-windhoek": 0.85,
    "gh-kumasi": 0.80,
    "ug-kampala": 0.90,
    "au-hobart": 0.85,
    "au-adelaide": 0.85,
    "au-perth": 0.95,
    "nz-wellington": 1.05,
    "nz-christchurch": 0.90,
    "nz-dunedin": 0.80,
    "at-graz": 0.80,
    "pt-porto": 0.85,
    "pt-braga": 0.75,
    "ee-tallinn": 0.90,
    "fi-helsinki": 1.05,
    "it-bologna": 0.90,
    "cz-brno": 0.85,
    "si-ljubljana": 0.90,
    "hr-zagreb": 0.90,
    "lt-vilnius": 0.90,
    "lv-riga": 0.85,
    "ge-tbilisi": 0.80,
    "be-antwerp": 0.90,
    "ie-cork": 0.90,
    "nl-eindhoven": 0.85,
    "us-pittsburgh": 0.80,
    "us-minneapolis": 0.90,
    "us-raleigh": 0.85,
    "ca-montreal": 0.85,
    "ca-ottawa": 0.95,
    "mx-guadalajara": 0.85,
    "mx-merida": 0.75,
    "pa-panama-city": 0.90,
    "cr-san-jose": 0.90,
    "pr-san-juan": 1.05,
    "do-santo-domingo": 0.85,
    "uy-montevideo": 0.90,
    "ar-cordoba": 0.80,
    "py-asuncion": 0.85,
    "om-muscat": 0.90,
    "bh-manama": 0.90,
    "sa-jeddah": 0.90,
    "sa-riyadh": 0.95,
    "kw-kuwait-city": 1.00,
    "jo-amman": 0.90,
    "il-haifa": 0.90,
    "om-salalah": 0.75,
    "jo-aqaba": 0.75,
    "sa-khobar": 0.85,
    "mu-port-louis": 0.90,
    "rw-kigali": 0.95,
    "ma-casablanca": 0.95,
    "ma-rabat": 0.90,
    "eg-alexandria": 0.85,
    "tz-dar-es-salaam": 0.90,
    "sn-dakar": 0.95,
    "gh-accra": 1.05,
    "fj-suva": 0.90,
    "pg-port-moresby": 1.10,
    "ws-apia": 0.90,
    "vu-port-vila": 0.95,
    "ro-bucharest": 1.05,
    "rs-belgrade": 0.95,
    "sk-bratislava": 0.95,
    "pl-katowice": 0.80,
    "pl-gdansk": 0.90,
    "pl-torun": 0.75,
    "ru-nizhny-novgorod": 0.60,
    "kr-suwon": 0.90,
    "kr-jeju-city": 0.85,
    "kr-incheon": 0.90,
}

# Income multipliers for cities with notably higher/lower wages than national avg
CITY_INCOME_MULTIPLIERS: dict[str, float] = {
    "sg-singapore": 1.0,  # City-state, no adjustment needed
    "ae-dubai": 1.10,
    "ae-abu-dhabi": 1.15,
    "qa-doha": 1.0,
    "il-tel-aviv": 1.15,
    "ch-zurich": 1.20,
    "fr-paris": 1.15,
    "au-sydney": 1.10,
    "us-chicago": 1.10,
    "nl-amsterdam": 1.10,
    "dk-copenhagen": 1.05,
    "it-milan": 1.15,
    "cn-shanghai": 1.50,
    "cn-shenzhen": 1.40,
    "cn-guangzhou": 1.25,
    "cn-chengdu": 0.90,
    "cn-chongqing": 0.85,
    "cn-hangzhou": 1.20,
    "cn-tianjin": 0.95,
    "tw-taipei": 1.10,
    "br-sao-paulo": 1.20,
    "ru-moscow": 1.50,
    "de-munich": 1.20,
    "in-bengaluru": 1.40,
    "in-hyderabad": 1.25,
    "in-pune": 1.20,
    "kr-busan": 0.90,
    "jp-fukuoka": 0.85,
    "jp-sapporo": 0.85,
    "jp-kobe": 0.90,
    "jp-hiroshima": 0.85,
    "mx-mexico-city": 1.15,
    "za-johannesburg": 1.10,
    "za-cape-town": 1.05,
    "ke-nairobi": 1.20,
    "ca-toronto": 1.10,
    "ca-vancouver": 1.05,
}


COST_FIELDS = [
    {
        "field": "gross_income",
        "label": "Gross income (GNI PPP, country proxy)",
        "source_title": "World Bank WDI: GNI per capita PPP (monthly USD)",
    },
    {
        "field": "rent",
        "label": "Rent (estimated from regional expenditure share)",
        "source_title": "World Bank GNI + regional expenditure ratio estimate",
    },
    {
        "field": "utilities",
        "label": "Utilities (estimated from regional expenditure share)",
        "source_title": "World Bank GNI + regional expenditure ratio estimate",
    },
    {
        "field": "transit_cost",
        "label": "Transit cost (estimated from regional expenditure share)",
        "source_title": "World Bank GNI + regional expenditure ratio estimate",
    },
    {
        "field": "internet_cost",
        "label": "Internet cost (estimated from regional expenditure share)",
        "source_title": "World Bank GNI + regional expenditure ratio estimate",
    },
    {
        "field": "food_cost",
        "label": "Food cost (estimated from regional expenditure share)",
        "source_title": "World Bank GNI + regional expenditure ratio estimate",
    },
]


# Manual GNI PPP data for countries not in World Bank (e.g. Taiwan)
# Sources: DGBAS (Directorate General of Budget, Accounting and Statistics)
MANUAL_GNI_PPP: dict[str, tuple[float, int, str]] = {
    "TWN": (65000.0, 2023, "https://eng.dgbas.gov.tw/"),
}


def fetch_gni_ppp() -> dict[str, tuple[float, int, str]]:
    """Fetch GNI per capita PPP for all countries. Returns {iso3: (value, year, url)}."""
    indicator = "NY.GNP.PCAP.PP.CD"
    url = f"{WB_API}/country/all/indicator/{indicator}?format=json&per_page=20000&mrv=10"
    req = Request(url)
    try:
        with urlopen(req, timeout=60) as resp:
            payload = json.loads(resp.read())
    except (HTTPError, URLError, json.JSONDecodeError) as exc:
        print(f"  Warning: World Bank request failed: {exc}")
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
            source_url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator}?format=json&mrv=10"
            results[iso3] = (value_float, year_int, source_url)
    return results


def ensure_provider_exists() -> None:
    """Add our provider to providers.csv if missing."""
    rows = read_csv_rows(PROVIDERS_PATH) if PROVIDERS_PATH.exists() else []
    for row in rows:
        if row.get("provider_id") == PROVIDER_ID:
            return
    rows.append({
        "provider_id": PROVIDER_ID,
        "name": "World Bank GNI + Regional Expenditure Estimate",
        "tier": "Tier 4",
        "scope": "international",
        "allowed_host": "worldbank.org",
        "allow_any_https": "false",
        "reference_only": "false",
        "notes": "Cost-of-living estimates derived from World Bank GNI per capita PPP and regional household expenditure survey ratios.",
    })
    write_csv(PROVIDERS_PATH, rows, PROVIDER_FIELDS)
    print(f"  Added provider '{PROVIDER_ID}' to providers.csv")


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("=" * 60)
    print("Cost-of-Living Estimation: World Bank GNI + Regional Ratios")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print("=" * 60)
    print()

    # Ensure provider exists
    if not dry_run:
        ensure_provider_exists()

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

    # Fetch GNI data
    print("Fetching World Bank GNI per capita PPP (NY.GNP.PCAP.PP.CD)...")
    gni_data = fetch_gni_ppp()
    # Merge manual data for countries not covered by World Bank
    for iso3, val in MANUAL_GNI_PPP.items():
        if iso3 not in gni_data:
            gni_data[iso3] = val
            print(f"  Added manual GNI PPP for {iso3}: ${val[0]:,.0f} ({val[1]})")
    print(f"  Got data for {len(gni_data)} countries")
    print()

    total_updates = 0
    missing_countries: list[str] = []

    for country, cities in sorted(country_to_cities.items()):
        iso3 = COUNTRY_TO_ISO3.get(country)
        if iso3 is None:
            missing_countries.append(f"{country} (no ISO3 mapping)")
            continue
        if iso3 not in gni_data:
            missing_countries.append(f"{country} ({iso3}, no WB data)")
            continue

        annual_gni, year, source_url = gni_data[iso3]
        monthly_gni = annual_gni / 12.0

        # Get cohort for regional shares
        cohort = cities[0].get("cohort", "")
        shares = REGIONAL_SHARES.get(cohort)
        if shares is None:
            missing_countries.append(f"{country} (cohort '{cohort}' not in regional shares)")
            continue

        for city_row in cities:
            city_id = city_row["city_id"]
            display_name = city_row.get("display_name", city_id)
            city_cohort = city_row.get("cohort", cohort)

            # Get city-specific multipliers
            cost_mult = CITY_COST_MULTIPLIERS.get(city_id, 1.0)
            income_mult = CITY_INCOME_MULTIPLIERS.get(city_id, 1.0)

            city_income = round(monthly_gni * income_mult, 2)

            for spec in COST_FIELDS:
                field = spec["field"]
                key = (city_id, field)

                # Skip if already filled by a higher-tier provider
                existing = existing_by_key.get(key, {})
                existing_provider = existing.get("provider_id", "").strip()
                existing_value = existing.get("value", "").strip()
                if existing_value and existing_provider and existing_provider not in (PROVIDER_ID, ""):
                    continue

                # Compute value
                if field == "gross_income":
                    computed = city_income
                else:
                    share = shares[field]
                    computed = round(city_income * share * cost_mult, 2)

                notes = (
                    f"auto_ingest=world_bank_col_estimate; "
                    f"gni_annual={annual_gni}; year={year}; "
                    f"country_proxy={country}; cohort={city_cohort}"
                )
                if cost_mult != 1.0 and field != "gross_income":
                    notes += f"; city_cost_mult={cost_mult}"
                if income_mult != 1.0 and field == "gross_income":
                    notes += f"; city_income_mult={income_mult}"

                if key in existing_by_key:
                    row = existing_by_key[key]
                    row["value"] = str(computed)
                    row["provider_id"] = PROVIDER_ID
                    row["source_url"] = source_url
                    row["source_title"] = spec["source_title"]
                    row["source_date"] = f"{year}-12-31"
                    row["notes"] = notes
                else:
                    new_row = {f: "" for f in CITY_INPUT_FIELDS}
                    new_row["city_id"] = city_id
                    new_row["display_name"] = display_name
                    new_row["country"] = country
                    new_row["cohort"] = city_cohort
                    new_row["field"] = field
                    new_row["label"] = spec["label"]
                    new_row["pillar"] = "pressure"
                    new_row["required_for_ranking"] = "yes"
                    new_row["value"] = str(computed)
                    new_row["provider_id"] = PROVIDER_ID
                    new_row["source_url"] = source_url
                    new_row["source_title"] = spec["source_title"]
                    new_row["source_date"] = f"{year}-12-31"
                    new_row["notes"] = notes
                    existing_rows.append(new_row)
                    existing_by_key[key] = new_row

                total_updates += 1

    # Report
    print(f"Total fields updated: {total_updates}")
    if missing_countries:
        print(f"\nCould not fill {len(missing_countries)} countries:")
        for mc in missing_countries:
            print(f"  - {mc}")

    if dry_run:
        print(f"\nDRY RUN -- {total_updates} rows would be updated.")
        return 0

    write_csv(CITY_INPUTS_PATH, existing_rows, CITY_INPUT_FIELDS)
    print(f"\nWrote {total_updates} values to {CITY_INPUTS_PATH.relative_to(ROOT)}")

    # Verification: count filled fields
    print("\n--- Verification ---")
    for spec in COST_FIELDS:
        field = spec["field"]
        filled = sum(1 for r in existing_rows if r.get("field") == field and r.get("value", "").strip())
        total = sum(1 for r in existing_rows if r.get("field") == field)
        print(f"  {field}: {filled}/{total} filled")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
