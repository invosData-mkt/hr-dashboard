import { useCallback, useMemo, useState } from "react";
import {
  FUNC_LABELS,
  MONTHLY,
  WEEKLY,
} from "../utils/constants";
import { fmtDate, getGranularity } from "../utils/dateHelpers";

export function useDashboardData() {
  const [dateRange, setDateRange] = useState({ start: "2025-05-01", end: "2026-03-19" });
  const [activePreset, setActivePreset] = useState("全部");

  const setPreset = useCallback((label, range) => {
    setActivePreset(label);
    setDateRange(range);
  }, []);

  const setCustomRange = useCallback((start, end) => {
    setActivePreset(null);
    setDateRange({ start, end });
  }, []);

  const computed = useMemo(() => {
    const { start, end } = dateRange;
    if (!start || !end) return null;

    const sd = new Date(start);
    const ed = new Date(end);
    if (sd > ed) return null;

    const gran = getGranularity(start, end);

    // Filter data based on granularity
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

    // Aggregate func totals across filtered periods
    const funcMap = {};
    filtered.forEach((d) => {
      Object.entries(d.func || {}).forEach(([k, v]) => {
        funcMap[k] = (funcMap[k] || 0) + v;
      });
    });

    // Collect all func keys appearing in filtered data
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

    // Build trend chart data
    const trendData = filtered.map((d, i) => {
      const entry = { label: labels[i], total: totals[i] };
      allFuncKeys.slice(0, 6).forEach((k) => {
        entry[k] = (d.func && d.func[k]) || 0;
      });
      return entry;
    });

    // Build job category data (top 6 from filtered func totals)
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
  }, [dateRange]);

  return { data: computed, activePreset, dateRange, setPreset, setCustomRange };
}
