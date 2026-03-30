from __future__ import annotations

import csv
from collections import Counter
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent
CITY_INPUTS_PATH = ROOT / "data" / "verified_sources" / "city_inputs.csv"
REPORT_PATH = ROOT / "output" / "spreadsheet" / "analyst_source_cleanup_report.md"
TARGET_PROVIDER_ID = "slic_analyst"
CLEAR_FIELDS = (
    "value",
    "provider_id",
    "source_url",
    "source_title",
    "source_date",
    "reference_period",
    "source_scope",
    "proxy_status",
    "notes",
)


def read_rows(path: Path) -> tuple[list[str], list[dict[str, str]]]:
    with path.open("r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def write_rows(path: Path, fieldnames: list[str], rows: list[dict[str, str]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def main() -> int:
    fieldnames, rows = read_rows(CITY_INPUTS_PATH)
    target_rows = [
        row
        for row in rows
        if row.get("provider_id", "").strip() == TARGET_PROVIDER_ID
        and row.get("value", "").strip()
    ]

    if not target_rows:
        print("No filled slic_analyst rows found.")
        return 0

    by_city = Counter(row["city_id"] for row in target_rows)
    by_field = Counter(row["field"] for row in target_rows)

    for row in rows:
        if row.get("provider_id", "").strip() != TARGET_PROVIDER_ID or not row.get("value", "").strip():
            continue
        for field in CLEAR_FIELDS:
            if field in row:
                row[field] = ""

    write_rows(CITY_INPUTS_PATH, fieldnames, rows)

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with REPORT_PATH.open("w", encoding="utf-8") as handle:
        handle.write("# Analyst Row Cleanup Report\n\n")
        handle.write(f"- Provider cleared: `{TARGET_PROVIDER_ID}`\n")
        handle.write(f"- Rows cleared: `{len(target_rows)}`\n")
        handle.write(f"- Cities affected: `{len(by_city)}`\n\n")
        handle.write("## By City\n")
        for city_id, count in by_city.most_common():
            handle.write(f"- `{city_id}`: {count}\n")
        handle.write("\n## By Field\n")
        for field, count in by_field.most_common():
            handle.write(f"- `{field}`: {count}\n")

    print(f"Cleared {len(target_rows)} rows from {CITY_INPUTS_PATH.relative_to(ROOT)}")
    print(f"Wrote {REPORT_PATH.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
