import { PIPELINE_SNAPSHOT } from "../utils/constants";

const STAGE_STYLE_MAP = {};
PIPELINE_SNAPSHOT.forEach((s) => {
  STAGE_STYLE_MAP[s.stage] = { color: s.color, barColor: s.barColor };
});

export default function PipelineFunnel({ pipeline }) {
  const stages = pipeline?.length ? pipeline : PIPELINE_SNAPSHOT;

  return (
    <div>
      <div style={noteChipStyle}>
        ⚠ Pipeline 為當前快照，不隨時間區間變動
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${stages.length}, 1fr)`,
          gap: 6,
          marginBottom: 12,
        }}
      >
        {stages.map((s, i) => {
          const style = STAGE_STYLE_MAP[s.stage] || { color: "#888", barColor: "#D3D1C7" };
          return (
            <div key={s.stage} style={stageStyle}>
              <div style={{ fontSize: 20, fontWeight: 600, color: style.color }}>{s.count}</div>
              <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>{s.stage}</div>
              <div style={{ height: 3, borderRadius: 2, marginTop: 7, background: style.barColor }} />
              {i < stages.length - 1 && <span style={arrowStyle}>›</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

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
