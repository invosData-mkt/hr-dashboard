// ── Function / Category colors & labels ──
export const FUNC_COLORS = {
  PM: "#378ADD",
  AM: "#1D9E75",
  MKT: "#EF9F27",
  HR: "#7F77DD",
  DMKT: "#0F6E56",
  DA: "#D85A30",
  BizDev: "#888780",
  Designer: "#BA7517",
  SrPMApp: "#E24B4A",
  Recruiter: "#534AB7",
  RD: "#4285f4",
  Other: "#aaa",
  Marcom2C: "#639922",
};

export const FUNC_LABELS = {
  PM: "Product Mgmt",
  AM: "Account Mgmt",
  MKT: "行銷",
  HR: "HR",
  DMKT: "Data Marketing",
  DA: "Business Analytics",
  BizDev: "Biz Dev",
  Designer: "Product Designer",
  SrPMApp: "Sr PM App",
  Recruiter: "Assoc. Recruiter",
  RD: "Engineering",
  Other: "其他",
  Marcom2C: "行銷 2C",
};

// ── Pipeline snapshot (static, not affected by date filter) ──
export const PIPELINE_SNAPSHOT = [
  { stage: "初步篩選", count: 66, color: "#639922", barColor: "#C0DD97" },
  { stage: "HR 電話", count: 14, color: "#378ADD", barColor: "#85B7EB" },
  { stage: "一面", count: 11, color: "#7F77DD", barColor: "#AFA9EC" },
  { stage: "最終面試", count: 6, color: "#D85A30", barColor: "#F0997B" },
  { stage: "發出 Offer", count: 2, color: "#993C1D", barColor: "#F5C4B3" },
  { stage: "已錄取", count: 14, color: "#1D9E75", barColor: "#5DCAA5" },
  { stage: "已結案", count: 281, color: "#888", barColor: "#D3D1C7" },
];

// ── Source breakdown (static) ──
export const SOURCE_DATA = [
  { source: "104", count: 168 },
  { source: "LinkedIn", count: 95 },
  { source: "Cake", count: 52 },
  { source: "Yourator", count: 38 },
  { source: "Referal", count: 25 },
  { source: "HeadHunter", count: 11 },
];
export const SOURCE_COLORS = ["#378ADD", "#7F77DD", "#EF9F27", "#1D9E75", "#D85A30", "#BA7517"];

// ── Closed reasons (static) ──
export const CLOSED_REASONS_DATA = [
  { reason: "Rejected", count: 162, color: "#E24B4A" },
  { reason: "Candidate Rejected", count: 72, color: "#EF9F27" },
  { reason: "Pending response", count: 47, color: "#888780" },
];

// ── Offer (static) ──
export const OFFER_DATA = {
  offerSent: 16,
  hired: 14,
  rate: 88,
  target: 80,
};
