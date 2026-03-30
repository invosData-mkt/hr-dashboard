import { useCallback, useEffect, useMemo, useState } from "react";
import { FUNC_LABELS, MONTHLY, WEEKLY } from "../utils/constants";
import { REF_DATE, diffDays, fmtDate, getGranularity } from "../utils/dateHelpers";

export function useDashboardData() {
  const [dateRange, setDateRange] = useState({ start: "2025-05-01", end: REF_DATE });
  const [activePreset, setActivePreset] = useState("全部");
  const [apiData, setApiData] = useState(null);

  // Try to load real data from data.json
  useEffect(() => {
    fetch(import.meta.env.BASE_URL + "data.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.meta) setApiData(d);
      })
      .catch(() => {});
  }, []);

  const setPreset = useCallback((label, range) => {
    setActivePreset(label);
    setDateRange(range);
  }, []);

  const setCustomRange = useCallback((start, end) => {
    setActivePreset(null);
    setDateRange({ start, end });
  }, []);

  const computed = useMemo(() => {
    // If we have real API data, use it directly
    if (apiData) return transformApiData(apiData, dateRange);
    // Otherwise, fall back to embedded demo data
    return computeFromDemoData(dateRange);
  }, [dateRange, apiData]);

  return { data: computed, activePreset, dateRange, setPreset, setCustomRange };
}

/** Transform the API/data.json response into the format components expect. */
function transformApiData(raw, dateRange) {
  const { start, end } = dateRange;
  const gran = start && end ? getGranularity(start, end) : "month";

  let periods, labels, totals;

  if (gran === "week") {
    // Use weekly trend data
    let weekly = raw.trend_weekly || [];
    if (start || end) {
      weekly = weekly.filter((w) => {
        if (start && w.week_end < start) return false;
        if (end && w.week_start > end) return false;
        return true;
      });
    }
    periods = weekly;
    labels = weekly.map((w) => w.label);
    totals = weekly.map((w) => w.total);
  } else {
    // Use monthly trend data
    let trend = raw.trend || [];
    if (start || end) {
      trend = trend.filter((t) => {
        const monthStart = new Date(t.month.replace("/", "-") + "-01");
        if (start && monthStart < new Date(new Date(start).getFullYear(), new Date(start).getMonth(), 1)) return false;
        if (end && monthStart > new Date(end)) return false;
        return true;
      });
    }
    periods = trend;
    labels = trend.map((t) => {
      const parts = t.month.split("/");
      return parts[0].slice(2) + "/" + parts[1];
    });
    totals = trend.map((t) => t.total);
  }

  // Compute from periods
  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const nPeriods = periods.length || 1;
  const avg = +(grandTotal / nPeriods).toFixed(1);

  const peakIdx = totals.length ? totals.indexOf(Math.max(...totals)) : -1;
  const peakLabel = peakIdx >= 0 ? labels[peakIdx] : "—";
  const peakVal = peakIdx >= 0 ? totals[peakIdx] : 0;

  // Aggregate func totals from periods
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

  // Trend chart data
  const topKeys = allFuncKeys.slice(0, 6);
  const trendData = periods.map((t, i) => {
    const entry = { label: labels[i], total: t.total };
    topKeys.forEach((k) => {
      entry[k] = (t.by_category && t.by_category[k]) || 0;
    });
    return entry;
  });

  // Job category data
  const jobEntries = funcEntries.slice(0, 6);
  const jobData = jobEntries.map((e) => ({
    key: e.k,
    label: FUNC_LABELS[e.k] || e.k,
    count: e.v,
  }));
  const jobTotal = jobData.reduce((a, d) => a + d.count, 0);

  // Static data from API
  const pipeline = raw.pipeline || [];
  const sourceBreakdown = raw.source_breakdown || [];
  const closedReasons = raw.closed_reasons || [];
  const kpi = raw.kpi || {};

  const dateLabel = start && end ? `${fmtDate(start)} – ${fmtDate(end)}` : "全部期間";

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
    // Pass through for static components
    pipeline,
    sourceBreakdown,
    closedReasons,
    kpi,
    meta: raw.meta,
  };
}

/** Original demo data computation (fallback). */
function computeFromDemoData(dateRange) {
  const { start, end } = dateRange;
  if (!start || !end) return null;

  const sd = new Date(start);
  const ed = new Date(end);
  if (sd > ed) return null;

  const gran = getGranularity(start, end);

  let filtered, labels, totals;
  if (gran === "month") {
    filtered = MONTHLY.filter((m) => {
      const ms = new Date(m.key + "-01");
      const me = new Date(ms);
      me.setMonth(me.getMonth() + 1);
      me.setDate(me.getDate() - 1);
      return ms <= ed && me >= sd;
    });
    labels = filtered.map((m) => m.label);
    totals = filtered.map((m) => m.total);
  } else {
    filtered = WEEKLY.filter((w) => new Date(w.s) <= ed && new Date(w.e) >= sd);
    labels = filtered.map((w) => w.w);
    totals = filtered.map((w) => w.total);
  }

  const funcMap = {};
  filtered.forEach((d) => {
    Object.entries(d.func || {}).forEach(([k, v]) => {
      funcMap[k] = (funcMap[k] || 0) + v;
    });
  });

  const allFuncKeys = [];
  filtered.forEach((d) => {
    Object.keys(d.func || {}).forEach((k) => {
      if (!allFuncKeys.includes(k)) allFuncKeys.push(k);
    });
  });
  allFuncKeys.sort((a, b) => (funcMap[b] || 0) - (funcMap[a] || 0));

  const grandTotal = totals.reduce((a, b) => a + b, 0);
  const nPeriods = filtered.length || 1;
  const avg = +(grandTotal / nPeriods).toFixed(1);

  const peakIdx = totals.indexOf(Math.max(...totals));
  const peakLabel = labels[peakIdx] || "—";
  const peakVal = totals[peakIdx] || 0;

  const funcEntries = Object.entries(funcMap)
    .map(([k, v]) => ({ k, v }))
    .sort((a, b) => b.v - a.v);
  const topFunc = funcEntries[0] || null;

  const trendData = filtered.map((d, i) => {
    const entry = { label: labels[i], total: totals[i] };
    allFuncKeys.slice(0, 6).forEach((k) => {
      entry[k] = (d.func && d.func[k]) || 0;
    });
    return entry;
  });

  const jobKeys = funcEntries.slice(0, 6).map((x) => x.k);
  const jobData = jobKeys.map((k) => ({
    key: k,
    label: FUNC_LABELS[k] || k,
    count: funcMap[k],
  }));
  const jobTotal = jobData.reduce((a, d) => a + d.count, 0);

  return {
    gran,
    grandTotal,
    nPeriods,
    avg,
    peakLabel,
    peakVal,
    topFunc,
    trendData,
    topFuncKeys: allFuncKeys.slice(0, 6),
    jobData,
    jobTotal,
    dateLabel: `${fmtDate(start)} – ${fmtDate(end)}`,
  };
}
