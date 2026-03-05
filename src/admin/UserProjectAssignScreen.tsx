import { useState } from "react";
import { useProjects } from "../hooks/useLayers";
import { useGetUsers } from "../hooks/useUsers";
import {
  useAssignProject,
  useRemoveProject,
  useProjectUsers
} from "../hooks/useUserProjects";

const CURRENT_USER_ID = 1;

import "../styles/projects-screen.css"

import "./styles/admin-dashboard.css"

const UserProjectsScreen = () => {

  const { data: projectsData } = useProjects();
  const { data: users = [] } = useGetUsers();

  const projects = projectsData?.data || [];

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tab, setTab] = useState<"assign" | "assigned">("assign");
  const [search, setSearch] = useState("");

  const { data: assignedUsersData } = useProjectUsers(selectedProject?.id);

  const assignedUsers = assignedUsersData?.data || [];

  const assignMutation = useAssignProject();
  const removeMutation = useRemoveProject();

  const assignedIds = assignedUsers.map((u: any) => u.user_id);

  const assignProject = (userId: number) => {
    assignMutation.mutate({
      user_id: userId,
      project_id: selectedProject.id,
      assigned_by: CURRENT_USER_ID
    });
  };

  const removeProject = (userId: number) => {
    removeMutation.mutate({
      user_id: userId,
      project_id: selectedProject.id,
      removed_by: CURRENT_USER_ID
    });
  };

  const filteredUsers = users.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredAssigned = assignedUsers.filter((u: any) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const getRoleBadgeClass = (role?: string) => {
    const r = role?.toLowerCase();

    if (r === "admin") return "role-admin";
    if (r === "customer") return "role-customer";
    if (r === "guest") return "role-guest";

    return "role-default";
  };

  return (
    <div>
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Project Mangement</h2>
          <p>Railway Web GIS — Layer Styling Standards</p>
        </div>
      </div>
      <div className="project-user-layout">



        {/* LEFT PROJECT LIST */}

        <div className="project-list">

          <h3>Projects</h3>

          {projects.map((p: any) => (
            <div
              key={p.id}
              className={`project-row ${selectedProject?.id === p.id ? "active" : ""}`}
              onClick={() => setSelectedProject(p)}
            >
              {p.name}
            </div>
          ))}

        </div>


        {/* RIGHT PANEL */}

        <div className="users-panel">

          {!selectedProject && (
            <div className="empty-state">
              <h3>No Project Selected</h3>
              <p>Select a project from the left panel to assign users.</p>
            </div>
          )}

          {selectedProject && (
            <>

              <div className="panel-header">

                <div>
                  <h2>{selectedProject.name}</h2>
                  <p className="panel-desc">
                    Assign or remove users who can access this project.
                  </p>
                </div>

                <div> <input
                  className="search-input"
                  placeholder="Search by name, phone or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                /></div>


              </div>


              {/* TABS */}

              <div className="tabs">

                <button
                  className={tab === "assign" ? "active" : ""}
                  onClick={() => setTab("assign")}
                >
                  Assign Users
                </button>

                <button
                  className={tab === "assigned" ? "active" : ""}
                  onClick={() => setTab("assigned")}
                >
                  Assigned Users ({assignedUsers.length})
                </button>

              </div>


              {/* ASSIGN TAB */}

              {tab === "assign" && (

                <table className="users-table">

                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredUsers
                      .filter((u: any) => !assignedIds.includes(u.id))
                      .map((u: any) => (

                        <tr key={u.id}>

                          <td>{u.name}</td>

                          <td>
                            <span className={`role-badge ${getRoleBadgeClass(u.Roles?.[0]?.name)}`}>
                              {u.Roles?.[0]?.name || "No Role"}
                            </span>
                          </td>

                          <td>

                            <button
                              className="assign-btn"
                              onClick={() => assignProject(u.id)}
                            >
                              Assign
                            </button>

                          </td>

                        </tr>

                      ))}

                       {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={3} className="table-empty">
                    No users found
                  </td>
                </tr>
              )}

                  </tbody>

                </table>


              )}

             
             
              {/* ASSIGNED TAB */}

              {tab === "assigned" && (

                <table className="users-table">

                  <thead>
                    <tr>
                      <th>User Name</th>
                      <th>Role</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredAssigned.map((u: any) => (

                      <tr key={u.user_id}>

                        <td>{u.name}</td>

                        <td>
                          <span className={`role-badge ${getRoleBadgeClass(u.rolename)}`}>
                            {u.rolename || "Unknown"}
                          </span>
                        </td>

                        <td>

                          <button
                            className="remove-btn"
                            onClick={() => removeProject(u.user_id)}
                          >
                            Remove
                          </button>

                        </td>

                      </tr>

                    ))}
                     {filteredAssigned.length === 0 && (
                <tr>
                  <td colSpan={3} className="table-empty">
                    No users assigned to this project
                  </td>
                </tr>
              )}

                  </tbody>

                </table>
                   
              )}
                
            </>

          )}

        </div>

      </div>
    </div>



  );
};

export default UserProjectsScreen;