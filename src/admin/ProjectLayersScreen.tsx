import { useState } from "react";
import { useProjectLayers, useToggleLayer } from "../hooks/useLayers";

interface Props { projectId: number | null; }


const ProjectLayersScreen = ({ projectId, onBack }: Props) => {
  const [search,        setSearch]        = useState("");
  const [typeFilter,    setTypeFilter]    = useState("All");
  const [enabledFilter, setEnabledFilter] = useState<"all"|"enabled"|"disabled">("all");

  const { data, isLoading, isError } = useProjectLayers(projectId);
  const { mutate: toggleLayer }      = useToggleLayer(projectId!);

  if (!projectId)  return <div className="screen-empty">← Select a project from Projects</div>;
  if (isLoading)   return <div className="screen-loading">Loading layers...</div>;
  if (isError)     return <div className="screen-error">Failed to load layers.</div>;

  const project  = data?.data?.project;
  const sections = data?.data?.sections || [];

  const allLayers = sections.flatMap((s: any) =>
    s.layers.map((l: any) => ({ ...l, sectionTitle: s.title }))
  );

  const filtered = allLayers.filter((l: any) => {
    const matchSearch  = l.name.toLowerCase().includes(search.toLowerCase());
    const matchType    = typeFilter === "All" || l.type === typeFilter;
    const matchEnabled = enabledFilter === "all"
      || (enabledFilter === "enabled"  &&  l.isenabled)
      || (enabledFilter === "disabled" && !l.isenabled);
    return matchSearch && matchType && matchEnabled;
  });

  return (
    <div className="project-layers-wrapper">

      {/* BREADCRUMB + BACK */}
      <div className="pl-breadcrumb">
        <button className="back-btn" onClick={onBack}>← Projects</button>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{project?.name}</span>
      </div>

      {/* HEADER */}
      <div className="pl-header">
        <div>
          <h2 className="page-title">{project?.name}</h2>
          <p className="pl-subtitle">
            <span>{project?.from_station}</span>
            <span style={{ margin: "0 6px", color: "#E84400" }}>→</span>
            <span>{project?.to_station}</span>
            <span style={{ margin: "0 8px", color: "#e0e0e0" }}>|</span>
            <span className="code-badge">{project?.code}</span>
          </p>
        </div>
        <div className="pl-stats">
          <div className="pl-stat-item">
            <span className="pl-stat-val">{allLayers.length}</span>
            <span className="pl-stat-lbl">Total Layers</span>
          </div>
          <div className="pl-stat-divider" />
          <div className="pl-stat-item">
            <span className="pl-stat-val" style={{ color: "#16a34a" }}>
              {allLayers.filter((l: any) => l.isenabled).length}
            </span>
            <span className="pl-stat-lbl">Enabled</span>
          </div>
          <div className="pl-stat-divider" />
          <div className="pl-stat-item">
            <span className="pl-stat-val" style={{ color: "#dc2626" }}>
              {allLayers.filter((l: any) => !l.isenabled).length}
            </span>
            <span className="pl-stat-lbl">Disabled</span>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="pl-filters">
        <input
          className="pl-search"
          placeholder="🔍 Search layer..."
          value={search}
          onChange={e => { setSearch(e.target.value); }}
        />
        <div className="pl-filter-group">
          {["All", ...new Set(allLayers.map((l: any) => l.type))].map((t: any) => (
            <button
              key={t}
              className={`filter-btn ${typeFilter === t ? "active" : ""}`}
              onClick={() => setTypeFilter(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <select
          className="pl-select"
          value={enabledFilter}
          onChange={e => setEnabledFilter(e.target.value as any)}
        >
          <option value="all">All Status</option>
          <option value="enabled">Enabled</option>
          <option value="disabled">Disabled</option>
        </select>
        <span className="result-count">{filtered.length} layers</span>
      </div>

      {/* TABLE */}
      <div className="layer-style-table project-table">
        <div className="layer-style-row header">
          <div>Layer Name</div>
          <div>Section</div>
          <div>Type</div>
          <div>Color</div>
          <div>Symbol</div>
          <div>GeoServer Layer</div>
          <div>Status</div>
        </div>

        {filtered.length === 0 && (
          <div className="no-results">No layers match your filters.</div>
        )}

        {filtered.map((layer: any, i: number) => (
          <div key={i} className="layer-style-row">
            <div className="layer-name">{layer.name}</div>
            <div><span className="section-badge">{layer.sectionTitle}</span></div>
            <div><span className={`type-badge type-${layer.type}`}>{layer.type}</span></div>
            <div className="color-cell">
              <span className="color-box" style={{ background: layer.color || "#ccc" }} />
              <span className="hex-text">{layer.color || "—"}</span>
            </div>
            <div className="symbol-preview-cell">
              {renderSymbol(layer)}
            </div>
            <div>
              <span className="geo-layer-text" title={layer.geoserverLayer}>
                {layer.geoserverLayer || "—"}
              </span>
            </div>
            <div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={!!layer.isenabled}
                  onChange={e => toggleLayer({ layerCode: layer.id, isenabled: e.target.checked })}
                />
                <span className="toggle-slider" />
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectLayersScreen;

