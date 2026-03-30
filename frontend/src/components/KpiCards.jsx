import { FUNC_LABELS } from "../utils/constants";

export default function KpiCards({ data }) {
  if (!data) return null;

  const { gran, grandTotal, avg, nPeriods, peakLabel, peakVal, topFunc, dateLabel } = data;
  const periodUnit = gran === "month" ? "月" : "週";

  const cards = [
    {
      label: "期間收到履歷",
      value: grandTotal,
      sub: dateLabel,
      valueStyle: {},
    },
    {
      label: gran === "month" ? "月均收件" : "週均收件",
      value: avg,
      sub: `共 ${nPeriods} 個${periodUnit}`,
      valueStyle: {},
    },
    {
      label: "最高峰期間",
      value: peakLabel,
      sub: `最高 ${peakVal} 筆`,
      valueStyle: { fontSize: 18 },
    },
    {
      label: "最活躍職缺類別",
      value: topFunc ? (FUNC_LABELS[topFunc.k] || topFunc.k) : "—",
      sub: topFunc ? `${topFunc.v} 筆` : "",
      valueStyle: { fontSize: 15 },
    },
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 10,
        marginBottom: 12,
      }}
    >
      {cards.map((c) => (
        <div key={c.label} style={cardStyle}>
          <div style={{ fontSize: 11, color: "#888", marginBottom: 5, lineHeight: 1.4 }}>
            {c.label}
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, lineHeight: 1, transition: "all 0.2s", ...c.valueStyle }}>
            {c.value}
          </div>
          <div style={{ fontSize: 11, marginTop: 4, color: "#888" }}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: "14px 16px",
};
