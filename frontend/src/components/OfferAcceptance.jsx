import { OFFER_DATA } from "../utils/constants";

export default function OfferAcceptance({ kpi }) {
  const offerSent = kpi?.offer_sent ?? OFFER_DATA.offerSent;
  const hired = kpi?.hired_count ?? OFFER_DATA.hired;
  const rate = kpi?.offer_acceptance_rate ?? OFFER_DATA.rate;
  const target = kpi?.offer_target ?? OFFER_DATA.target;
  const reached = rate >= target;

  return (
    <div style={cardStyle}>
      <div style={headerStyle}>
        <h3 style={{ fontSize: 13, fontWeight: 600 }}>Offer 接受率</h3>
        <span style={granTagStyle}>整體</span>
      </div>
      <p style={{ fontSize: 11, color: "#888", marginBottom: 14 }}>
        累積至今
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: 24, padding: "16px 0" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#1D9E75" }}>{Math.round(rate)}%</div>
          <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>Offer 接受率</div>
        </div>

        <div style={{ flex: 1 }}>
          <div style={rowStyle}>
            <span>發出 Offer</span>
            <span>{offerSent} 人</span>
          </div>
          <div style={barTrackStyle}>
            <div style={{ ...barFillStyle, width: "100%", background: "#378ADD" }} />
          </div>

          <div style={{ ...rowStyle, marginTop: 10 }}>
            <span>已錄取</span>
            <span>{hired} 人</span>
          </div>
          <div style={barTrackStyle}>
            <div style={{ ...barFillStyle, width: `${rate}%`, background: "#1D9E75" }} />
          </div>

          <div style={{ ...rowStyle, marginTop: 10 }}>
            <span>目標 ≥ {target}%</span>
            <span style={{ color: reached ? "#1D9E75" : "#E24B4A" }}>
              {reached ? "✓ 達標" : "✗ 未達標"}
            </span>
          </div>
        </div>
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

const rowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: 11,
  color: "#888",
  marginBottom: 5,
};

const barTrackStyle = {
  height: 6,
  background: "#ebebea",
  borderRadius: 3,
  overflow: "hidden",
};

const barFillStyle = {
  height: "100%",
  borderRadius: 3,
};
