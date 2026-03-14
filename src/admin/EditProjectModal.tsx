import { useState, useEffect } from "react";
import { useUpdateProject } from "../hooks/useUserProjects";

import {
  FiBox,
  FiHash,
  FiMapPin,
  FiGlobe,
  FiArrowRight,
  FiX,
  FiActivity,
  FiLayers
} from "react-icons/fi";

import "../styles/projects-screen.css";

interface Props {
  project: any;
  onClose: () => void;
}

const EditProjectModal = ({ project, onClose }: Props) => {

  const updateMutation = useUpdateProject();

  const [form, setForm] = useState({
    name: "",
    code: "",
    from_station: "",
    to_station: "",
    geoserver_workspace: "",
    map_view_center: "",
    track_length_km: "",
    station_count: ""
  });

  // Pre-fill form with existing project data
  useEffect(() => {
    if (project) {
      setForm({
        name: project.name || "",
        code: project.code || "",
        from_station: project.from_station || "",
        to_station: project.to_station || "",
        geoserver_workspace: project.geoserver_workspace || "",
        map_view_center: project.map_view_center || "",
        track_length_km: project.track_length_km || "",
        station_count: project.station_count || ""
      });
    }
  }, [project]);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    updateMutation.mutate(
      { projectId: project.id, data: form },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        {/* HEADER */}
        <div className="modal-header">
          <h2>Edit Project</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* FORM */}
        <div className="form-grid">

          <div className="input-group">
            <label>Project Name</label>
            <div className="input-icon">
              <FiBox />
              <input
                name="name"
                placeholder="Enter project name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Project Code</label>
            <div className="input-icon">
              <FiHash />
              <input
                name="code"
                placeholder="Project code"
                value={form.code}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>From Station</label>
            <div className="input-icon">
              <FiMapPin />
              <input
                name="from_station"
                placeholder="Start station"
                value={form.from_station}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>To Station</label>
            <div className="input-icon">
              <FiArrowRight />
              <input
                name="to_station"
                placeholder="End station"
                value={form.to_station}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>GeoServer Workspace</label>
            <div className="input-icon">
              <FiGlobe />
              <input
                name="geoserver_workspace"
                placeholder="Workspace name"
                value={form.geoserver_workspace}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Map Center</label>
            <div className="input-icon">
              <FiMapPin />
              <input
                name="map_view_center"
                placeholder="lat, lng"
                value={form.map_view_center}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Track Length (km)</label>
            <div className="input-icon">
              <FiActivity />
              <input
                name="track_length_km"
                placeholder="e.g. 274.30"
                value={form.track_length_km}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Station Count</label>
            <div className="input-icon">
              <FiLayers />
              <input
                name="station_count"
                placeholder="e.g. 12"
                type="number"
                value={form.station_count}
                onChange={handleChange}
              />
            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="create-btn"
            onClick={submit}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProjectModal;