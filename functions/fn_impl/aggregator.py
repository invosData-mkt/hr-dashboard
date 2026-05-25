"""Aggregate applicant records into dashboard-ready statistics."""

from __future__ import annotations

from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from typing import Optional

from .config import CLOSED_STATUSES, STAGE_ACCEPTED, STAGE_SEND_OFFER


def _parse_date(s: str) -> Optional[date]:
    if not s:
        return None
    try:
        return datetime.fromisoformat(s).date()
    except ValueError:
        return None


def aggregate(
    records: list[dict],
    start: str = "",
    end: str = "",
    status_groups: list[dict] | None = None,
) -> dict:
    total_records = len(records)

    # ── Date filtering (by apply_date) ──
    start_date = _parse_date(start)
    end_date = _parse_date(end)

    filtered: list[dict] = []
    for r in records:
        d = _parse_date(r["apply_date"])
        if d is None:
            # Include records without apply_date when no date filter
            if not start_date and not end_date:
                filtered.append(r)
            continue
        if start_date and d < start_date:
            continue
        if end_date and d > end_date:
            continue
        filtered.append(r)

    # Actual date range
    dates = [_parse_date(r["apply_date"]) for r in filtered]
    dates = [d for d in dates if d]
    min_date = min(dates) if dates else None
    max_date = max(dates) if dates else None

    # ── Pipeline counts (grouped, ordered by Notion schema) ──
    stage_counter = Counter(r["stage"] for r in filtered if r["stage"])
    groups_in = status_groups or []
    pipeline = []
    for g in groups_in:
        stages_out = [
            {
                "stage": o["name"],
                "count": stage_counter.get(o["name"], 0),
                "color": o.get("color", "default"),
            }
            for o in g.get("options", [])
        ]
        pipeline.append({
            "group": g.get("name", ""),
            "color": g.get("color", "default"),
            "total": sum(s["count"] for s in stages_out),
            "stages": stages_out,
        })

    # ── Monthly trend (by apply_date) ──
    monthly: dict[str, dict] = defaultdict(lambda: {"total": 0, "by_category": defaultdict(int)})
    for r in filtered:
        d = _parse_date(r["apply_date"])
        if d:
            key = d.strftime("%Y/%m")
            monthly[key]["total"] += 1
            cat = r.get("function", "") or "Other"
            monthly[key]["by_category"][cat] += 1

    trend = []
    for month_key in sorted(monthly):
        entry = monthly[month_key]
        trend.append({
            "month": month_key,
            "total": entry["total"],
            "by_category": dict(entry["by_category"]),
        })

    # ── Weekly trend (by apply_date, ISO week) ──
    weekly: dict[str, dict] = defaultdict(lambda: {"total": 0, "by_category": defaultdict(int), "week_start": None})
    for r in filtered:
        d = _parse_date(r["apply_date"])
        if d:
            # Monday of the ISO week
            week_start = d - timedelta(days=d.weekday())
            key = week_start.isoformat()
            weekly[key]["total"] += 1
            cat = r.get("function", "") or "Other"
            weekly[key]["by_category"][cat] += 1
            if weekly[key]["week_start"] is None:
                weekly[key]["week_start"] = week_start

    trend_weekly = []
    for wk_key in sorted(weekly):
        entry = weekly[wk_key]
        ws = entry["week_start"]
        we = ws + timedelta(days=6)
        trend_weekly.append({
            "week_start": ws.isoformat(),
            "week_end": we.isoformat(),
            "label": f"{ws.month}/{ws.day}",
            "total": entry["total"],
            "by_category": dict(entry["by_category"]),
        })

    # ── Daily trend (by apply_date) ──
    daily: dict[str, dict] = defaultdict(lambda: {"total": 0, "by_category": defaultdict(int)})
    for r in filtered:
        d = _parse_date(r["apply_date"])
        if d:
            key = d.isoformat()  # "YYYY-MM-DD"
            daily[key]["total"] += 1
            cat = r.get("function", "") or "Other"
            daily[key]["by_category"][cat] += 1

    trend_daily = [
        {
            "date": k,
            "label": f"{int(k[5:7])}/{int(k[8:10])}",  # "4/13"
            "total": v["total"],
            "by_category": dict(v["by_category"]),
        }
        for k, v in sorted(daily.items())
    ]

    # ── Source breakdown ──
    source_counter = Counter(r["source"] for r in filtered if r["source"])
    source_breakdown = [
        {"source": s, "count": c} for s, c in source_counter.most_common()
    ]

    # ── Function (job category) breakdown ──
    func_counter = Counter(r["function"] for r in filtered if r["function"])
    job_category_breakdown = [
        {"category": c, "count": n} for c, n in func_counter.most_common()
    ]

    # ── Closed reasons ──
    reason_counter = Counter(r["closed_reason"] for r in filtered if r["closed_reason"])
    closed_reasons = [
        {"reason": reason, "count": reason_counter.get(reason, 0)}
        for reason in CLOSED_STATUSES
    ]

    # ── KPI ──
    n = len(filtered)
    n_months = len(monthly) or 1
    monthly_avg = round(n / n_months, 1)

    # Peak month
    peak_month = max(monthly, key=lambda k: monthly[k]["total"]) if monthly else ""
    peak_count = monthly[peak_month]["total"] if peak_month else 0

    # Top function
    top_func = func_counter.most_common(1)[0] if func_counter else ("N/A", 0)

    # Offer acceptance rate
    offer_count = stage_counter.get(STAGE_SEND_OFFER, 0) + stage_counter.get(STAGE_ACCEPTED, 0)
    hired_count = stage_counter.get(STAGE_ACCEPTED, 0)
    offer_acceptance_rate = round(hired_count / offer_count * 100, 1) if offer_count else 0

    # Average days to hire
    hire_days: list[int] = []
    for r in filtered:
        ad = _parse_date(r["apply_date"])
        hd = _parse_date(r["onboard_date"])
        if ad and hd:
            hire_days.append((hd - ad).days)
    avg_hire_days = round(sum(hire_days) / len(hire_days), 1) if hire_days else 0

    # Active pipeline (exclude closed-bucket statuses)
    active_pipeline = sum(
        1 for r in filtered if r["stage"] and r["stage"] not in CLOSED_STATUSES
    )

    kpi = {
        "total_applicants": n,
        "monthly_average": monthly_avg,
        "peak_month": peak_month,
        "peak_count": peak_count,
        "top_job_category": top_func[0],
        "top_job_category_count": top_func[1],
        "offer_sent": offer_count,
        "hired_count": hired_count,
        "offer_acceptance_rate": offer_acceptance_rate,
        "offer_target": 80,
        "avg_hire_days": avg_hire_days,
        "active_pipeline": active_pipeline,
    }

    # ── Per-position pipelines (active positions only, snapshot from full dataset) ──
    positions = _build_positions(records, status_groups or [])

    return {
        "meta": {
            "total_records": total_records,
            "filtered_records": n,
            "date_range": {
                "start": min_date.isoformat() if min_date else None,
                "end": max_date.isoformat() if max_date else None,
            },
        },
        "kpi": kpi,
        "positions": positions,
        "pipeline": pipeline,
        "trend": trend,
        "trend_weekly": trend_weekly,
        "trend_daily": trend_daily,
        "source_breakdown": source_breakdown,
        "job_category_breakdown": job_category_breakdown,
        "closed_reasons": closed_reasons,
    }


def _build_positions(records: list[dict], status_groups: list[dict]) -> list[dict]:
    """Group records by 應徵職位 and emit one card per active position.

    Funnel buckets are mutually-exclusive — every applicant lands in exactly one
    bucket matching their current Notion status. Bucket order follows the Notion
    schema (status_groups).

    "Active" = the position has at least one applicant whose stage is not a
    closed-bucket status (Rejected / Candidate Rejected / Pending response).
    """
    # Flatten schema → ordered list of {name, color, group, group_color}
    bucket_defs: list[dict] = []
    for g in status_groups:
        for o in g.get("options", []):
            bucket_defs.append({
                "stage": o["name"],
                "color": o.get("color", "default"),
                "group": g.get("name", ""),
                "group_color": g.get("color", "default"),
            })

    by_position: dict[str, list[dict]] = defaultdict(list)
    for r in records:
        title = r.get("position_title", "")
        if not title:
            continue
        by_position[title].append(r)

    today = date.today()
    out: list[dict] = []
    for title, recs in by_position.items():
        stages_now = [r["stage"] for r in recs if r.get("stage")]
        if not any(s and s not in CLOSED_STATUSES for s in stages_now):
            continue  # skip positions with no active candidates

        counts = Counter(stages_now)
        buckets = [
            {**b, "count": counts.get(b["stage"], 0)}
            for b in bucket_defs
        ]

        apply_dates = [_parse_date(r["apply_date"]) for r in recs]
        apply_dates = [d for d in apply_dates if d]
        start = min(apply_dates) if apply_dates else None
        days_open = (today - start).days if start else None

        out.append({
            "title": title,
            "function": recs[0].get("function", ""),
            "total": len(recs),
            "start_date": start.isoformat() if start else None,
            "days_open": days_open,
            "buckets": buckets,
        })

    # Sort: newest recruitment first
    out.sort(key=lambda p: p["start_date"] or "", reverse=True)
    return out
