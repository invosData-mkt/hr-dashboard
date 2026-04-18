/**
 * Date helpers — all operations are relative to Asia/Taipei.
 *
 * Browsers ship without a reliable way to do "today in a specific timezone",
 * so we derive a TPE-local YYYY-MM-DD string via Intl.DateTimeFormat and then
 * use plain string/Date math (UTC-based) to shift days. Because we never
 * round-trip through local time, DST / user timezone doesn't leak in.
 */

/** Today's date string (YYYY-MM-DD) in Asia/Taipei, computed once on page load. */
function todayTpe() {
  // "en-CA" locale formats as "YYYY-MM-DD".
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export const REF_DATE = todayTpe();

/** Add N days to a YYYY-MM-DD string; returns a YYYY-MM-DD string. */
export function addDays(iso, n) {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + n);
  return dt.toISOString().slice(0, 10);
}

/** First day of a given YYYY-MM-DD's month, as YYYY-MM-DD. */
function startOfMonth(iso) {
  return iso.slice(0, 7) + "-01";
}

/** Last day of a given YYYY-MM-DD's month, as YYYY-MM-DD. */
function endOfMonth(iso) {
  const [y, m] = iso.split("-").map(Number);
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate(); // day 0 of next month
  return `${iso.slice(0, 7)}-${String(last).padStart(2, "0")}`;
}

/** First day of the year for a given YYYY-MM-DD, as YYYY-MM-DD. */
function startOfYear(iso) {
  return iso.slice(0, 4) + "-01-01";
}

/** Fallback min date when meta.date_range.start is unavailable. */
export const DATA_MIN_FALLBACK = "2025-05-01";

export const DATE_PRESETS = [
  {
    label: "昨天",
    getRange: () => {
      const y = addDays(REF_DATE, -1);
      return { start: y, end: y };
    },
  },
  {
    label: "過去 7 天",
    getRange: () => ({ start: addDays(REF_DATE, -6), end: REF_DATE }),
  },
  {
    label: "本月",
    getRange: () => ({ start: startOfMonth(REF_DATE), end: REF_DATE }),
  },
  {
    label: "上個月",
    getRange: () => {
      const firstOfThis = startOfMonth(REF_DATE);
      const lastOfPrev = addDays(firstOfThis, -1);
      return { start: startOfMonth(lastOfPrev), end: endOfMonth(lastOfPrev) };
    },
  },
  {
    label: "90 天",
    getRange: () => ({ start: addDays(REF_DATE, -89), end: REF_DATE }),
  },
  {
    label: "今年至今",
    getRange: () => ({ start: startOfYear(REF_DATE), end: REF_DATE }),
  },
  {
    label: "全部",
    getRange: (metaStart) => ({
      start: metaStart || DATA_MIN_FALLBACK,
      end: REF_DATE,
    }),
  },
];

/** Default preset shown on first load. */
export const DEFAULT_PRESET = "昨天";

/** Returns number of days between two YYYY-MM-DD strings (b - a). */
export function diffDays(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

/**
 * Determine the trend granularity based on range length.
 * - ≤ 31 days → day
 * - ≤ 180 days → week
 * - > 180 days → month
 */
export function getGranularity(start, end) {
  const d = diffDays(start, end);
  if (d <= 31) return "day";
  if (d <= 180) return "week";
  return "month";
}

/** True iff start and end are both ISO strings and start <= end. */
export function isValidRange(start, end) {
  if (!start || !end) return false;
  return start <= end; // ISO 8601 sorts lexicographically
}

/** Format a Date or YYYY-MM-DD string as "YYYY/M/D". */
export function fmtDate(d) {
  if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split("-").map(Number);
    return `${y}/${m}/${day}`;
  }
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
}
