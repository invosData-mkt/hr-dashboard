import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CLOSED_REASONS_DATA } from "../utils/constants";

const DEFAULT_COLORS = { Rejected: "#E24B4A", "Candidate Rejected": "#EF9F27", "Pending response": "#888780" };

export default function ClosedReasonBar({ reasons }) {
  const data = reasons?.length ? reasons : CLOSED_REASONS_DATA;
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>結案原因分布</h3>
        <span style={granTagStyle}>整體</span>
      </div>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>
        {total} 筆已結案
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
        {data.map((r) => (
          <span
            key={r.reason}
            style={{ fontSize: 11, color: "#888", display: "flex", alignItems: "center", gap: 5 }}
          >
            <span
              style={{ width: 9, height: 9, borderRadius: 2, background: r.color || DEFAULT_COLORS[r.reason] || "#888", flexShrink: 0 }}
            />
            {r.reason} {r.count}
          </span>
        ))}
      </div>

      <div style={{ position: "relative", height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <CartesianGrid stroke="rgba(0,0,0,0.05)" vertical={false} />
            <XAxis dataKey="reason" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ fontSize: 11 }} />
            <Bar dataKey="count" name="人數" radius={[4, 4, 0, 0]}>
              {data.map((r) => (
                <Cell key={r.reason} fill={r.color || DEFAULT_COLORS[r.reason] || "#888"} />
              ))}
            </Bar>
          </BarChart>
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
