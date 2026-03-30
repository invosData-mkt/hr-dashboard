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

// ── Monthly raw data ──
export const MONTHLY = [
  { key: "2025-05", label: "25/05", total: 64, func: { PM: 32, AM: 12, MKT: 11, HR: 7, Other: 2 } },
  { key: "2025-06", label: "25/06", total: 42, func: { HR: 9, AM: 10, PM: 8, MKT: 5, DA: 5, Other: 5 } },
  { key: "2025-07", label: "25/07", total: 22, func: { PM: 8, HR: 6, AM: 3, DA: 4, BizDev: 1 } },
  { key: "2025-08", label: "25/08", total: 35, func: { PM: 15, HR: 6, MKT: 8, DMKT: 4, Other: 2 } },
  { key: "2025-09", label: "25/09", total: 55, func: { PM: 15, DMKT: 12, HR: 8, AM: 6, MKT: 5, Other: 9 } },
  { key: "2025-10", label: "25/10", total: 67, func: { DMKT: 20, PM: 10, HR: 10, AM: 10, BizDev: 5, Other: 12 } },
  { key: "2025-11", label: "25/11", total: 65, func: { PM: 45, MKT: 6, HR: 6, Other: 8 } },
  { key: "2025-12", label: "25/12", total: 5, func: { PM: 2, AM: 1, HR: 1, Other: 1 } },
  { key: "2026-01", label: "26/01", total: 9, func: { PM: 3, HR: 1, RD: 2, Other: 3 } },
  { key: "2026-02", label: "26/02", total: 16, func: { AM: 7, PM: 4, BizDev: 3, Other: 2 } },
  { key: "2026-03", label: "26/03", total: 14, func: { AM: 7, Designer: 4, DMKT: 2, MKT: 1 } },
];

// ── Weekly raw data ──
export const WEEKLY = [
  { w: "W1", label: "W1\n12/22", s: "2025-12-22", e: "2025-12-28", total: 0, func: {} },
  { w: "W2", label: "W2\n12/29", s: "2025-12-29", e: "2026-01-04", total: 0, func: {} },
  { w: "W3", label: "W3\n1/5", s: "2026-01-05", e: "2026-01-11", total: 0, func: {} },
  { w: "W4", label: "W4\n1/12", s: "2026-01-12", e: "2026-01-18", total: 0, func: {} },
  { w: "W5", label: "W5\n1/19", s: "2026-01-19", e: "2026-01-25", total: 6, func: { SrPMApp: 3, Recruiter: 1, Other: 2 } },
  { w: "W6", label: "W6\n1/26", s: "2026-01-26", e: "2026-02-01", total: 3, func: { SrPMApp: 2, Other: 1 } },
  { w: "W7", label: "W7\n2/2", s: "2026-02-02", e: "2026-02-08", total: 3, func: { AM: 1, BizDev: 2 } },
  { w: "W8", label: "W8\n2/9", s: "2026-02-09", e: "2026-02-15", total: 5, func: { SrPMApp: 1, PM: 1, BizDev: 3 } },
  { w: "W9", label: "W9\n2/16", s: "2026-02-16", e: "2026-02-22", total: 0, func: {} },
  { w: "W10", label: "W10\n2/23", s: "2026-02-23", e: "2026-03-01", total: 8, func: { AM: 7, SrPMApp: 1 } },
  { w: "W11", label: "W11\n3/2", s: "2026-03-02", e: "2026-03-08", total: 5, func: { AM: 3, Designer: 2 } },
  { w: "W12", label: "W12\n3/9", s: "2026-03-09", e: "2026-03-15", total: 5, func: { AM: 2, Designer: 3 } },
  { w: "W13", label: "W13\n3/16", s: "2026-03-16", e: "2026-03-19", total: 2, func: { Marcom2C: 1, DMKT: 1 } },
];

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
