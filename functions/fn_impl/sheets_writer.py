"""Write aggregated data to Google Sheets using gspread."""

import json

import gspread
from google.oauth2.service_account import Credentials

from .config import GSHEET_SERVICE_ACCOUNT_JSON, GSHEET_SPREADSHEET_ID

SCOPES = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
]


def _get_client() -> gspread.Client:
    info = json.loads(GSHEET_SERVICE_ACCOUNT_JSON)
    creds = Credentials.from_service_account_info(info, scopes=SCOPES)
    return gspread.authorize(creds)


def _ensure_worksheet(spreadsheet: gspread.Spreadsheet, title: str, rows: int = 100, cols: int = 20) -> gspread.Worksheet:
    try:
        return spreadsheet.worksheet(title)
    except gspread.WorksheetNotFound:
        return spreadsheet.add_worksheet(title=title, rows=rows, cols=cols)


def write_to_sheets(data: dict) -> None:
    """Write pipeline summary, monthly trend, and source breakdown to Google Sheets."""
    gc = _get_client()
    sh = gc.open_by_key(GSHEET_SPREADSHEET_ID)

    # ── Pipeline Summary ──
    ws = _ensure_worksheet(sh, "Pipeline Summary")
    rows = [["階段", "人數"]]
    for item in data["pipeline"]:
        rows.append([item["stage"], item["count"]])
    ws.clear()
    ws.update(range_name="A1", values=rows)

    # ── Monthly Trend ──
    ws = _ensure_worksheet(sh, "Monthly Trend")
    rows = [["月份", "總數"]]
    for item in data["trend"]:
        rows.append([item["month"], item["total"]])
    ws.clear()
    ws.update(range_name="A1", values=rows)

    # ── Source Breakdown ──
    ws = _ensure_worksheet(sh, "Source Breakdown")
    rows = [["來源", "人數"]]
    for item in data["source_breakdown"]:
        rows.append([item["source"], item["count"]])
    ws.clear()
    ws.update(range_name="A1", values=rows)
