// Reference date matching the demo snapshot
export const REF_DATE = "2026-03-19";

export const DATE_PRESETS = [
  { label: "本月", getRange: () => ({ start: "2026-03-01", end: REF_DATE }) },
  { label: "上個月", getRange: () => ({ start: "2026-02-01", end: "2026-02-28" }) },
  {
    label: "90 天",
    getRange: () => {
      const d = new Date(REF_DATE);
      d.setDate(d.getDate() - 90);
      return { start: d.toISOString().slice(0, 10), end: REF_DATE };
    },
  },
  {
    label: "180 天",
    getRange: () => {
      const d = new Date(REF_DATE);
      d.setDate(d.getDate() - 180);
      return { start: d.toISOString().slice(0, 10), end: REF_DATE };
    },
  },
  { label: "全部", getRange: () => ({ start: "2025-05-01", end: REF_DATE }) },
];

/** Returns number of days between two date strings. */
export function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/** Determine granularity: >90 days → "month", else → "week". */
export function getGranularity(start, end) {
  return diffDays(start, end) > 90 ? "month" : "week";
}

/** Format a Date or date-string to "YYYY/M/D". */
export function fmtDate(d) {
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
}
