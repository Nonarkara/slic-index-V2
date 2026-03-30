"""
Compute derived city-level fields from existing city_inputs.csv and
country_context.csv data.

Derived fields:
  - housing_burden_raw       = (rent / gross_income) * 100
  - household_debt_burden_raw = country_context household_debt_proxy (pass-through)
  - di_ppp_raw               = (gross_income * (1 - tax_rate) - rent - utilities
                                 - transit_cost - internet_cost - food_cost)
                                / ppp_factor

Usage:
    python3 scripts/compute_derived_fields.py [--dry-run]
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "scripts"))

from verified_source_pipeline import (
    CITY_INPUT_FIELDS,
    CITY_INPUTS_PATH,
    COUNTRY_CONTEXT_PATH,
    read_csv_rows,
    write_csv,
)


def safe_float(val: str | None) -> float | None:
    """Return float or None if empty / non-numeric."""
    if val is None:
        return None
    val = val.strip()
    if not val:
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def main() -> int:
    dry_run = "--dry-run" in sys.argv

    print("Compute Derived Fields")
    print(f"Mode: {'DRY RUN' if dry_run else 'LIVE'}")
    print()

    # ------------------------------------------------------------------
    # Load country_context into {country: {field: value_str}}
    # ------------------------------------------------------------------
    cc_rows = read_csv_rows(COUNTRY_CONTEXT_PATH)
    country_ctx: dict[str, dict[str, str]] = {}
    for row in cc_rows:
        country = row.get("country", "").strip()
        field = row.get("field", "").strip()
        value = row.get("value", "").strip()
        if country and field:
            country_ctx.setdefault(country, {})[field] = value

    # ------------------------------------------------------------------
    # Load city_inputs into rows + index
    # ------------------------------------------------------------------
    city_rows = read_csv_rows(CITY_INPUTS_PATH) if CITY_INPUTS_PATH.exists() else []
    existing_by_key: dict[tuple[str, str], dict[str, str]] = {}
    for row in city_rows:
        key = (row.get("city_id", ""), row.get("field", ""))
        existing_by_key[key] = row

    # Build per-city lookup: {city_id: {field: value_str}}
    city_vals: dict[str, dict[str, str]] = {}
    city_meta: dict[str, dict[str, str]] = {}  # city_id -> display_name, country, cohort
    for row in city_rows:
        cid = row.get("city_id", "")
        field = row.get("field", "")
        if cid and field:
            city_vals.setdefault(cid, {})[field] = row.get("value", "")
            if cid not in city_meta:
                city_meta[cid] = {
                    "display_name": row.get("display_name", cid),
                    "country": row.get("country", ""),
                    "cohort": row.get("cohort", ""),
                }

    total_updates = 0

    def upsert(city_id: str, field: str, label: str, pillar: str,
               value: float, notes: str) -> None:
        nonlocal total_updates
        key = (city_id, field)
        val_str = str(round(value, 4))
        meta = city_meta.get(city_id, {})

        if key in existing_by_key:
            row = existing_by_key[key]
            row["value"] = val_str
            row["provider_id"] = "derived"
            row["source_url"] = ""
            row["source_title"] = "Computed from city_inputs + country_context"
            row["source_date"] = ""
            row["notes"] = notes
        else:
            new_row = {f: "" for f in CITY_INPUT_FIELDS}
            new_row["city_id"] = city_id
            new_row["display_name"] = meta.get("display_name", city_id)
            new_row["country"] = meta.get("country", "")
            new_row["cohort"] = meta.get("cohort", "")
            new_row["field"] = field
            new_row["label"] = label
            new_row["pillar"] = pillar
            new_row["required_for_ranking"] = "yes"
            new_row["value"] = val_str
            new_row["provider_id"] = "derived"
            new_row["source_url"] = ""
            new_row["source_title"] = "Computed from city_inputs + country_context"
            new_row["source_date"] = ""
            new_row["notes"] = notes
            city_rows.append(new_row)
            existing_by_key[key] = new_row

        total_updates += 1

    # ------------------------------------------------------------------
    # 1. housing_burden_raw = (rent / gross_income) * 100
    # ------------------------------------------------------------------
    housing_count = 0
    for city_id, vals in city_vals.items():
        rent = safe_float(vals.get("rent"))
        income = safe_float(vals.get("gross_income"))
        if rent is not None and income is not None and income > 0:
            burden = (rent / income) * 100
            upsert(city_id, "housing_burden_raw", "Housing burden raw", "pressure",
                   burden, "derived=rent/gross_income*100")
            housing_count += 1
    print(f"housing_burden_raw: computed for {housing_count} cities")

    # ------------------------------------------------------------------
    # 2. household_debt_burden_raw ← country_context household_debt_proxy
    # ------------------------------------------------------------------
    debt_count = 0
    for city_id, vals in city_vals.items():
        country = city_meta.get(city_id, {}).get("country", "")
        cc = country_ctx.get(country, {})
        debt_proxy = safe_float(cc.get("household_debt_proxy"))
        if debt_proxy is not None:
            upsert(city_id, "household_debt_burden_raw",
                   "Household debt burden raw", "pressure",
                   debt_proxy,
                   f"derived=country_context.household_debt_proxy; country={country}")
            debt_count += 1
    print(f"household_debt_burden_raw: computed for {debt_count} cities")

    # ------------------------------------------------------------------
    # 3. di_ppp_raw = (gross_income * (1-tax_rate) - rent - utilities
    #                   - transit_cost - internet_cost - food_cost) / ppp_factor
    # ------------------------------------------------------------------
    di_count = 0
    for city_id, vals in city_vals.items():
        country = city_meta.get(city_id, {}).get("country", "")
        cc = country_ctx.get(country, {})

        income = safe_float(vals.get("gross_income"))
        rent = safe_float(vals.get("rent"))
        utilities = safe_float(vals.get("utilities"))
        transit = safe_float(vals.get("transit_cost"))
        internet = safe_float(vals.get("internet_cost"))
        food = safe_float(vals.get("food_cost"))
        tax_rate = safe_float(cc.get("tax_rate_assumption"))
        ppp_factor = safe_float(cc.get("ppp_private_consumption"))

        if (income is not None and rent is not None and utilities is not None
                and transit is not None and internet is not None
                and food is not None and tax_rate is not None
                and ppp_factor is not None and ppp_factor > 0):
            net_income = income * (1 - tax_rate)
            disposable = net_income - rent - utilities - transit - internet - food
            di_ppp = disposable / ppp_factor
            upsert(city_id, "di_ppp_raw",
                   "Disposable income (PPP-adjusted)", "pressure",
                   di_ppp,
                   f"derived=(gross_income*(1-tax_rate)-rent-utilities-transit-internet-food)/ppp; country={country}")
            di_count += 1
    print(f"di_ppp_raw: computed for {di_count} cities")

    print(f"\nTotal derived updates: {total_updates}")

    if dry_run:
        print("DRY RUN — no file written.")
        return 0

    write_csv(CITY_INPUTS_PATH, city_rows, CITY_INPUT_FIELDS)
    print(f"Wrote to {CITY_INPUTS_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
