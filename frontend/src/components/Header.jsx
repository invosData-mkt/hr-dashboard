export default function Header() {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "0.5px solid rgba(0,0,0,0.1)",
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div>
        <h1 style={{ fontSize: 15, fontWeight: 600 }}>HR Recruitment Dashboard</h1>
        <p style={{ fontSize: 11, color: "#888", marginTop: 1 }}>
          資料來源：Notion CSV　｜　總筆數：394　｜　2025/05 — 2026/03
        </p>
      </div>
    </header>
  );
}
