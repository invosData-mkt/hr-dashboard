import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { SOURCE_COLORS, SOURCE_DATA } from "../utils/constants";

const total = SOURCE_DATA.reduce((s, d) => s + d.count, 0);

export default function SourceDonut() {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>履歷來源分布</h3>
        <span style={granTagStyle}>整體</span>
      </div>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>
        全部 {total} 筆
      </p>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {SOURCE_DATA.map((s, i) => (
          <span
            key={s.source}
            style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 5 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 2,
                background: SOURCE_COLORS[i],
                flexShrink: 0,
              }}
            />
            {s.source} {Math.round((s.count / total) * 100)}%
          </span>
        ))}
      </div>

      <div style={{ position: "relative", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={SOURCE_DATA}
              dataKey="count"
              nameKey="source"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={1}
            >
              {SOURCE_DATA.map((_, i) => (
                <Cell key={i} fill={SOURCE_COLORS[i]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                `${value} (${Math.round((value / total) * 100)}%)`,
                name,
              ]}
              contentStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: "16px 18px",
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
