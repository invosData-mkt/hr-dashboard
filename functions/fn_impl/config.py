"""Configuration: status mapping, environment variables, constants."""

import os

# ── Notion property names (matching actual DB schema) ──
PROP_NAME = "應徵者"             # title
PROP_STATUS = "應徵狀態"         # status
PROP_APPLY_DATE = "收件日期"     # date
PROP_SOURCE = "履歷來源"         # select
PROP_FUNCTION = "Function"       # select (job function / category)
PROP_POSITION = "應徵職位"       # rich_text
PROP_ONBOARD_DATE = "onboard Date"  # date
PROP_TEAM = "Team"               # select

# Stage date properties — used for cumulative funnel calculation.
# A non-empty date means the candidate reached that stage.
PROP_PHONE_SCREEN_DATE = "Phone Screen 日期"
PROP_FIRST_INTERVIEW_DATE = "First Interview 日期"
# Notion's "Second Interview 日期" actually tracks the "Final interview" status
# (the team named it differently — we keep both for clarity).
PROP_FINAL_INTERVIEW_DATE = "Second Interview 日期"

# Pipeline stages and their grouping are now read dynamically from the Notion
# Status property schema (see notion_client.fetch_status_schema).

# Statuses counted as "closed reason" buckets in the dashboard's 結案原因 chart.
# These must match Notion option names exactly.
CLOSED_STATUSES = ["Rejected", "Candidate Rejected", "Pending response"]

# Stage names used by KPI calculations. Must match Notion option names exactly.
STAGE_SEND_OFFER = "Send Offer"
STAGE_ACCEPTED = "Accepted"

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

# ── 應徵職位 (Position name) → Dashboard abbreviation ──
# Priority: match position name first, then fallback to Function rollup
POSITION_TO_ABBR = {
    "Product Lead / GPM": "PM",
    "Product Manager 產品經理": "PM",
    "Senior Product Manager - App | 資深產品經理": "PM",
    "Senior Product Manager - Insight | 資深產品經理": "PM",
    "Senior Product Manager - MarTech | 資深產品經理": "PM",
    "Associate Product Manager - MarTech | 產品經理": "PM",
    "Account Manager (AM) 客戶成功經理": "AM",
    " Account Manager (AM) 客戶成功經理 ": "AM",
    "Associate Account Manager": "AM",
    "客戶企劃 Account Planner": "AM",
    "客戶企劃 實習生 Account Planner Trainee": "AM",
    "人力資源管理師 / HRBP": "HR",
    "Associate Recruiter Specialist 人資招募專員\t": "HR",
    "Associate Recruiter Specialist 人資招募專員": "HR",
    "Data-Driven Marketing 數據行銷": "DMKT",
    "Associate Data-Driven Marketing 數據行銷": "DMKT",
    "Senior Marketing Specialist / 資深行銷專員 (2B)": "MKT",
    "行銷企劃經理 2B Marcom Manager": "MKT",
    "行銷企劃經理 Marcom Manager（2C會員行銷與App推廣）": "MKT",
    "MKT 實習生": "MKT",
    "(Senior) Business Development Manager (資深) 商務開發經理": "BizDev",
    "Junior Business Development / 初階商務開發專員": "BizDev",
    "Senior Business Data Analyst 資深商務數據分析師": "DA",
    "Product Designer": "Designer",
    "Front-End Engineer": "RD",
    "MB-Backend": "RD",
}

# ── Environment variables ──
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
NOTION_DB_ID = os.environ.get("NOTION_DB_ID", "")
GSHEET_SPREADSHEET_ID = os.environ.get("GSHEET_SPREADSHEET_ID", "")
GSHEET_SERVICE_ACCOUNT_JSON = os.environ.get("GSHEET_SERVICE_ACCOUNT_JSON", "")
