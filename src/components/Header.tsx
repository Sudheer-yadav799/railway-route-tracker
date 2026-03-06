import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/header.css";
import companyLogo from "../assets/images/logo.jpeg";
import SearchBar from "./map/SearchBar";
import { useSelector } from "react-redux";

interface HeaderProps {
  mapRef: React.MutableRefObject<any>;
}

const Header = ({ mapRef }: HeaderProps) => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState("Hyderabad");

  const menuRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.auth.user);
  const isAdmin = user?.Roles?.some(
  (role: any) => role.name.toLowerCase() === "admin"
);

  const initials =
    user?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase() || "A";

  const areas = [
    "Hyderabad",
    "Banjara Hills",
    "Gachibowli",
    "Madhapur",
    "Secunderabad",
    "Kukatpally",
  ];

const menuItems = [
  { label: "My Profile", action: () => navigate("/userProfile") },

  ...(isAdmin
    ? [{ label: "Admin Dashboard", action: () => navigate("/admin-dashboard") }]
    : []),
];

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

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header className="app-header">

      {/* LEFT */}
      <div className="header-left">

        <div className="brand-block">
          <img src={companyLogo} className="brand-logo" alt="Company Logo" />
          <div>
            <div className="brand-tag">RIA</div>
            <div className="brand-title">Railway Route Infrastructure</div>
          </div>
        </div>

        {/* LOCATION */}
        <div className="location-selector" ref={areaRef}>
          <button
            className="location-btn"
            onClick={() => setAreaOpen((v) => !v)}
          >
            📍 {selectedArea}
            <span className="caret">▾</span>
          </button>

          {areaOpen && (
            <div className="location-dropdown">
              {areas.map((area) => (
                <div
                  key={area}
                  className="location-item"
                  onClick={() => {
                    setSelectedArea(area);
                    setAreaOpen(false);
                  }}
                >
                  {area}
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