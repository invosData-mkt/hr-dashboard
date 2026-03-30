import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FUNC_COLORS, FUNC_LABELS } from "../utils/constants";

export default function TrendChart({ data }) {
  if (!data) return null;

  const { gran, trendData, topFuncKeys, nPeriods, dateLabel } = data;
  const granTag = gran === "month" ? "依月" : "依週";
  const periodUnit = gran === "month" ? "月" : "週";

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>履歷收件量趨勢</h3>
        <span style={granTagStyle}>{granTag}</span>
      </div>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>
        {dateLabel}，共 {nPeriods} 個{periodUnit}
      </p>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        <LegendItem color="#1a1a18" label="合計" />
        {topFuncKeys.map((k) => (
          <LegendItem key={k} color={FUNC_COLORS[k] || "#aaa"} label={FUNC_LABELS[k] || k} />
        ))}
      </div>

      <div style={{ position: "relative", height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="total"
              name="合計"
              stroke="#1a1a18"
              strokeWidth={2.5}
              fill="rgba(0,0,0,0.05)"
              dot={{ r: 4, fill: "#1a1a18" }}
            />
            {topFuncKeys.map((k) => (
              <Line
                key={k}
                type="monotone"
                dataKey={k}
                name={FUNC_LABELS[k] || k}
                stroke={FUNC_COLORS[k] || "#aaa"}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={{ r: 3 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendItem({ color, label }) {
  return (
    <span style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 9, height: 9, borderRadius: 2, background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: "16px 18px",
  marginBottom: 12,
};

const headerStyle = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  marginBottom: 2,
};

const granTagStyle = {
  fontSize: 10,
  color: "#aaa",
  background: "#f5f4f0",
  padding: "2px 8px",
  borderRadius: 10,
};
