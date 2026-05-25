import { NOTION_COLOR_MAP } from "../utils/constants";

const colorFor = (name) => NOTION_COLOR_MAP[name] || NOTION_COLOR_MAP.default;

const fmtDate = (iso) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  return `${y}/${m}/${d}`;
};

export default function PositionPipelines({ positions }) {
  const list = Array.isArray(positions) ? positions : [];

  if (!list.length) {
    return (
      <div style={{ background: "#f0f0ee", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "#888" }}>
        目前沒有進行中的職位
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {list.map((p) => (
        <PositionCard key={p.title} position={p} />
      ))}
    </div>
  );
}

function PositionCard({ position }) {
  const { title, total, start_date, days_open, funnel = [], outcomes = [] } = position;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "#222" }}>{title}</div>
        <div style={metaRowStyle}>
          <span>開始 {fmtDate(start_date)}</span>
          <span style={dotSep}>·</span>
          <span>已甄選 {days_open ?? "—"} 天</span>
          <span style={dotSep}>·</span>
          <span style={{ fontWeight: 600, color: "#222" }}>共 {total} 人申請</span>
        </div>
      </div>

      <SectionLabel>甄選漏斗（累計）</SectionLabel>
      <BucketRow buckets={funnel} />

      <SectionLabel style={{ marginTop: 10 }}>結案 / 待處理</SectionLabel>
      <BucketRow buckets={outcomes} />
    </div>
  );
}

function BucketRow({ buckets }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(buckets.length, 1)}, minmax(0, 1fr))`,
        gap: 4,
      }}
    >
      {buckets.map((b) => {
        const c = colorFor(b.color);
        const dim = b.count === 0;
        return (
          <div key={b.stage} style={{ ...bucketStyle, opacity: dim ? 0.45 : 1 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: c.color }}>{b.count}</div>
            <div style={bucketLabelStyle}>{b.stage}</div>
            <div style={{ height: 2, borderRadius: 2, marginTop: 5, background: c.barColor }} />
          </div>
        );
      })}
    </div>
  );
}

function SectionLabel({ children, style }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: "#aaa",
        marginBottom: 6,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.1)",
  borderRadius: 12,
  padding: 14,
};

const headerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginBottom: 10,
};

const metaRowStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: 4,
  fontSize: 11,
  color: "#888",
};

const dotSep = { color: "#ccc" };

const bucketStyle = {
  background: "#fafafa",
  border: "0.5px solid rgba(0,0,0,0.06)",
  borderRadius: 8,
  padding: "8px 4px",
  textAlign: "center",
  minWidth: 0,
};

const bucketLabelStyle = {
  fontSize: 9,
  color: "#888",
  marginTop: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};
