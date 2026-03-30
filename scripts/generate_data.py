"""Fetch all applicants from Notion, aggregate, and write data.json for the frontend."""

import json
import os
import sys

# Add parent dir so we can import functions/fn_impl
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "functions"))

# Load .env if present
env_path = os.path.join(os.path.dirname(__file__), "..", "functions", ".env")
if os.path.exists(env_path):
    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

from fn_impl.aggregator import aggregate
from fn_impl.notion_client import fetch_all_applicants

def main():
    print("Fetching from Notion...")
    records = fetch_all_applicants()
    print(f"Fetched {len(records)} records")

    print("Aggregating...")
    data = aggregate(records)

    out_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "data.json")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)

    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Written to {out_path}")
    print(f"  total_records: {data['meta']['total_records']}")
    print(f"  pipeline: {[p['count'] for p in data['pipeline']]}")
    print(f"  trend months: {len(data['trend'])}")

if __name__ == "__main__":
    main()
