import { useState } from "react";
import "./styles/admin-dashboard.css";
import "./styles/projects-screen.css";

interface Project {
  id: number;
  name: string;
  code: string;
  from_station: string;
  to_station: string;
  track_length_km: number;
  station_count: number;
  geoserver_workspace: string;
  is_active: boolean;
}

interface Props {
  projects: Project[];
  isLoading: boolean;
  onSelectProject: (id: number) => void;
}

const ProjectsScreen = ({ projects, isLoading, onSelectProject }: Props) => {
  const [search, setSearch] = useState("");

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code.toLowerCase().includes(search.toLowerCase()) ||
    p.from_station.toLowerCase().includes(search.toLowerCase()) ||
    p.to_station.toLowerCase().includes(search.toLowerCase())
  );

  const totalKm       = projects.reduce((s, p) => s + parseFloat(String(p.track_length_km || 0)), 0);
  const totalStations = projects.reduce((s, p) => s + (p.station_count || 0), 0);

  if (isLoading) return <div className="screen-loading">Loading projects...</div>;

  return (
    <div className="projects-screen-wrapper">

      {/* ── TOP HEADER ── */}
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Projects</h2>
          <p>All  Railway GIS projects</p>
        </div>
      </div>

      <div className="projects-body">

        {/* ── SUMMARY STATS ── */}
        <div className="projects-stats-row">
          <div className="proj-stat">
            <div className="proj-stat-icon orange">🚉</div>
            <div className="proj-stat-info">
              <span className="proj-stat-value">{projects.length}</span>
              <span className="proj-stat-label">Total Projects</span>
            </div>
          </div>
          <div className="proj-stat">
            <div className="proj-stat-icon blue">📍</div>
            <div className="proj-stat-info">
              <span className="proj-stat-value">{totalStations}</span>
              <span className="proj-stat-label">Total Stations</span>
            </div>
          </div>
          <div className="proj-stat">
            <div className="proj-stat-icon green">📏</div>
            <div className="proj-stat-info">
              <span className="proj-stat-value">{totalKm.toFixed(0)} km</span>
              <span className="proj-stat-label">Total Track</span>
            </div>
          </div>
          <div className="proj-stat">
            <div className="proj-stat-icon purple">👁️</div>
            <div className="proj-stat-info">
              <span className="proj-stat-value">{filtered.length}</span>
              <span className="proj-stat-label">Showing</span>
            </div>
          </div>
        </div>

        {/* ── LIST HEADER (title + search) ── */}
        <div className="projects-list-header">
          <div className="projects-list-title">{filtered.length} Projects</div>
          <input
            className="pl-search"
            placeholder="🔍  Search projects..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── PROJECT CARDS ── */}
        <div className="projects-grid">
          {filtered.map((p, i) => (
            <div
              key={p.id}
              className="project-card"
              onClick={() => onSelectProject(p.id)}
            >
              {/* card header */}
              <div className="pc-header">
                <div className="pc-index">#{i + 1}</div>
                <span className="code-badge">{p.code}</span>
                <span className={`pc-status ${p.is_active ? "active" : "inactive"}`}>
                  {p.is_active ? "Active" : "Inactive"}
                </span>
              </div>

              {/* project name */}
              <h3 className="pc-name">{p.name}</h3>

              {/* route */}
              <div className="pc-route">
                <span className="pc-station">{p.from_station}</span>
                <span className="pc-arrow">→</span>
                <span className="pc-station">{p.to_station}</span>
              </div>

              {/* stats row */}
              <div className="pc-meta">
                <div className="pc-meta-item">
                  <span className="pc-meta-icon">📏</span>
                  <span>{p.track_length_km} km</span>
                </div>
                <div className="pc-meta-item">
                  <span className="pc-meta-icon">📍</span>
                  <span>{p.station_count} stations</span>
                </div>
              </div>

              {/* workspace */}
              <div className="pc-workspace">
                <span className="geo-chip">{p.geoserver_workspace || "—"}</span>
              </div>

              {/* view layers btn */}
              <button className="pc-btn">View Layers →</button>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="no-results" style={{ gridColumn: "1/-1" }}>
              No projects match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsScreen;