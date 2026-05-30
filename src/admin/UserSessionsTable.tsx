import { useState } from "react";
import { useUserSessions } from "../hooks/useUsers";
import "./styles/admin-dashboard.css";

import {
  FiFilter,
  FiClock,
  FiCalendar,
  FiBarChart2,
  FiChevronDown,
} from "react-icons/fi";

const UserSessionsTable = () => {
 

  const [filterType, setFilterType] = useState("today");
  const [showFilters, setShowFilters] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");



const { data, isLoading } = useUserSessions(
  filterType,
  startDate,
  endDate
);

  if (isLoading) return <div>Loading sessions...</div>;

  const users = data?.users || [];

  const filteredUsers = users.filter((user: any) => {
    const loginDate = new Date(user.login_time);
    const now = new Date();

    switch (filterType) {
      case "today":
        return loginDate.toDateString() === now.toDateString();

      case "yesterday": {
        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);

        return loginDate.toDateString() === yesterday.toDateString();
      }

      case "lastWeek": {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);

        return loginDate >= lastWeek;
      }

      case "thisMonth":
        return (
          loginDate.getMonth() === now.getMonth() &&
          loginDate.getFullYear() === now.getFullYear()
        );

      case "custom": {
        if (!startDate || !endDate) return true;

        const start = new Date(startDate);
        const end = new Date(endDate);

        end.setHours(23, 59, 59, 999);

        return loginDate >= start && loginDate <= end;
      }

      default:
        return true;
    }
  });


const filterOptions = [
  { value: "today", label: "Today", icon: <FiClock /> },
  { value: "yesterday", label: "Yesterday", icon: <FiCalendar /> },
  { value: "lastWeek", label: "Last Week", icon: <FiBarChart2 /> },
  { value: "thisMonth", label: "This Month", icon: <FiCalendar /> },
  { value: "custom", label: "Custom Range", icon: <FiFilter /> },
];

const selectedFilter =
  filterOptions.find((f) => f.value === filterType) || filterOptions[0];


  return (
    <div className="session-table-container">
      <div className="table-header">
        <h4>User Sessions</h4>

       <div className="session-filters">
  <div className="custom-filter-dropdown">
    <button
      className="filter-trigger"
      onClick={() => setShowFilters(!showFilters)}
    >
      <span className="filter-left">
        {selectedFilter.icon}
        <span>{selectedFilter.label}</span>
      </span>

      <FiChevronDown
        className={`dropdown-arrow ${showFilters ? "open" : ""}`}
      />
    </button>

    {showFilters && (
      <div className="filter-menu">
        {filterOptions.map((option) => (
          <div
            key={option.value}
            className={`filter-item ${
              filterType === option.value ? "active" : ""
            }`}
            onClick={() => {
              setFilterType(option.value);
              setShowFilters(false);
            }}
          >
            {option.icon}
            <span>{option.label}</span>
          </div>
        ))}
      </div>
    )}
  </div>

  {filterType === "custom" && (
    <>
      <input
        className="session-date-input"
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <input
        className="session-date-input"
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </>
  )}
</div>
      </div>

      <div className="table-scroll">
        <table className="session-table">
          <thead>
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Login Time</th>
              <th>Logout Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="no-data">
                  No sessions found
                </td>
              </tr>
            ) : (
              filteredUsers.map((u: any, index: number) => (
                <tr key={u.id || index}>
                  <td>{index + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.mobile_number}</td>

                  <td>
                    {u.login_time
                      ? new Date(u.login_time).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    {u.logout_time
                      ? new Date(u.logout_time).toLocaleString()
                      : "-"}
                  </td>

                  <td>
                    <span
                      className={
                        u.status === "active"
                          ? "status-badge active"
                          : "status-badge loggedout"
                      }
                    >
                      {u.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserSessionsTable;