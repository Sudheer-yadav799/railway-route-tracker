import { useUserSessions } from "../hooks/useUsers";
import UserSessionsTable from "./UserSessionsTable";
import "./styles/admin-dashboard.css";

const UserSessionsSection = () => {
  const { data, isLoading } = useUserSessions();

  if (isLoading) return <div>Loading sessions...</div>;

  const users = data?.users || [];

  const activeUsers = users.filter((u: any) => u.status === "active").length;
  const logoutUsers = users.filter((u: any) => u.status === "logged_out").length;

  const loginToday = users.length;

  return (
    <div className="session-section">

      {/* CARDS */}
      <div className="stats-grid">

        <div className="stat-card session-active">
          <div className="stat-icon-box">🟢</div>
          <div className="stat-info">
            <div className="stat-value">{activeUsers}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>

        <div className="stat-card session-inactive">
          <div className="stat-icon-box">🔴</div>
          <div className="stat-info">
            <div className="stat-value">{logoutUsers}</div>
            <div className="stat-label">Logged Out</div>
          </div>
        </div>

        <div className="stat-card session-login">
          <div className="stat-icon-box">🔑</div>
          <div className="stat-info">
            <div className="stat-value">{loginToday}</div>
            <div className="stat-label">Logins Today</div>
          </div>
        </div>

      </div>

      {/* TABLE */}
    

    </div>
  );
};

export default UserSessionsSection;