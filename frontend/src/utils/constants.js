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

// ── Notion option colors → CSS (text/dot color + bar background) ──
// Mirrors Notion's official palette. Used to render dynamic pipeline stages.
export const NOTION_COLOR_MAP = {
  default: { color: "#787774", barColor: "#E3E2E0" },
  gray:    { color: "#787774", barColor: "#E3E2E0" },
  brown:   { color: "#9F6B53", barColor: "#EAE4E0" },
  orange:  { color: "#D9730D", barColor: "#FAEBDD" },
  yellow:  { color: "#CB912F", barColor: "#FBF3DB" },
  green:   { color: "#448361", barColor: "#DDEDE3" },
  blue:    { color: "#337EA9", barColor: "#DDEBF1" },
  purple:  { color: "#9065B0", barColor: "#EAE4F2" },
  pink:    { color: "#C14C8A", barColor: "#F4DFEB" },
  red:     { color: "#D44C47", barColor: "#FBE4E4" },
};

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
