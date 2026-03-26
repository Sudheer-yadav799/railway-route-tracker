import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/admin-dashboard.css";
import UsersScreen         from "./UsersScreen";
import OverviewScreen      from "./OverviewScreen";
import LayerStylesScreen   from "./LayerStylesScreen";
import ProjectsScreen      from "./ProjectsScreen";
import { useProjects }     from "../hooks/useLayers";
import { FiLogOut, FiMap, FiUser } from "react-icons/fi";
import UserProjectAssignScreen from "./UserProjectAssignScreen";
import companyLogo from "../assets/images/logo.jpeg";
import { useLogout } from "../hooks/useAuth";

import {
  FaTachometerAlt,
  FaUsers,
  FaLayerGroup,
  FaProjectDiagram
} from "react-icons/fa";
type ActiveScreen = "dashboardoverview" | "users" | "layers" | "projects" | "project-layers";

const AdminDashboard = () => {
  const [active, setActive]                   = useState<ActiveScreen>("dashboardoverview");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const projects = projectsData?.data || [];
  const logoutMutation = useLogout();

  const handleProjectClick = (id: number) => {
    setSelectedProject(id);
    setActive("project-layers");
  };


const NAV = [
  {
    key: "dashboardoverview",
    icon: <FaTachometerAlt />,
    label: "Dashboard"
  },
  {
    key: "users",
    icon: <FaUsers />,
    label: "Users"
  },
  {
    key: "layers",
    icon: <FaLayerGroup />,
    label: "Map Layers"
  },
  {
    key: "projects",
    icon: <FaProjectDiagram />,
    label: "Projects"
  }
];


  return (
    <div className="admin-layout">

      {/* ══ SIDEBAR ══ */}
      <aside className="admin-sidebar">

        {/* Brand */}
        <div className="admin-brand-block">
          <div className="admin-brand" onClick={() => navigate("/map")}>
            <div>
              <img src={companyLogo} className="brand-logo" alt="Company Logo" />
              <div className="admin-brand-text">DGT Admin</div>
              <div className="admin-brand-sub">Dharani Geo Portal</div>
            </div>
          </div>
        </div>
        {/* Nav items */}
        <div className="admin-nav-area">
          <div className="sidebar-section-label">Main Menu</div>

          {NAV.map(n => (
            <div
              key={n.key}
              className={`admin-menu-item ${
                active === n.key || (n.key === "projects" && active === "project-layers")
                  ? "active"
                  : ""
              }`}
              onClick={() => setActive(n.key as ActiveScreen)}
            >
              <span className="admin-menu-item-icon">{n.icon}</span>
              <span className="admin-menu-item-label">{n.label}</span>
              {n.key === "projects" && !projectsLoading && (
                <span className="sidebar-count">{projects.length}</span>
              )}
            </div>
          ))}

          {active === "project-layers" && selectedProject && (
            <div className="sidebar-active-project">
              {projects.find((p: any) => p.id === selectedProject)?.name || ""}
            </div>
          )}
        </div>

        {/* Bottom links */}
        <div className="admin-sidebar-bottom">
          {[
            { icon: <FiUser/>, label: "Profile"  ,action: () => navigate("/userprofile")},
            { icon: <FiMap/>, label: "View Map",  action: () => navigate("/map") },
            { icon:  <FiLogOut/>, label: "Sign Out" ,action:() => logoutMutation.mutate() },
          ].map(item => (
            <div
              key={item.label}
              className="sidebar-bottom-item"
              onClick={item.action}
            >
              {item.icon}&nbsp;&nbsp;{item.label}
            </div>
          ))}
        </div>
      </aside>

      {/* ══ RIGHT PANEL ══ */}
      <main className="admin-content">
        {active === "dashboardoverview"       && <OverviewScreen />}
        {active === "users"          && <UsersScreen />}
        {active === "layers"         && <LayerStylesScreen />}
        {active === "projects" && <UserProjectAssignScreen />}
        
      </main>
    </div>
  );
};

export default AdminDashboard;