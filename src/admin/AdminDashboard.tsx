import { useState } from "react";
import "./styles/admin-dashboard.css";
import UsersScreen from "./UsersScreen";
import LayersScreen from "./LayersScreen";
import LayerStylesDashboard from "./LayerStylesDashboard";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [active, setActive] = useState("overview");

    const navigate = useNavigate()
  return (
    <div className="admin-layout">

      {/* LEFT SIDEBAR */}
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={()=> navigate('/map')}>
          🚆 RIA Admin
        </div>

        <div
          className={`admin-menu-item ${active === "overview" ? "active" : ""}`}
          onClick={() => setActive("overview")}
        >
          📊 Dashboard
        </div>

        <div
          className={`admin-menu-item ${active === "users" ? "active" : ""}`}
          onClick={() => setActive("users")}
        >
          👥 Users
        </div>

        <div
          className={`admin-menu-item ${active === "layers" ? "active" : ""}`}
          onClick={() => setActive("layers")}
        >
          🗺️ Layers
        </div>
      </aside>

      {/* RIGHT PANEL */}
      <main className="admin-content">

        {active === "overview" && <LayerStylesDashboard />}
        {active === "users" && <UsersScreen />}
        {active === "layers" && <LayersScreen/>}

      </main>
    </div>
  );
};

export default AdminDashboard;