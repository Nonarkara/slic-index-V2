from __future__ import annotations

import json
from datetime import datetime, timezone

from audit_ranking_math import ROOT, extract_workbook_weights, run_validator
from generate_slic_workbook import main as build_workbook
from verified_source_pipeline import (
    apply_source_pack_to_workbook,
    compute_ranked_rows_enriched,
    prepare_verified_source_pack,
    source_pack_completion_summary,
    validate_source_pack,
)

OUTPUT_PATH = ROOT / "src" / "data" / "publishedRankingData.json"
PUBLIC_BOARD_SIZE = 100


def write_export() -> int:
    build_workbook()
    prepare_verified_source_pack(force=False)

    validator_ok, validator_output = run_validator()
    validation = validate_source_pack()
    weights = extract_workbook_weights()

    issues: list[str] = []
    if not validator_ok:
        issues.append(f"Workbook validation failed: {validator_output}")

    if validation.issues:
        issues.extend(validation.issues)

    if not validation.issues:
        apply_source_pack_to_workbook(validation)

    if not validation.issues:
        rows, norm_stats, metric_catalog = compute_ranked_rows_enriched(validation)
    else:
        rows, norm_stats, metric_catalog = [], {}, {}
    if not rows:
        issues.append(
            "Verified source pack does not currently produce any ranked city rows: "
            f"{source_pack_completion_summary(validation)}"
        )
    elif len(rows) < PUBLIC_BOARD_SIZE:
        issues.append(
            f"Verified source pack produces only {len(rows)} ranked cities. "
            f"At least {PUBLIC_BOARD_SIZE} ranked cities are required before the public board is publishable."
        )

    publishable = validator_ok and not validation.issues and len(rows) >= PUBLIC_BOARD_SIZE

    # Build pillar metrics map for frontend
    from verified_source_pipeline import PILLAR_METRICS as _PM
    pillar_metrics_export = {
        pillar: [{"key": mk, "weight": w} for mk, w in metrics]
        for pillar, metrics in _PM.items()
    }

    payload = {
        "publishable": publishable,
        "status": "published" if publishable else "reranking",
        "updatedAt": datetime.now(timezone.utc).isoformat(),
        "canonicalWeights": weights,
        "normStats": norm_stats,
        "metricCatalog": metric_catalog,
        "pillarMetrics": pillar_metrics_export,
        "issues": issues,
        "cities": rows,
    }

    OUTPUT_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUTPUT_PATH.relative_to(ROOT)}")
    print(f"publishable={payload['publishable']} rows={len(rows)}")
    print(f"- Source-pack completion: {source_pack_completion_summary(validation)}")
    if issues:
        for issue in issues:
            print(f"- {issue}")
    return 0


if __name__ == "__main__":
    raise SystemExit(write_export())
