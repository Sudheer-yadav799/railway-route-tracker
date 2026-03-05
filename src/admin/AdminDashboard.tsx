import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/admin-dashboard.css";
import UsersScreen         from "./UsersScreen";
import OverviewScreen      from "./OverviewScreen";
import LayerStylesScreen   from "./LayerStylesScreen";
import ProjectsScreen      from "./ProjectsScreen";
import { useProjects }     from "../hooks/useLayers";
import { FiUser } from "react-icons/fi";
import UserProjectAssignScreen from "./UserProjectAssignScreen";

type ActiveScreen = "overview" | "users" | "layers" | "projects" | "project-layers" |"user-projects";

const AdminDashboard = () => {
  const [active, setActive]                   = useState<ActiveScreen>("overview");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const projects = projectsData?.data || [];

  const handleProjectClick = (id: number) => {
    setSelectedProject(id);
    setActive("project-layers");
  };

  const NAV = [
    { key: "overview", icon: "⊞",  label: "Dashboard"   },
    { key: "users",    icon: "👥", label: "Users"        },
    { key: "layers",   icon: "🗺️", label: "Layer Styles" },
    { key: "user-projects", icon: "🔗", label: "User Projects" }
  ];

  return (
    <div className="admin-layout">

      {/* ══ SIDEBAR ══ */}
      <aside className="admin-sidebar">

        {/* Brand */}
        <div className="admin-brand-block">
          <div className="admin-brand" onClick={() => navigate("/map")}>
            <div>
              <div className="admin-brand-text">RIA Admin</div>
              <div className="admin-brand-sub">Railway Infrastrure Board</div>
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
            { icon: "🌐", label: "View Map",  action: () => navigate("/map") },
            { icon: "🚪", label: "Sign Out" },
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
        {active === "overview"       && <OverviewScreen />}
        {active === "users"          && <UsersScreen />}
        {active === "layers"         && <LayerStylesScreen />}
        {active === "user-projects" && <UserProjectAssignScreen />}
        
      </main>
    </div>
  );
};

export default AdminDashboard;