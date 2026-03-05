import { useProjects } from "../hooks/useLayers";
import "./styles/admin-dashboard.css";

export const OverviewScreen = () => {
  const { data, isLoading } = useProjects();
  const projects = data?.data || [];

  const totalKm       = projects.reduce((s: number, p: any) => s + parseFloat(p.track_length_km || 0), 0);
  const totalStations = projects.reduce((s: number, p: any) => s + (p.station_count || 0), 0);

  if (isLoading) return <div className="screen-loading">Loading...</div>;

  return (
    <div className="admin-content">

      {/* ── TOP HEADER ── */}
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Dashboard</h2>
          <p>Railway GIS system overview</p>
        </div>
      </div>

      <div className="screen-body">

        {/* ── STAT CARDS ── */}
        <div className="stats-grid">
          <div className="stat-card orange">
            <div className="stat-icon-box">🚉</div>
            <div className="stat-info">
              <div className="stat-value">{projects.length}</div>
              <div className="stat-label">Total Projects</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon-box">📍</div>
            <div className="stat-info">
              <div className="stat-value">{totalStations}</div>
              <div className="stat-label">Total Stations</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon-box">📏</div>
            <div className="stat-info">
              <div className="stat-value">{totalKm.toFixed(1)} km</div>
              <div className="stat-label">Total Track Length</div>
            </div>
          </div>
          <div className="stat-card purple">
            <div className="stat-icon-box">🗺️</div>
            <div className="stat-info">
              <div className="stat-value">30</div>
              <div className="stat-label">Layer Types</div>
            </div>
          </div>
        </div>



        {/* ── PROJECTS TABLE ── */}
        <h3 className="section-title">
          All Projects
          <span className="section-title-count">{projects.length} projects</span>
        </h3>
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
              <div style={{ color: "var(--text-soft)", fontFamily: "var(--mono)", fontWeight: 700 }}>{i + 1}</div>
              <div className="overview-row-name">{p.name}</div>
              <div><span className="code-badge">{p.code}</span></div>
              <div>{p.from_station}</div>
              <div>{p.to_station}</div>
              <div style={{ fontWeight: 600 }}>{p.track_length_km} km</div>
              <div style={{ fontWeight: 600 }}>{p.station_count}</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default OverviewScreen;