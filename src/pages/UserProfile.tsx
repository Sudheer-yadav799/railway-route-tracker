import React from "react";
import {
  FaEnvelope,
  FaPhone,
  FaShieldAlt,
  FaSignOutAlt,
  FaArrowLeft
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import "../styles/user-account.css";
import { useGetUserById } from "../hooks/useUsers";
import { useLogout } from "../hooks/useAuth";

const UserAccount: React.FC = () => {

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || "";
  const { data, isLoading } = useGetUserById(userId);
  const logoutMutation = useLogout();

  const user = data?.data;

  if (isLoading) return <div className="profile-loading">Loading...</div>;
  if (!user) return <div className="profile-error">User not found</div>;

  const initials = user.name
    ?.split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase();

  const role = user.Roles?.[0]?.name || "User";

  return (
    <div className="profile-page">

      {/* BACK BUTTON */}
      <button
        className="profile-back"
        onClick={() => navigate(-1)}
      >
        <FaArrowLeft /> Back
      </button>

      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header" />

        {/* AVATAR */}
        <div className="profile-avatar">
          {initials}
        </div>

        {/* USER INFO */}
        <div className="profile-user">
          <h2>{user.name}</h2>
          <p>#USR-{user.id}</p>

          <span className="profile-role">
            {role}
          </span>
        </div>

        {/* STATS */}
        <div className="profile-stats">
          <div>
            <strong>{user.projectIds?.length || 0}</strong>
            <span>PROJECTS</span>
          </div>
        </div>

        {/* INFO BLOCKS */}
        <div className="profile-info">

          <div className="info-row">
            <FaEnvelope />
            <div>
              <span>Email</span>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="info-row">
            <FaPhone />
            <div>
              <span>Mobile</span>
              <p>{user.mobile_number || "—"}</p>
            </div>
          </div>

          <div className="info-row">
            <FaShieldAlt />
            <div>
              <span>Account Status</span>
              <p className={user.is_active ? "active" : "inactive"}>
                {user.is_active ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          className="profile-logout"
          onClick={() => logoutMutation.mutate()}
        >
          <FaSignOutAlt /> Sign Out
        </button>

      </div>
    </div>
  );
};

export default UserAccount;