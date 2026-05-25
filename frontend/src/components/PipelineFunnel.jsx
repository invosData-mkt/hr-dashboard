import { NOTION_COLOR_MAP } from "../utils/constants";

const colorFor = (name) => NOTION_COLOR_MAP[name] || NOTION_COLOR_MAP.default;

export default function PipelineFunnel({ pipeline }) {
  const groups = Array.isArray(pipeline) ? pipeline : [];

  if (!groups.length) {
    return (
      <div style={noteChipStyle}>⚠ 尚無 Pipeline 資料</div>
    );
  }

  return (
    <div>
      <div style={noteChipStyle}>
        ⚠ Pipeline 為當前快照，不隨時間區間變動
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {groups.map((g) => {
          const gStyle = colorFor(g.color);
          const stages = g.stages || [];
          return (
            <div key={g.group || "ungrouped"} style={groupStyle}>
              {g.group && (
                <div style={{ ...groupHeaderStyle, color: gStyle.color }}>
                  <span style={{ ...dotStyle, background: gStyle.color }} />
                  {g.group}
                  <span style={groupTotalStyle}>{g.total ?? 0}</span>
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${Math.max(stages.length, 1)}, 1fr)`,
                  gap: 6,
                }}
              >
                {stages.map((s, i) => {
                  const c = colorFor(s.color);
                  return (
                    <div key={s.stage} style={stageStyle}>
                      <div style={{ fontSize: 20, fontWeight: 600, color: c.color }}>{s.count}</div>
                      <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{s.stage}</div>
                      <div style={{ height: 3, borderRadius: 2, marginTop: 7, background: c.barColor }} />
                      {i < stages.length - 1 && <span style={arrowStyle}>›</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const groupStyle = {
  background: "#fafafa",
  border: "0.5px solid rgba(0,0,0,0.06)",
  borderRadius: 12,
  padding: 12,
};

const groupHeaderStyle = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  fontSize: 12,
  fontWeight: 600,
  marginBottom: 8,
};

const groupTotalStyle = {
  marginLeft: "auto",
  fontSize: 11,
  fontWeight: 500,
  color: "#888",
};

const dotStyle = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  display: "inline-block",
};

const stageStyle = {
  background: "#fff",
  border: "0.5px solid rgba(0,0,0,0.1)",
  borderRadius: 10,
  padding: "10px 8px",
  textAlign: "center",
  position: "relative",
};

const arrowStyle = {
  position: "absolute",
  right: -5,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#ccc",
  fontSize: 14,
};

const noteChipStyle = {
  background: "#f0f0ee",
  borderRadius: 6,
  padding: "5px 10px",
  fontSize: 11,
  color: "#888",
  display: "inline-block",
  marginBottom: 12,
};
