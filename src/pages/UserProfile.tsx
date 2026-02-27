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
  <div className="profile-wrapper">

    {/* Gradient Cover */}
    <div className="profile-cover"></div>

    {/* Main Card */}
    <div className="profile-card">

      {/* Avatar Floating */}
      <div className="profile-avatar">
        {initials}
      </div>

      <div className="profile-content">

        <h2 className="profile-name">{user.name}</h2>
        <p className="profile-role">
          {user.Roles?.[0]?.name || "User"}
        </p>

        {/* Info Section */}
        <div className="profile-info">
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{user.email}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Mobile</span>
            <span className="info-value">{user.mobile_number}</span>
          </div>

          <div className="info-item">
            <span className="info-label">Status</span>
            <span className={`info-value status ${user.is_active ? "active" : "inactive"}`}>
              {user.is_active ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        <button
          className="profile-logout"
          onClick={() => logoutMutation.mutate()}
        >
          Logout
        </button>

      </div>
    </div>
  </div>
);
};

export default UserAccount;
