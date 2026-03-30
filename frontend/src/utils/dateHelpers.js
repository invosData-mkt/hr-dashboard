/** Today's date string (YYYY-MM-DD), computed once on page load. */
export const REF_DATE = new Date().toISOString().slice(0, 10);

function todayStr() {
  return REF_DATE;
}

function monthStart() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-01`;
}

function lastMonth() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  const y = d.getFullYear();
  const m = d.getMonth(); // 0-indexed
  const lastDay = new Date(y, m + 1, 0).getDate();
  const mm = String(m + 1).padStart(2, "0");
  return { start: `${y}-${mm}-01`, end: `${y}-${mm}-${lastDay}` };
}

export const DATE_PRESETS = [
  { label: "本月", getRange: () => ({ start: monthStart(), end: todayStr() }) },
  { label: "上個月", getRange: () => lastMonth() },
  {
    label: "90 天",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 90);
      return { start: d.toISOString().slice(0, 10), end: todayStr() };
    },
  },
  {
    label: "180 天",
    getRange: () => {
      const d = new Date();
      d.setDate(d.getDate() - 180);
      return { start: d.toISOString().slice(0, 10), end: todayStr() };
    },
  },
  { label: "全部", getRange: () => ({ start: "2025-05-01", end: todayStr() }) },
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
