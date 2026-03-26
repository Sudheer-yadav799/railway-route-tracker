import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import companyLogo from "../assets/images/logo.jpeg";
import SearchBar from "./map/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedProject } from "../store/slices/projectSlice";
import { useUserProjectsById } from "../hooks/useUserProjects";

interface HeaderProps {
  mapRef: React.MutableRefObject<any>;
}

const Header = ({ mapRef }: HeaderProps) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [selectedproject, setSelectedproject] = useState<string>("Select Project");

  const menuRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.auth.user);

  const isAdmin = user?.Roles?.some(
    (role: any) => role.name.toLowerCase() === "admin"
  );

  const initials =
    user?.name?.split(" ")
      .map((w: string) => w[0])
      .join("")
      .toUpperCase() || "A";

  /* -----------------------------
     FETCH USER PROJECTS
  ------------------------------ */

  const { data: projectResponse } = useUserProjectsById(user?.id || null);
  const projects = projectResponse?.data || [];

  /* -----------------------------
     PROFILE MENU
  ------------------------------ */

  const menuItems = [
    { label: "My Profile", action: () => navigate("/userProfile") },

    ...(isAdmin
      ? [
          {
            label: "Admin Dashboard",
            action: () => window.open("/admin-dashboard", "_blank"),
          },
        ]
      : []),
  ];

  /* -----------------------------
     CLOSE DROPDOWNS
  ------------------------------ */

  useEffect(() => {

    const handler = (e: MouseEvent) => {

      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setMenuOpen(false);

      if (areaRef.current && !areaRef.current.contains(e.target as Node))
        setAreaOpen(false);

    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);

  }, []);

  /* -----------------------------
     RESTORE ACTIVE PROJECT
  ------------------------------ */

  useEffect(() => {

    if (!projects.length) return;

    const stored = localStorage.getItem("activeProject");

    let activeProject: any = null;

    if (stored) {

      const parsed = JSON.parse(stored);

      const exists = projects.find((p: any) => p.id === parsed.id);

      if (exists) {
        activeProject = exists;
      }

    }

    if (!activeProject) {
      activeProject = projects[0];
      localStorage.setItem("activeProject", JSON.stringify(activeProject));
    }

    setSelectedproject(activeProject.name);

    let lat = null;
    let lng = null;

    if (activeProject.map_view) {
      const [latStr, lngStr] = activeProject.map_view.split(",");
      lat = parseFloat(latStr.trim());
      lng = parseFloat(lngStr.trim());
    }

    dispatch(
      setSelectedProject({
        projectId: activeProject.id,
        lat,
        lng,
      })
    );

  }, [projects, dispatch]);

  /* -----------------------------
     SELECT PROJECT
  ------------------------------ */

  const handleProjectSelect = (project: any) => {

    let lat = null;
    let lng = null;

    if (project.map_view) {
      const [latStr, lngStr] = project.map_view.split(",");
      lat = parseFloat(latStr.trim());
      lng = parseFloat(lngStr.trim());
    }

    setSelectedproject(project.name);
    setAreaOpen(false);

    localStorage.setItem("activeProject", JSON.stringify(project));

    dispatch(
      setSelectedProject({
        projectId: project.id,
        lat,
        lng,
      })
    );

  };

  /* -----------------------------
     LOGOUT
  ------------------------------ */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("activeProject");

    navigate("/");

  };

  /* -----------------------------
     UI
  ------------------------------ */

  return (

    <header className="app-header">

      {/* LEFT */}

      <div className="header-left">

        <div className="brand-block">
          <img src={companyLogo} className="brand-logo" alt="Company Logo" />
          <div>
            {/* <div className="brand-tag">DGT</div> */}
            <div className="brand-title">Dharani Geo Portal</div>
          </div>
        </div>

        {/* PROJECT SELECTOR */}

        <div className="location-selector" ref={areaRef}>

          <button
            className="location-btn"
            onClick={() => setAreaOpen((v) => !v)}
          >
            📍 {selectedproject}
            <span className="caret">▾</span>
          </button>

          {areaOpen && (
            <div className="location-dropdown">

              {projects.map((project: any) => (
                <div
                  key={project.id}
                  className="location-item"
                  onClick={() => handleProjectSelect(project)}
                >
                  {project.name}
                </div>
              ))}

            </div>
          )}

        </div>

      </div>

      {/* SEARCH BAR */}

      <SearchBar mapRef={mapRef} />

      {/* RIGHT */}

      <div className="header-right">

        <div className="profile-menu" ref={menuRef}>

          <div
            className="profile-circle"
            onClick={() => setMenuOpen((v) => !v)}
          >
            {initials}
          </div>

          {menuOpen && (
            <div className="profile-dropdown">

              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="profile-option"
                  onClick={() => {
                    item.action();
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </div>
              ))}

              <div className="dropdown-divider" />

              <div
                className="profile-option danger"
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
              >
                Logout
              </div>

            </div>
          )}

        </div>

      </div>

    </header>

  );

};

export default Header;