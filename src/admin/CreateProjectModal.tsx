import { useState } from "react";
import { useCreateProject } from "../hooks/useUserProjects";
import { FiBox, FiHash, FiMapPin, FiGlobe, FiArrowRight, FiX, FiActivity, FiLayers } from "react-icons/fi";
import "../styles/projects-screen.css";

interface Props {
  onClose: () => void;
}

const CreateProjectModal = ({ onClose }: Props) => {
  const createMutation = useCreateProject();

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = () => {
    createMutation.mutate(form, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">

        <div className="modal-header">
          <h2>Create Project</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        <div className="form-grid">

          <div className="input-group">
            <label>Project Name</label>
            <div className="input-icon">
              <FiBox />
              <input name="name" placeholder="Enter project name" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Project Code</label>
            <div className="input-icon">
              <FiHash />
              <input name="code" placeholder="e.g. KMA_NZM" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>From Station</label>
            <div className="input-icon">
              <FiMapPin />
              <input name="from_station" placeholder="Start station" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>To Station</label>
            <div className="input-icon">
              <FiArrowRight />
              <input name="to_station" placeholder="End station" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>GeoServer Workspace</label>
            <div className="input-icon">
              <FiGlobe />
              <input name="geoserver_workspace" placeholder="Workspace name" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Map Center</label>
            <div className="input-icon">
              <FiMapPin />
              <input name="map_view_center" placeholder="lat, lng" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Track Length (km)</label>
            <div className="input-icon">
              <FiActivity />
              <input name="track_length_km" placeholder="e.g. 274.30" onChange={handleChange} />
            </div>
          </div>

          <div className="input-group">
            <label>Station Count</label>
            <div className="input-icon">
              <FiLayers />
              <input name="station_count" placeholder="e.g. 12" type="number" onChange={handleChange} />
            </div>
          </div>

        </div>

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="create-btn"
            onClick={submit}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Creating..." : "Create Project"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default CreateProjectModal;