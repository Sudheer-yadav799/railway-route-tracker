import { useState } from "react";
import { useCreateProject } from "../hooks/useUserProjects";

import {
  FiBox,
  FiHash,
  FiMapPin,
  FiGlobe,
  FiArrowRight,
  FiX
} from "react-icons/fi";

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
    map_view_center: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = () => {
    createMutation.mutate(form, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        {/* HEADER */}

        <div className="modal-header">
          <h2>Create Project</h2>

          <button className="modal-close" onClick={onClose}>
            <FiX size={18}/>
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
                placeholder="lat,lng"
                onChange={handleChange}
              />
            </div>
          </div>

        </div>


        {/* ACTIONS */}

        <div className="modal-actions">

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="create-btn"
            onClick={submit}
          >
            Create Project
          </button>

        </div>

      </div>

    </div>
  );
};

export default CreateProjectModal;