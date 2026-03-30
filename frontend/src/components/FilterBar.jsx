import { DATE_PRESETS } from "../utils/dateHelpers";

export default function FilterBar({
  activePreset,
  dateRange,
  granularity,
  onPreset,
  onCustomRange,
}) {
  const granLabel = granularity === "month" ? "📅 依月顯示" : "📅 依週顯示";

  return (
    <div
      style={{
        background: "#fff",
        borderBottom: "0.5px solid rgba(0,0,0,0.08)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        position: "sticky",
        top: 53,
        zIndex: 20,
      }}
    >
      {/* Presets */}
      <div style={{ display: "flex", gap: 5 }}>
        {DATE_PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => onPreset(p.label, p.getRange())}
            style={{
              padding: "5px 12px",
              borderRadius: 20,
              fontSize: 12,
              cursor: "pointer",
              border: "0.5px solid rgba(0,0,0,0.14)",
              background: activePreset === p.label ? "#1a1a18" : "transparent",
              color: activePreset === p.label ? "#fff" : "#555",
              whiteSpace: "nowrap",
              transition: "all 0.1s",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div style={{ width: 0.5, height: 20, background: "rgba(0,0,0,0.12)" }} />

      {/* Date inputs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <label style={{ fontSize: 11, color: "#888" }}>從</label>
        <input
          type="date"
          value={dateRange.start}
          min="2025-05-01"
          max="2026-03-19"
          onChange={(e) => onCustomRange(e.target.value, dateRange.end)}
          style={dateInputStyle}
        />
        <span style={{ color: "#bbb", fontSize: 14 }}>—</span>
        <label style={{ fontSize: 11, color: "#888" }}>到</label>
        <input
          type="date"
          value={dateRange.end}
          min="2025-05-01"
          max="2026-03-19"
          onChange={(e) => onCustomRange(dateRange.start, e.target.value)}
          style={dateInputStyle}
        />
      </div>

      {/* Granularity badge */}
      <div
        style={{
          marginLeft: "auto",
          background: "#f0f0ee",
          borderRadius: 6,
          padding: "4px 10px",
          fontSize: 11,
          color: "#666",
          whiteSpace: "nowrap",
        }}
      >
        {granLabel}
      </div>
    </div>
  );
}

const dateInputStyle = {
  border: "0.5px solid rgba(0,0,0,0.15)",
  borderRadius: 8,
  padding: "5px 10px",
  fontSize: 12,
  color: "#1a1a18",
  background: "#fff",
  outline: "none",
  cursor: "pointer",
};
