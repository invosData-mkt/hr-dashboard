"""Aggregate applicant records into dashboard-ready statistics."""

from __future__ import annotations

from collections import Counter, defaultdict
from datetime import date, datetime, timedelta
from typing import Optional

from .config import CLOSED_STATUSES, PIPELINE_STAGES


def _parse_date(s: str) -> Optional[date]:
    if not s:
        return None
    try:
        return datetime.fromisoformat(s).date()
    except ValueError:
        return None


def aggregate(records: list[dict], start: str = "", end: str = "") -> dict:
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

    # ── Pipeline counts (ordered, uses "stage" field) ──
    stage_counter = Counter(r["stage"] for r in filtered if r["stage"])
    pipeline = [{"stage": s, "count": stage_counter.get(s, 0)} for s in PIPELINE_STAGES]

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
    offer_count = stage_counter.get("發出 Offer", 0) + stage_counter.get("已錄取", 0)
    hired_count = stage_counter.get("已錄取", 0)
    offer_acceptance_rate = round(hired_count / offer_count * 100, 1) if offer_count else 0

    # Average days to hire
    hire_days: list[int] = []
    for r in filtered:
        ad = _parse_date(r["apply_date"])
        hd = _parse_date(r["onboard_date"])
        if ad and hd:
            hire_days.append((hd - ad).days)
    avg_hire_days = round(sum(hire_days) / len(hire_days), 1) if hire_days else 0

    # Active pipeline (exclude 已結案)
    active_pipeline = sum(1 for r in filtered if r["stage"] and r["stage"] != "已結案")

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
        "pipeline": pipeline,
        "trend": trend,
        "trend_weekly": trend_weekly,
        "source_breakdown": source_breakdown,
        "job_category_breakdown": job_category_breakdown,
        "closed_reasons": closed_reasons,
    }
