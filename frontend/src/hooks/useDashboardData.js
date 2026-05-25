import { useCallback, useEffect, useMemo, useState } from "react";
import { FUNC_LABELS } from "../utils/constants";
import {
  DATE_PRESETS,
  DEFAULT_PRESET,
  fmtDate,
  getGranularity,
  isValidRange,
} from "../utils/dateHelpers";

const initialPresetDef = DATE_PRESETS.find((p) => p.label === DEFAULT_PRESET);

export function useDashboardData() {
  const [dateRange, setDateRange] = useState(initialPresetDef.getRange());
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESET);
  const [apiData, setApiData] = useState(null);

  // Load real data from data.json
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.meta) setApiData(d);
      })
      .catch(() => {});
  }, []);

  const setPreset = useCallback(
    (label, range) => {
      // Allow "全部" to re-resolve with data min once meta is available
      const preset = DATE_PRESETS.find((p) => p.label === label);
      const resolved =
        range ||
        (preset ? preset.getRange(apiData?.meta?.date_range?.start) : null);
      setActivePreset(label);
      if (resolved) setDateRange(resolved);
    },
    [apiData]
  );

  const setCustomRange = useCallback((start, end) => {
    // Auto-correct inverted ranges: if user picks start > end, snap the other side.
    if (start && end && start > end) {
      end = start;
    }
    setActivePreset(null);
    setDateRange({ start, end });
  }, []);

  const computed = useMemo(() => {
    if (!isValidRange(dateRange.start, dateRange.end)) return null;
    if (apiData) return transformApiData(apiData, dateRange);
    return null;
  }, [dateRange, apiData]);

  return { data: computed, activePreset, dateRange, setPreset, setCustomRange };
}

/** Transform the API/data.json response into the format components expect. */
function transformApiData(raw, dateRange) {
  const { start, end } = dateRange;
  const gran = getGranularity(start, end);

  let periods, labels, totals;

  if (gran === "day") {
    let daily = raw.trend_daily || [];
    if (start) daily = daily.filter((d) => d.date >= start);
    if (end) daily = daily.filter((d) => d.date <= end);
    periods = daily;
    labels = daily.map((d) => d.label);
    totals = daily.map((d) => d.total);
  } else if (gran === "week") {
    let weekly = raw.trend_weekly || [];
    weekly = weekly.filter((w) => {
      if (w.week_end < start) return false;
      if (w.week_start > end) return false;
      return true;
    });
    periods = weekly;
    labels = weekly.map((w) => w.label);
    totals = weekly.map((w) => w.total);
  } else {
    // month
    let trend = raw.trend || [];
    // t.month = "YYYY/MM" → compare on ISO "YYYY-MM"
    const startYm = start.slice(0, 7).replace("-", "/");
    const endYm = end.slice(0, 7).replace("-", "/");
    trend = trend.filter((t) => t.month >= startYm && t.month <= endYm);
    periods = trend;
    labels = trend.map((t) => {
      const [y, m] = t.month.split("/");
      return y.slice(2) + "/" + m;
    });
    totals = trend.map((t) => t.total);
  }

  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const nPeriods = periods.length || 1;
  const avg = +(grandTotal / nPeriods).toFixed(1);

  const peakIdx = totals.length ? totals.indexOf(Math.max(...totals)) : -1;
  const peakLabel = peakIdx >= 0 ? labels[peakIdx] : "—";
  const peakVal = peakIdx >= 0 ? totals[peakIdx] : 0;

  // Aggregate function totals from periods
  const funcMap = {};
  periods.forEach((t) => {
    Object.entries(t.by_category || {}).forEach(([k, v]) => {
      funcMap[k] = (funcMap[k] || 0) + v;
    });
  });
  const allFuncKeys = Object.entries(funcMap)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);

  const funcEntries = allFuncKeys.map((k) => ({ k, v: funcMap[k] }));
  const topFunc = funcEntries[0] || null;

  const topKeys = allFuncKeys.slice(0, 6);
  const trendData = periods.map((t, i) => {
    const entry = { label: labels[i], total: t.total };
    topKeys.forEach((k) => {
      entry[k] = (t.by_category && t.by_category[k]) || 0;
    });
    return entry;
  });

  const jobEntries = funcEntries.slice(0, 6);
  const jobData = jobEntries.map((e) => ({
    key: e.k,
    label: FUNC_LABELS[e.k] || e.k,
    count: e.v,
  }));
  const jobTotal = jobData.reduce((a, d) => a + d.count, 0);

  const pipeline = raw.pipeline || [];
  const positions = raw.positions || [];
  const sourceBreakdown = raw.source_breakdown || [];
  const closedReasons = raw.closed_reasons || [];
  const kpi = raw.kpi || {};

  const dateLabel =
    start && end ? `${fmtDate(start)} – ${fmtDate(end)}` : "全部期間";

  return {
    gran,
    grandTotal: grandTotal || kpi.total_applicants || 0,
    nPeriods,
    avg,
    peakLabel,
    peakVal,
    topFunc,
    trendData,
    topFuncKeys: topKeys,
    jobData,
    jobTotal,
    dateLabel,
    pipeline,
    positions,
    sourceBreakdown,
    closedReasons,
    kpi,
    meta: raw.meta,
  };
}
