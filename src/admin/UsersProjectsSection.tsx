import { useUsersWithProjects } from "../hooks/useUserProjects";


const UsersProjectsSection = () => {
  const { data, isLoading } = useUsersWithProjects();

  const users = data?.data || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="dashboard-section">

      <div className="section-header">
        <h3>User Assigned Projects</h3>
        <span className="user-count">{users.length} Users</span>
      </div>

     <div className="users-grid">
  {users.map((user: any) => (
    <div className="user-card" key={user.id}>

      <div className="user-card-header">
        <div className="user-avatar">
          {user.name.charAt(0).toUpperCase()}
        </div>

        <div className="user-info">
          <div className="user-name">{user.name}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </div>

      <div className={`role-badge role-${user.role}`}>
        {user.role}
      </div>

      <div className="user-projects">

        {user.projects.length === 0 ? (
          <div className="no-project">No projects assigned</div>
        ) : (
          user.projects.map((p: any) => (
            <span key={p.id} className="project-chip">
              {p.code}
            </span>
          ))
        )}

      </div>

    </div>
  ))}
</div>
    </div>
  );
};

export default UsersProjectsSection;