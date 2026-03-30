const API_BASE =
  import.meta.env.VITE_API_BASE || "http://127.0.0.1:5001";

export async function fetchDashboardData({ start = "", end = "" } = {}) {
  const params = new URLSearchParams();
  if (start) params.set("start", start);
  if (end) params.set("end", end);

  const url = `${API_BASE}/dashboard_data?${params}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }
  return res.json();
}
