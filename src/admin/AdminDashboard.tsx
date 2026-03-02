import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/admin-dashboard.css";
import UsersScreen          from "./UsersScreen";
import ProjectLayersScreen  from "./ProjectLayersScreen";
import OverviewScreen       from "./OverviewScreen";
import LayerStylesScreen    from "./LayerStylesScreen";
import ProjectsScreen       from "./ProjectsScreen"
import { useProjects }      from "../hooks/useLayers";

type ActiveScreen = "overview" | "users" | "layers" | "projects" | "project-layers";

const AdminDashboard = () => {
  const [active, setActive]               = useState<ActiveScreen>("overview");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const navigate = useNavigate();

  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const projects = projectsData?.data || [];

  // called from ProjectsScreen when user clicks a project row
  const handleProjectClick = (id: number) => {
    setSelectedProject(id);
    setActive("project-layers");
  };

  const NAV = [
    { key: "overview",  icon: "📊", label: "Dashboard"    },
    { key: "users",     icon: "👥", label: "Users"         },
    { key: "layers",    icon: "🗺️", label: "Layer Styles"  },
    { key: "projects",  icon: "🚉", label: "Projects"      },
  ];

  return (
    <div className="admin-layout">

      {/* ══ SIDEBAR ══ */}
      <aside className="admin-sidebar">
        <div className="admin-brand" onClick={() => navigate("/map")}>
          🚆 RIA Admin
        </div>

        <div className="sidebar-section-label">Main Menu</div>

        {NAV.map(n => (
          <div
            key={n.key}
            className={`admin-menu-item ${active === n.key || (n.key === "projects" && active === "project-layers") ? "active" : ""}`}
            onClick={() => setActive(n.key as ActiveScreen)}
          >
            <span>{n.icon}</span>
            <span>{n.label}</span>
            {n.key === "projects" && !projectsLoading && (
              <span className="sidebar-count">{projects.length}</span>
            )}
          </div>
        ))}

        {/* show selected project name under Projects when viewing layers */}
        {active === "project-layers" && selectedProject && (
          <div className="sidebar-active-project">
            {projects.find((p: any) => p.id === selectedProject)?.name || ""}
          </div>
        )}
      </aside>

      {/* ══ RIGHT PANEL ══ */}
      <main className="admin-content">
        {active === "overview"       && <OverviewScreen />}
        {active === "users"          && <UsersScreen />}
        {active === "layers"         && <LayerStylesScreen />}
        {active === "projects"       && (
          <ProjectsScreen
            projects={projects}
            isLoading={projectsLoading}
            onSelectProject={handleProjectClick}
          />
        )}
        {active === "project-layers" && (
          <ProjectLayersScreen
            projectId={selectedProject}
            onBack={() => setActive("projects")}
          />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;