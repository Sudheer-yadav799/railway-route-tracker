// ─── LayerStylesScreen.tsx ───────────────────────────────────────────────────
import React, { ChangeEvent, useState } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import {
  useLayers,
  useProjects,
  useCreateLayer,
  useUpdateLayer,
  useDeleteLayer,
} from "../hooks/useLayers";
import { renderSymbol }        from "../utils/renderSymbol";
import { LayerForm, Layer, LayerFormData } from "./LayerForm";
import { DeleteConfirmModal }  from "./DeleteConfirmModal";
import "./styles/admin-layer-styles.css";

/* ── constants ── */
const PAGE_SIZE = 10;

const ALL_FILTER_TYPES: string[] = [
  "All", "tilelayer", "markerlayer", "linelayer", "polygonlayer", "wmslayer",
];

const EMPTY_FORM: LayerFormData = {
  project_id: "", section_id: "", layer_code: "", name: "",
  color: "#000000", fillcolor: "#000000", opacity: "",
  isenabled: true, isactivated: true, type: "linelayer",
  apiendpoint: "", sortby: "", popup_type: "", popup_name: "",
  bind_popup_name: "", popup_field_name: "", icon_url: "", geoserver_workspace: "",
};

/* ─────────────────────────────────────────────────────────────────────────── */
export const LayerStylesScreen: React.FC = () => {
  const [page, setPage]                 = useState<number>(1);
  const [search, setSearch]             = useState<string>("");
  const [typeFilter, setTypeFilter]     = useState<string>("All");
  const [showForm, setShowForm]         = useState<boolean>(false);
  const [editLayer, setEditLayer]       = useState<Layer | null>(null);
  const [form, setForm]                 = useState<LayerFormData>(EMPTY_FORM);
  const [deleteTarget, setDeleteTarget] = useState<Layer | null>(null);

  /* ── queries ── */
  const { data, isLoading, isError } = useLayers();

  /* ── mutations ── */
  const createLayer = useCreateLayer();
  const updateLayer = useUpdateLayer();
  const deleteLayer = useDeleteLayer();

  if (isLoading) return <div className="screen-loading">Loading layers...</div>;
  if (isError)   return <div className="screen-error">Failed to load layers.</div>;

  /* ── derived data ── */
  const sections  = data?.data ?? [];
  const allLayers: Layer[] = sections.flatMap((s: any) =>
    s.layers.map((l: any) => ({ ...l, sectionTitle: s.title }))
  );

  const filtered = allLayers.filter((l) => {
    const ms = l.name.toLowerCase().includes(search.toLowerCase());
    const mt = typeFilter === "All" || l.type === typeFilter;
    return ms && mt;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  /* ── filter handlers ── */
  const handleTypeFilter = (t: string): void => { setTypeFilter(t); setPage(1); };
  const handleSearch     = (v: string): void  => { setSearch(v);    setPage(1); };

  /* ── form open / close ── */
  const openCreate = (): void => {
    setEditLayer(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (layer: Layer): void => {
    setEditLayer(layer);
    setForm({
      project_id:          layer.project_id  != null ? String(layer.project_id)  : "",
      section_id:          layer.section_id  != null ? String(layer.section_id)  : "",
      layer_code:          layer.layer_code          || "",
      name:                layer.name                || "",
      color:               layer.color               || "#000000",
      fillcolor:           layer.fillcolor           || "#000000",
      opacity:             layer.opacity             || "",
      isenabled:           typeof layer.isenabled    === "boolean" ? layer.isenabled    : true,
      isactivated:         typeof layer.isactivated  === "boolean" ? layer.isactivated  : true,
      type:                layer.type                || "linelayer",
      apiendpoint:         layer.apiendpoint         || "",
      sortby:              layer.sortby != null ? String(layer.sortby) : "",
      popup_type:          layer.popup_type          || "",
      popup_name:          layer.popup_name          || "",
      bind_popup_name:     layer.bind_popup_name     || "",
      popup_field_name:    layer.popup_field_name    || "",
      icon_url:            layer.icon_url            || "",
      geoserver_workspace: layer.geoserver_workspace || "",
    });
    setShowForm(true);
  };

  const closeForm = (): void => { setShowForm(false); setEditLayer(null); };

  /* ── field handlers passed to LayerForm ── */
  const handleField = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const type    = e.target.type;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleToggle = (field: "isenabled" | "isactivated", value: boolean): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  /* ── submit ── */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const payload = {
      ...form,
      project_id: form.project_id ? Number(form.project_id) : null,
      section_id: form.section_id ? Number(form.section_id) : null,
      sortby:     form.sortby     ? Number(form.sortby)     : null,
      opacity:    form.opacity    || null,
    };

    if (editLayer) {
      updateLayer.mutate({ id: editLayer.id, ...payload }, { onSuccess: closeForm });
    } else {
      createLayer.mutate(payload, { onSuccess: closeForm });
    }
  };

  /* ── delete ── */
  const handleDelete = (): void => {
    if (!deleteTarget) return;
    deleteLayer.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    });
  };

  /* ── busy flags ── */
  const isSaving   = createLayer.isPending || updateLayer.isPending;
  const isDeleting = deleteLayer.isPending;

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <div className="layer-style-wrapper">

      {/* ── TOP HEADER ── */}
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Layer Styles</h2>
          <p>Railway Web GIS — Layer Styling Standards</p>
        </div>
        <button className="btn-create" onClick={openCreate}>+ Create Layer</button>
      </div>

      <div className="layer-style-body">
        <div className="ls-card">

          {/* ── FILTERS ── */}
          <div className="pl-filters">
            <div className="search-wrap">
              <span className="search-icon">
                <FaEye style={{ fontSize: "0.75rem", opacity: 0.5 }} />
              </span>
              <input
                className="pl-search"
                placeholder="Search layer..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div className="pl-filter-group">
              {ALL_FILTER_TYPES.map((t) => (
                <button
                  key={t}
                  className={`filter-btn ${typeFilter === t ? "active" : ""}`}
                  onClick={() => handleTypeFilter(t)}
                >{t}</button>
              ))}
            </div>
            <span className="result-count">{filtered.length} layers</span>
          </div>

          {/* ── TABLE ── */}
          <div className="ls-table-wrap">
            <table className="ls-table">
              <thead>
                <tr>
                  <th className="col-num">#</th>
                  <th className="col-name">Layer Name</th>
                  <th className="col-section">Section</th>
                  <th className="col-type">Type</th>
                  <th className="col-color">Color</th>
                  <th className="col-symbol">Symbol Preview</th>
                  <th className="col-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((layer, i) => (
                  <tr key={layer.id ?? i}>
                    <td className="col-num td-num">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="col-name td-name">{layer.name}</td>
                    <td className="col-section">
                      <span className="section-badge">{layer.sectionTitle}</span>
                    </td>
                    <td className="col-type">
                      <span className={`type-badge type-${layer.type}`}>{layer.type}</span>
                    </td>
                    <td className="col-color">
                      <div className="color-cell">
                        <span className="color-dot" style={{ background: layer.color }} />
                        <span className="hex-text">{layer.color}</span>
                      </div>
                    </td>
                    <td className="col-symbol">
                      <div className="symbol-cell">{renderSymbol(layer)}</div>
                    </td>
                    <td className="col-actions">
                      <div className="actions-cell">
                        <button className="action-btn view" onClick={() => console.log("view", layer.id)}>
                          <FaEye /> View
                        </button>
                        <button className="action-btn edit" onClick={() => openEdit(layer)}>
                          <FaEdit /> Edit
                        </button>
                        <button className="action-btn delete" onClick={() => setDeleteTarget(layer)}>
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="td-empty">No layers found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── PAGINATION ── */}
          <div className="pagination">
            <button disabled={page === 1}         onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span>Page {page} of {totalPages || 1}</span>
            <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>

        </div>{/* /.ls-card */}
      </div>{/* /.layer-style-body */}

      {/* ═══ CREATE / EDIT MODAL ═══ */}
      {showForm && (
        <LayerForm
          form={form}
          editLayer={editLayer}
          isSaving={isSaving}
          isError={createLayer.isError || updateLayer.isError}
          errorMessage={createLayer.error?.message ?? updateLayer.error?.message}
          onChange={handleField}
          onToggle={handleToggle}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}

      {/* ═══ DELETE CONFIRM ═══ */}
      <DeleteConfirmModal
        target={deleteTarget}
        isDeleting={isDeleting}
        isError={deleteLayer.isError}
        errorMessage={deleteLayer.error?.message}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

    </div>
  );
};

export default LayerStylesScreen;