// ─── LayerForm.tsx ────────────────────────────────────────────────────────────
import React, { ChangeEvent } from "react";
import {
  FaTimes, FaLayerGroup, FaCode, FaGlobe, FaServer,
  FaPalette, FaSort, FaMapMarkerAlt, FaRegWindowRestore,
  FaLink, FaTag, FaImage, FaDatabase,
} from "react-icons/fa";
import { useProjects } from "../hooks/useLayers";

/* ── types ── */
export interface LayerFormData {
  project_id:          number | string;
  section_id:          number | string;
  layer_code:          string;
  name:                string;
  color:               string;
  fillcolor:           string;
  opacity:             string;
  isenabled:           boolean;
  isactivated:         boolean;
  type:                string;
  apiendpoint:         string;
  sortby:              number | string;
  popup_type:          string;
  popup_name:          string;
  bind_popup_name:     string;
  popup_field_name:    string;
  icon_url:            string;
  geoserver_workspace: string;
}

export interface Layer extends LayerFormData {
  id:           number;
  sectionTitle: string;
}

interface Project      { id: number; name: string; }
interface SectionOption { id: number; label: string; }

export interface LayerFormProps {
  form:         LayerFormData;
  editLayer:    Layer | null;
  isSaving:     boolean;
  isError:      boolean;
  errorMessage: string | undefined;
  onChange:     (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onToggle:     (field: "isenabled" | "isactivated", value: boolean) => void;
  onSubmit:     (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel:     () => void;
}

/* ── constants ── */
const LAYER_TYPE_OPTIONS: string[] = [
  "tilelayer", "markerlayer", "linelayer", "polygonlayer", "wmslayer", "droneimagelayer"
];

const SECTION_OPTIONS: SectionOption[] = [
  { id: 1, label: "Infrastructure" },
  { id: 2, label: "Drone Image " },
  { id: 3, label: "Tile Layer" },
];

const isValidHex = (v: string): boolean => /^#[0-9A-Fa-f]{6}$/.test(v);

/* ── small helpers ── */
const Field = ({
  label, required, icon, children,
}: {
  label: string; required?: boolean; icon?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="lf-field">
    <label className="lf-label">
      {icon && <span className="lf-label-icon">{icon}</span>}
      {label}
      {required && <span className="lf-req">*</span>}
    </label>
    {children}
  </div>
);

const SectionDivider = ({ title }: { title: string }) => (
  <div className="lf-section-divider">
    <span>{title}</span>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────── */
export const LayerForm: React.FC<LayerFormProps> = ({
  form, editLayer, isSaving, isError, errorMessage,
  onChange, onToggle, onSubmit, onCancel,
}) => {
  const { data: projectsData } = useProjects();
  const projects: Project[] = projectsData?.data ?? [];

  // resolve display names for edit mode info strip
  const resolvedProject = projects.find((p) => String(p.id) === String(form.project_id));
  const resolvedSection = SECTION_OPTIONS.find((s) => String(s.id) === String(form.section_id));

  return (
    <div className="lf-overlay" onClick={onCancel}>
      <div className="lf-panel" onClick={(e) => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="lf-header">
          <div className="lf-header-left">
            <div className={`lf-header-icon ${editLayer ? "lf-header-icon--edit" : ""}`}>
              <FaLayerGroup />
            </div>
            <div>
              <h3>{editLayer ? `Edit — ${editLayer.name}` : "Create Layer"}</h3>
              <p>
                {editLayer
                  ? <>
                      <span className={`lf-header-badge lf-type-${editLayer.type}`}>{editLayer.type}</span>
                      {" · "}
                      <span className="lf-header-code">{editLayer.layer_code}</span>
                      {" · ID #"}{editLayer.id}
                    </>
                  : "Configure a new map layer"}
              </p>
            </div>
          </div>
          <button className="lf-close" type="button" onClick={onCancel} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {/* ── EDIT INFO STRIP ── */}
        {editLayer && (
          <div className="lf-edit-strip">
            <div className="lf-edit-strip-item">
              <span className="lf-edit-strip-label">Layer ID</span>
              <span className="lf-edit-strip-val lf-mono">#{editLayer.id}</span>
            </div>
            <div className="lf-edit-strip-sep" />
            <div className="lf-edit-strip-item">
              <span className="lf-edit-strip-label">Project</span>
              <span className="lf-edit-strip-val">{resolvedProject?.name ?? `ID ${editLayer.project_id}`}</span>
            </div>
            <div className="lf-edit-strip-sep" />
            <div className="lf-edit-strip-item">
              <span className="lf-edit-strip-label">Section</span>
              <span className="lf-edit-strip-val">{resolvedSection?.label ?? `ID ${editLayer.section_id}`}</span>
            </div>
            <div className="lf-edit-strip-sep" />
            <div className="lf-edit-strip-item">
              <span className="lf-edit-strip-label">Code</span>
              <span className="lf-edit-strip-val lf-mono">{editLayer.layer_code}</span>
            </div>
            <div className="lf-edit-strip-sep" />
            <div className="lf-edit-strip-item">
              <span className="lf-edit-strip-label">Type</span>
              <span className={`lf-header-badge lf-type-${editLayer.type}`}>{editLayer.type}</span>
            </div>
          </div>
        )}

        {/* ── FORM ── */}
        <form className="lf-form" onSubmit={onSubmit}>

          {/* ─ SECTION 1: Identity ─ */}
          <SectionDivider title="Layer Identity" />

          <div className="lf-grid-2">
            <Field label="Project" required icon={<FaGlobe />}>
              <select name="project_id" value={String(form.project_id)} onChange={onChange} required className="lf-select">
                <option value="">Select a project</option>
                {projects.map((p) => (
                  <option key={p.id} value={String(p.id)}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Section" required icon={<FaDatabase />}>
              <select name="section_id" value={String(form.section_id)} onChange={onChange} required className="lf-select">
                <option value="">Select a section</option>
                {SECTION_OPTIONS.map((s) => (
                  <option key={s.id} value={String(s.id)}>{s.label}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="lf-grid-2">
            <Field label="Layer Name" required icon={<FaTag />}>
              <input className="lf-input" name="name" value={form.name} onChange={onChange} placeholder="e.g. Main Pole Lines" required />
            </Field>

            <Field label="Layer Code" required icon={<FaCode />}>
              <input className="lf-input lf-mono" name="layer_code" value={form.layer_code} onChange={onChange} placeholder="e.g. TRK_001" required />
            </Field>
          </div>

          <div className="lf-grid-2">
            <Field label="Layer Type" required icon={<FaLayerGroup />}>
              <div className="lf-type-grid">
                {LAYER_TYPE_OPTIONS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`lf-type-chip lf-type-${t} ${form.type === t ? "selected" : ""}`}
                    onClick={() => onChange({ target: { name: "type", value: t } } as any)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="API Endpoint" icon={<FaServer />}>
              <input className="lf-input lf-mono" name="apiendpoint" value={form.apiendpoint} onChange={onChange} placeholder="/api/your-endpoint" />
            </Field>
          </div>

          {/* ─ SECTION 2: Appearance ─ */}
          <SectionDivider title="Appearance" />

          <div className="lf-grid-2">
            <Field label="Color" icon={<FaPalette />}>
              <div className="lf-color-row">
                <span
                  className="lf-color-preview"
                  style={{ background: isValidHex(form.color) ? form.color : "#cccccc" }}
                  title={form.color}
                />
                <input
                  className="lf-input lf-mono"
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={onChange}
                  placeholder="#E10600"
                  maxLength={7}
                />
              </div>
              {form.color && !isValidHex(form.color) && (
                <span className="lf-hint-err">Enter a valid hex e.g. #E10600</span>
              )}
            </Field>

            <Field label="Fill Color" icon={<FaPalette />}>
              <div className="lf-color-row">
                <span
                  className="lf-color-preview"
                  style={{ background: isValidHex(form.fillcolor) ? form.fillcolor : "#cccccc" }}
                  title={form.fillcolor}
                />
                <input
                  className="lf-input lf-mono"
                  type="text"
                  name="fillcolor"
                  value={form.fillcolor}
                  onChange={onChange}
                  placeholder="#32CD32"
                  maxLength={7}
                />
              </div>
              {form.fillcolor && !isValidHex(form.fillcolor) && (
                <span className="lf-hint-err">Enter a valid hex e.g. #32CD32</span>
              )}
            </Field>
          </div>

          <div className="lf-grid-2">
            <Field label="Opacity" icon={<FaRegWindowRestore />}>
              <div className="lf-opacity-wrap">
                <input
                  className="lf-input"
                  name="opacity"
                  value={form.opacity}
                  onChange={onChange}
                  placeholder="0.0 – 1.0"
                  type="number"
                  min="0" max="1" step="0.1"
                />
                {form.opacity && (
                  <div className="lf-opacity-bar">
                    <div
                      className="lf-opacity-fill"
                      style={{ width: `${Math.min(parseFloat(form.opacity) || 0, 1) * 100}%` }}
                    />
                  </div>
                )}
              </div>
            </Field>

            <Field label="Sort By" icon={<FaSort />}>
              <input className="lf-input" type="number" name="sortby" value={form.sortby} onChange={onChange} placeholder="e.g. 1" min="1" />
            </Field>
          </div>

          <div className="lf-grid-2">
            <Field label="Icon URL" icon={<FaImage />}>
              <input className="lf-input lf-mono" name="icon_url" value={form.icon_url} onChange={onChange} placeholder="/icons/marker.png" />
            </Field>

            <Field label="Geoserver Workspace" icon={<FaDatabase />}>
              <input className="lf-input lf-mono" name="geoserver_workspace" value={form.geoserver_workspace} onChange={onChange} placeholder="e.g. mas_bza_ws" />
            </Field>
          </div>

          {/* ─ SECTION 3: Popup Config ─ */}
          <SectionDivider title="Popup Configuration" />

          <div className="lf-grid-2">
            <Field label="Popup Type" icon={<FaRegWindowRestore />}>
              <input className="lf-input" name="popup_type" value={form.popup_type} onChange={onChange} placeholder="e.g. default" />
            </Field>
            <Field label="Popup Name" icon={<FaTag />}>
              <input className="lf-input" name="popup_name" value={form.popup_name} onChange={onChange} placeholder="Enter popup name" />
            </Field>
          </div>

          <div className="lf-grid-2">
            <Field label="Bind Popup Name" icon={<FaLink />}>
              <input className="lf-input" name="bind_popup_name" value={form.bind_popup_name} onChange={onChange} placeholder="Enter bind popup name" />
            </Field>
            <Field label="Popup Field Name" icon={<FaMapMarkerAlt />}>
              <input className="lf-input" name="popup_field_name" value={form.popup_field_name} onChange={onChange} placeholder="Enter popup field name" />
            </Field>
          </div>

          {/* ─ SECTION 4: Status ─ */}
          <SectionDivider title="Status" />

          <div className="lf-grid-2">
            <Field label="Is Enabled">
              <div className="lf-toggle-group">
                <button
                  type="button"
                  className={`lf-toggle ${form.isenabled === true ? "lf-toggle-on" : ""}`}
                  onClick={() => onToggle("isenabled", true)}
                >
                  <span className="lf-toggle-dot" />
                  <span>Enabled</span>
                </button>
                <button
                  type="button"
                  className={`lf-toggle ${form.isenabled === false ? "lf-toggle-off" : ""}`}
                  onClick={() => onToggle("isenabled", false)}
                >
                  <span className="lf-toggle-dot" />
                  <span>Disabled</span>
                </button>
              </div>
            </Field>

            <Field label="Is Activated">
              <div className="lf-toggle-group">
                <button
                  type="button"
                  className={`lf-toggle ${form.isactivated === true ? "lf-toggle-on" : ""}`}
                  onClick={() => onToggle("isactivated", true)}
                >
                  <span className="lf-toggle-dot" />
                  <span>Active</span>
                </button>
                <button
                  type="button"
                  className={`lf-toggle ${form.isactivated === false ? "lf-toggle-off" : ""}`}
                  onClick={() => onToggle("isactivated", false)}
                >
                  <span className="lf-toggle-dot" />
                  <span>Inactive</span>
                </button>
              </div>
            </Field>
          </div>

          {/* error */}
          {isError && (
            <div className="lf-error-banner">
              ⚠ {errorMessage ?? "Something went wrong. Please try again."}
            </div>
          )}

          {/* ── FOOTER ── */}
          <div className="lf-footer">
            <button type="button" className="lf-btn-cancel" onClick={onCancel} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="lf-btn-save" disabled={isSaving}>
              {isSaving
                ? <><span className="lf-spinner" /> {editLayer ? "Updating…" : "Saving…"}</>
                : (editLayer ? "Update Layer" : "Save Layer")}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LayerForm;