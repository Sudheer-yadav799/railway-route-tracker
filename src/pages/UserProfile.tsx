import React from "react";

import "../styles/user-account.css";
import { useGetUserById } from "../hooks/useUsers";
import { useLogout } from "../hooks/useAuth";

const UserAccount: React.FC = () => {
  const userId = localStorage.getItem("userId") || "";
  const { data: user, isLoading } = useGetUserById(userId);
  const logoutMutation = useLogout();

  if (isLoading) {
    return <div className="loading-text">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error-text">User not found</div>;
  }

  const initials = user.name
    ?.split(" ")
    .map((word: string) => word[0])
    .join("")
    .toUpperCase();

  return (
    <div className="user-page">
      <div className="user-overlay"></div>

      <div className="user-card">
        <div className="user-avatar">{initials}</div>

        <h2 className="user-title">{user.name}</h2>
        <p className="user-subtitle">
          {user.Roles?.[0]?.name || "User"}
        </p>

        <div className="user-info-row">
          <span className="user-label">Email</span>
          <span className="user-value">{user.email}</span>
        </div>

        <div className="user-info-row">
          <span className="user-label">Mobile</span>
          <span className="user-value">{user.mobile_number}</span>
        </div>

        <div className="user-info-row">
          <span className="user-label">Status</span>
          <span
            className={`user-value ${user.is_active ? "active" : "inactive"
              }`}
          >
            {user.is_active ? "Active" : "Inactive"}
          </span>
        </div>


        <button
          className="user-button"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserAccount;
