
// ─────────────────────────────────────────────────────────────
// OverviewScreen.tsx
// ─────────────────────────────────────────────────────────────

import { useProjects } from "../hooks/useLayers";


export const OverviewScreen = () => {
  const { data, isLoading } = useProjects();
  const projects = data?.data || [];

  const totalKm       = projects.reduce((s: number, p: any) => s + parseFloat(p.track_length_km || 0), 0);
  const totalStations = projects.reduce((s: number, p: any) => s + (p.station_count || 0), 0);

  if (isLoading) return <div className="screen-loading">Loading...</div>;

  return (
    <div className="overview-wrapper">
      <h2 className="page-title">Railway GIS Overview</h2>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚉</div>
          <div className="stat-value">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📍</div>
          <div className="stat-value">{totalStations}</div>
          <div className="stat-label">Total Stations</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📏</div>
          <div className="stat-value">{totalKm.toFixed(1)} km</div>
          <div className="stat-label">Total Track Length</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🗺️</div>
          <div className="stat-value">30</div>
          <div className="stat-label">Layer Types</div>
        </div>
      </div>

      {/* PROJECTS TABLE */}
      <h3 className="section-title">All Projects</h3>
      <div className="overview-table">
        <div className="overview-row header">
          <div>#</div>
          <div>Project Name</div>
          <div>Code</div>
          <div>From</div>
          <div>To</div>
          <div>Track Length</div>
          <div>Stations</div>
        </div>
        {projects.map((p: any, i: number) => (
          <div key={p.id} className="overview-row">
            <div>{i + 1}</div>
            <div>{p.name}</div>
            <div><span className="code-badge">{p.code}</span></div>
            <div>{p.from_station}</div>
            <div>{p.to_station}</div>
            <div>{p.track_length_km} km</div>
            <div>{p.station_count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverviewScreen;
