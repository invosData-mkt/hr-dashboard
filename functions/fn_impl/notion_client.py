"""Read applicant records from a Notion database via HTTP API with pagination."""

import re
import time

import httpx

from .config import (
    CLOSED_STATUSES,
    FUNCTION_TO_ABBR,
    NOTION_DB_ID,
    NOTION_TOKEN,
    POSITION_TO_ABBR,
    PROP_APPLY_DATE,
    PROP_FUNCTION,
    PROP_NAME,
    PROP_ONBOARD_DATE,
    PROP_POSITION,
    PROP_SOURCE,
    PROP_STATUS,
)

_NOTION_API = "https://api.notion.com/v1"
_NOTION_VERSION = "2022-06-28"

# Cache for resolved relation page titles (page_id -> title string)
_relation_cache: dict = {}


def _headers():
    return {
        "Authorization": f"Bearer {NOTION_TOKEN}",
        "Notion-Version": _NOTION_VERSION,
        "Content-Type": "application/json",
    }


def _extract_text(prop: dict) -> str:
    ptype = prop.get("type", "")
    if ptype == "title":
        parts = prop.get("title", [])
        return parts[0]["plain_text"] if parts else ""
    if ptype == "rich_text":
        parts = prop.get("rich_text", [])
        return parts[0]["plain_text"] if parts else ""
    if ptype == "select":
        sel = prop.get("select")
        return sel["name"] if sel else ""
    if ptype == "status":
        sel = prop.get("status")
        return sel["name"] if sel else ""
    if ptype == "date":
        d = prop.get("date")
        return d["start"] if d else ""
    if ptype == "created_time":
        return (prop.get("created_time") or "")[:10]
    if ptype == "rollup":
        arr = prop.get("rollup", {}).get("array", [])
        if arr and arr[0].get("type") == "select":
            sel = arr[0].get("select")
            return sel["name"] if sel else ""
        return ""
    return ""


def _parse_chinese_date(s: str) -> str:
    """Parse '2025年10月1日 下午1:41' → '2025-10-01'."""
    if not s:
        return ""
    m = re.match(r"(\d{4})年(\d{1,2})月(\d{1,2})日", s)
    if m:
        return f"{m.group(1)}-{int(m.group(2)):02d}-{int(m.group(3)):02d}"
    return ""


def _resolve_relation_title(page_id: str) -> str:
    """Fetch a related page's title, with caching."""
    if page_id in _relation_cache:
        return _relation_cache[page_id]
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.get(
                f"{_NOTION_API}/pages/{page_id}",
                headers=_headers(),
            )
            resp.raise_for_status()
            props = resp.json().get("properties", {})
            for pval in props.values():
                if pval.get("type") == "title":
                    parts = pval.get("title", [])
                    title = parts[0]["plain_text"] if parts else ""
                    _relation_cache[page_id] = title
                    return title
    except Exception:
        pass
    _relation_cache[page_id] = ""
    return ""


def _resolve_position(props: dict) -> tuple[str, str]:
    """Resolve 應徵職位 relation → (full title, abbreviation). Returns ("", "") if unavailable."""
    pos_prop = props.get(PROP_POSITION, {})
    if pos_prop.get("type") != "relation":
        return "", ""
    rels = pos_prop.get("relation", [])
    if not rels:
        return "", ""
    page_id = rels[0].get("id", "")
    if not page_id:
        return "", ""
    title = _resolve_relation_title(page_id)
    if not title:
        return "", ""
    abbr = POSITION_TO_ABBR.get(title) or POSITION_TO_ABBR.get(title.strip()) or ""
    return title.strip(), abbr


def _parse_page(page: dict) -> dict:
    props = page.get("properties", {})

    raw_status = _extract_text(props.get(PROP_STATUS, {}))
    stage = raw_status
    closed_reason = raw_status if raw_status in CLOSED_STATUSES else ""

    # Priority: 應徵職位 relation → Function rollup → "Other"
    position_title, func_abbr = _resolve_position(props)
    if not func_abbr:
        raw_func = _extract_text(props.get(PROP_FUNCTION, {}))
        func_abbr = FUNCTION_TO_ABBR.get(raw_func, raw_func or "Other")

    # apply_date: use 收件日期, fallback to Created time, then page created_time
    apply_date = _extract_text(props.get(PROP_APPLY_DATE, {}))
    if not apply_date:
        ct = _extract_text(props.get("Created time", {}))
        if ct and re.match(r"\d{4}-\d{2}-\d{2}", ct):
            apply_date = ct[:10]
        else:
            apply_date = _parse_chinese_date(ct)
    if not apply_date:
        apply_date = (page.get("created_time") or "")[:10]

    return {
        "name": _extract_text(props.get(PROP_NAME, {})),
        "raw_status": raw_status,
        "stage": stage,
        "closed_reason": closed_reason,
        "apply_date": apply_date,
        "source": _extract_text(props.get(PROP_SOURCE, {})),
        "function": func_abbr,
        "position_title": position_title,
        "onboard_date": _extract_text(props.get(PROP_ONBOARD_DATE, {})),
    }


def _query_with_retry(cursor=None, retries=3):
    body = {"page_size": 100}
    if cursor:
        body["start_cursor"] = cursor
    for attempt in range(retries):
        try:
            with httpx.Client(timeout=30) as client:
                resp = client.post(
                    f"{_NOTION_API}/databases/{NOTION_DB_ID}/query",
                    headers=_headers(),
                    json=body,
                )
                resp.raise_for_status()
                return resp.json()
        except Exception:
            if attempt < retries - 1:
                time.sleep(2)
            else:
                raise


def _deduplicate(records: list, stage_order: dict[str, int]) -> list:
    """Remove duplicates by (name, apply_date). Keep the one with the furthest pipeline stage."""
    seen = {}
    for r in records:
        key = (r["name"], r["apply_date"])
        if key in seen:
            existing = seen[key]
            if stage_order.get(r["stage"], 0) > stage_order.get(existing["stage"], 0):
                seen[key] = r
        else:
            seen[key] = r
    return list(seen.values())


def fetch_status_schema() -> list[dict]:
    """Fetch the Notion DB schema for PROP_STATUS and return its groups in order.

    Returns a list of group dicts:
        [{"name": "In progress", "color": "blue",
          "options": [{"name": "Phone Screen", "color": "brown"}, ...]},
         ...]

    Options inside each group preserve Notion's option ordering.
    Returns [] if the property is missing or the request fails.
    """
    try:
        with httpx.Client(timeout=30) as client:
            resp = client.get(
                f"{_NOTION_API}/databases/{NOTION_DB_ID}",
                headers=_headers(),
            )
            resp.raise_for_status()
            schema = resp.json()
    except Exception as e:
        print(f"fetch_status_schema failed: {e}")
        return []

    prop = schema.get("properties", {}).get(PROP_STATUS, {})
    ptype = prop.get("type")
    body = prop.get(ptype, {}) if ptype in ("status", "select") else {}

    options = body.get("options", []) or []
    option_by_id = {o["id"]: o for o in options}

    groups = body.get("groups")
    if groups:
        out = []
        for g in groups:
            opts = [option_by_id[oid] for oid in g.get("option_ids", []) if oid in option_by_id]
            out.append({
                "name": g.get("name", ""),
                "color": g.get("color", "default"),
                "options": [{"name": o.get("name", ""), "color": o.get("color", "default")} for o in opts],
            })
        return out

    # Select properties have no groups — return a single synthetic group.
    return [{
        "name": "",
        "color": "default",
        "options": [{"name": o.get("name", ""), "color": o.get("color", "default")} for o in options],
    }]


def fetch_all_applicants(stage_order: dict[str, int] | None = None) -> list[dict]:
    """Query the Notion database with pagination, return deduplicated normalised dicts.

    stage_order maps stage name → position; used to pick the furthest stage on dedupe.
    """
    results: list[dict] = []
    has_more = True
    cursor = None

    while has_more:
        data = _query_with_retry(cursor)
        for page in data.get("results", []):
            results.append(_parse_page(page))
        has_more = data.get("has_more", False)
        cursor = data.get("next_cursor")
        if has_more:
            time.sleep(0.3)

    deduped = _deduplicate(results, stage_order or {})
    if len(deduped) < len(results):
        print(f"Deduplicated: {len(results)} → {len(deduped)} ({len(results) - len(deduped)} duplicates removed)")

    return deduped
