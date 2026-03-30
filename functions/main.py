"""Firebase Cloud Functions entry point.

- sync_notion_to_sheets: scheduled every 6 hours, syncs Notion → Google Sheets.
- dashboard_data: HTTP API returning aggregated JSON for the React frontend.
"""

import json

from firebase_functions import https_fn, options, scheduler_fn

from fn_impl.aggregator import aggregate
from fn_impl.notion_client import fetch_all_applicants
from fn_impl.sheets_writer import write_to_sheets

REGION = "asia-east1"


@scheduler_fn.on_schedule(
    schedule="every 6 hours",
    region=REGION,
)
def sync_notion_to_sheets(event: scheduler_fn.ScheduledEvent) -> None:
    """Fetch all applicants from Notion, aggregate, and write to Google Sheets."""
    records = fetch_all_applicants()
    data = aggregate(records)
    write_to_sheets(data)
    print(f"Synced {len(records)} records to Google Sheets.")


@https_fn.on_request(
    region=REGION,
    cors=options.CorsOptions(cors_origins="*", cors_methods=["get"]),
)
def dashboard_data(req: https_fn.Request) -> https_fn.Response:
    """Return aggregated dashboard JSON.

    Query params:
        start (str): ISO date for range start (optional).
        end (str):   ISO date for range end (optional).
    """
    start = req.args.get("start", "")
    end = req.args.get("end", "")

    records = fetch_all_applicants()
    data = aggregate(records, start=start, end=end)

    return https_fn.Response(
        json.dumps(data, ensure_ascii=False),
        status=200,
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
