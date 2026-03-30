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
