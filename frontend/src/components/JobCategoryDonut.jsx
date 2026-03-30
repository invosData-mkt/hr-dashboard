import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { FUNC_COLORS } from "../utils/constants";

export default function JobCategoryDonut({ data }) {
  if (!data) return null;

  const { jobData, jobTotal } = data;
  if (!jobData.length) return null;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>各職缺類別分布</h3>
        <span style={granTagStyle}>期間</span>
      </div>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>
        期間 {jobTotal} 筆，顯示前 {jobData.length} 大類別
      </p>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {jobData.map((d) => (
          <span
            key={d.key}
            style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 5 }}
          >
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 2,
                background: FUNC_COLORS[d.key] || "#aaa",
                flexShrink: 0,
              }}
            />
            {d.label} {Math.round((d.count / (jobTotal || 1)) * 100)}%
          </span>
        ))}
      </div>

      <div style={{ position: "relative", height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={jobData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={1}
            >
              {jobData.map((d) => (
                <Cell key={d.key} fill={FUNC_COLORS[d.key] || "#aaa"} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value} (${Math.round((value / (jobTotal || 1)) * 100)}%)`, name]}
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
