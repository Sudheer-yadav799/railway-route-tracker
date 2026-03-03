import { useState } from "react";
import { useLayers }    from "../hooks/useLayers";
import { renderSymbol } from "../utils/renderSymbol";
import "./styles/admin-layer-styles.css";

const PAGE_SIZE = 10;
const ALL_TYPES = ["All", "polyline", "point", "polygon", "label"];

export const LayerStylesScreen = () => {
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const { data, isLoading, isError } = useLayers();

  if (isLoading) return <div className="screen-loading">Loading layers...</div>;
  if (isError)   return <div className="screen-error">Failed to load layers.</div>;

  const sections  = data?.data || [];
  const allLayers = sections.flatMap((s: any) =>
    s.layers.map((l: any) => ({ ...l, sectionTitle: s.title }))
  );

  const filtered = allLayers.filter((l: any) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeFilter === "All" || l.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleTypeFilter = (t: string) => { setTypeFilter(t); setPage(1); };
  const handleSearch     = (v: string) => { setSearch(v);     setPage(1); };

  return (
    <div className="layer-style-wrapper">

      {/* ── TOP HEADER ── */}
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Layer Styles</h2>
          <p>Railway Web GIS — Layer Styling Standards</p>
        </div>
      </div>

      <div className="layer-style-body">

        {/* ── FILTERS ── */}
        <div className="pl-filters">
          <input
            className="pl-search"
            placeholder="🔍  Search layer..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
          <div className="pl-filter-group">
            {ALL_TYPES.map(t => (
              <button
                key={t}
                className={`filter-btn ${typeFilter === t ? "active" : ""}`}
                onClick={() => handleTypeFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="result-count">{filtered.length} layers</span>
        </div>

        {/* ── TABLE ── */}
        <div className="layer-style-table">
          <div className="layer-style-row header">
            <div>Layer Name</div>
            <div>Section</div>
            <div>Type</div>
            <div>Color</div>
            <div>Symbol Preview</div>
          </div>

          {paginated.map((layer: any, i: number) => (
            <div key={i} className="layer-style-row">
              <div className="layer-name">{layer.name}</div>
              <div><span className="section-badge">{layer.sectionTitle}</span></div>
              <div><span className={`type-badge type-${layer.type}`}>{layer.type}</span></div>
              <div className="color-cell">
                <span className="color-box" style={{ background: layer.color }} />
                <span className="hex-text">{layer.color}</span>
              </div>
              <div className="symbol-preview-cell">{renderSymbol(layer)}</div>
            </div>
          ))}
        </div>

        {/* ── PAGINATION ── */}
        <div className="pagination">
          <button disabled={page === 1}         onClick={() => setPage(p => p - 1)}>← Prev</button>
          <span>Page {page} of {totalPages || 1}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
        </div>

      </div>
    </div>
  );
};

export default LayerStylesScreen;