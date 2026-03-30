import ClosedReasonBar from "./components/ClosedReasonBar";
import FilterBar from "./components/FilterBar";
import Header from "./components/Header";
import JobCategoryDonut from "./components/JobCategoryDonut";
import KpiCards from "./components/KpiCards";
import OfferAcceptance from "./components/OfferAcceptance";
import PipelineFunnel from "./components/PipelineFunnel";
import SourceDonut from "./components/SourceDonut";
import TrendChart from "./components/TrendChart";
import { useDashboardData } from "./hooks/useDashboardData";

export default function App() {
  const { data, activePreset, dateRange, setPreset, setCustomRange } =
    useDashboardData();

  return (
    <div>
      <Header meta={data?.meta} />

      <FilterBar
        activePreset={activePreset}
        dateRange={dateRange}
        granularity={data?.gran || "month"}
        onPreset={setPreset}
        onCustomRange={setCustomRange}
      />

      <main style={{ maxWidth: 1080, margin: "0 auto", padding: "20px 24px 60px" }}>
        {/* 期間摘要 */}
        <SectionTitle>期間摘要</SectionTitle>
        <KpiCards data={data} />

        {/* 收件趨勢 */}
        <SectionTitle>收件趨勢</SectionTitle>
        <TrendChart data={data} />

        {/* 職缺類別 + 履歷來源 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <JobCategoryDonut data={data} />
          <SourceDonut sources={data?.sourceBreakdown} />
        </div>

        {/* 整體 Pipeline */}
        <SectionTitle>整體 Pipeline（當前快照）</SectionTitle>
        <PipelineFunnel pipeline={data?.pipeline} />

        {/* 結案原因 + Offer 接受率 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <ClosedReasonBar reasons={data?.closedReasons} />
          <OfferAcceptance kpi={data?.kpi} />
        </div>
      </main>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "#bbb",
        margin: "20px 0 10px",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      <div style={{ flex: 1, height: 0.5, background: "rgba(0,0,0,0.08)" }} />
    </div>
  );
}
