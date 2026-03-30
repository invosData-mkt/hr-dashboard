"""Read applicant records from a Notion database via HTTP API with pagination."""

import time

import httpx

from .config import (
    CLOSED_STATUSES,
    FUNCTION_TO_ABBR,
    NOTION_DB_ID,
    NOTION_TOKEN,
    PROP_APPLY_DATE,
    PROP_FUNCTION,
    PROP_NAME,
    PROP_ONBOARD_DATE,
    PROP_SOURCE,
    PROP_STATUS,
    STATUS_TO_STAGE,
)

_NOTION_API = "https://api.notion.com/v1"
_NOTION_VERSION = "2022-06-28"


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
    if ptype == "date":
        d = prop.get("date")
        return d["start"] if d else ""
    return ""


def _parse_page(page: dict) -> dict:
    props = page.get("properties", {})

    raw_status = _extract_text(props.get(PROP_STATUS, {}))
    stage = STATUS_TO_STAGE.get(raw_status, "")
    closed_reason = raw_status if raw_status in CLOSED_STATUSES else ""

    raw_func = _extract_text(props.get(PROP_FUNCTION, {}))
    func_abbr = FUNCTION_TO_ABBR.get(raw_func, raw_func or "Other")

    return {
        "name": _extract_text(props.get(PROP_NAME, {})),
        "raw_status": raw_status,
        "stage": stage,
        "closed_reason": closed_reason,
        "apply_date": _extract_text(props.get(PROP_APPLY_DATE, {})),
        "source": _extract_text(props.get(PROP_SOURCE, {})),
        "function": func_abbr,
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


def fetch_all_applicants() -> list[dict]:
    """Query the Notion database with pagination, return normalised dicts."""
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

    return results
