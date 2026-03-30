"""Configuration: status mapping, environment variables, constants."""

import os

# ── Notion property names (matching actual DB schema) ──
PROP_NAME = "應徵者"             # title
PROP_STATUS = "應徵狀態"         # select
PROP_APPLY_DATE = "收件日期"     # date
PROP_SOURCE = "履歷來源"         # select
PROP_FUNCTION = "Function"       # select (job function / category)
PROP_POSITION = "應徵職位"       # rich_text
PROP_ONBOARD_DATE = "onboard Date"  # date
PROP_TEAM = "Team"               # select

# ── Notion status → Dashboard pipeline stage ──
STATUS_TO_STAGE = {
    "Applied": "初步篩選",
    "In Review": "初步篩選",
    "Phone Screen": "HR 電話",
    "First Interview": "一面",
    "Final interview": "最終面試",
    "Send Offer": "發出 Offer",
    "Accepted": "已錄取",
    "Rejected": "已結案",
    "Candidate Rejected": "已結案",
    "Pending response": "已結案",
}

PIPELINE_STAGES = [
    "初步篩選",
    "HR 電話",
    "一面",
    "最終面試",
    "發出 Offer",
    "已錄取",
    "已結案",
]

# ── Statuses considered "closed" (結案原因 sub-categories) ──
CLOSED_STATUSES = ["Rejected", "Candidate Rejected", "Pending response"]

# ── Notion Function → Dashboard abbreviation ──
FUNCTION_TO_ABBR = {
    "Product Management": "PM",
    "Account Management": "AM",
    "Human Resourcement": "HR",
    "DMKT": "DMKT",
    "Marketing": "MKT",
    "Business development": "BizDev",
    "Business Analytics": "DA",
    "Design": "Designer",
    "Front-End": "RD",
    "Engineering": "RD",
}

# ── Environment variables ──
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
NOTION_DB_ID = os.environ.get("NOTION_DB_ID", "")
GSHEET_SPREADSHEET_ID = os.environ.get("GSHEET_SPREADSHEET_ID", "")
GSHEET_SERVICE_ACCOUNT_JSON = os.environ.get("GSHEET_SERVICE_ACCOUNT_JSON", "")
