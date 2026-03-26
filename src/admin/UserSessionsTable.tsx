import { useUserSessions } from "../hooks/useUsers";
import "./styles/admin-dashboard.css";

interface Props {
  users: any[];
}

const UserSessionsTable = () => {
      const { data, isLoading } = useUserSessions();
    
      if (isLoading) return <div>Loading sessions...</div>;
    
      const users = data?.users || [];
  return (
    <div className="session-table-container">

      <div className="table-header">
        <h4>Today's User Sessions</h4>
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
          {users.length === 0 ? (
            <tr>
              <td colSpan={7} className="no-data">
                No sessions today
              </td>
            </tr>
          ) : (
            users.map((u: any, index: number) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile_number}</td>

                <td>
                  {new Date(u.login_time).toLocaleTimeString()}
                </td>

                <td>
                  {u.logout_time
                    ? new Date(u.logout_time).toLocaleTimeString()
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