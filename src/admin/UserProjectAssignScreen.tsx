import { useState } from "react";
import { FiTrash2, FiPlus, FiEdit2 } from "react-icons/fi";

import { useProjects } from "../hooks/useLayers";
import { useGetUsers } from "../hooks/useUsers";
import {
  useAssignProject,
  useRemoveProject,
  useProjectUsers,
  useDeleteProject
} from "../hooks/useUserProjects";

import CreateProjectModal from "./CreateProjectModal";
import EditProjectModal from "./EditProjectModal";           

import "../styles/projects-screen.css";
import "./styles/admin-dashboard.css";
import ProjectDeleteConfirmModal from "./ProjectActions";

const UserProjectsScreen = () => {

  const { data: projectsData } = useProjects();
  const { data: users = [] } = useGetUsers();

  const projects = projectsData?.data || [];

  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [tab, setTab] = useState<"assign" | "assigned">("assign");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState<any>(null);  

  const deleteMutation = useDeleteProject();

  const { data: assignedUsersData } = useProjectUsers(selectedProject?.id);
  const assignedUsers = assignedUsersData?.data || [];

  const assignMutation = useAssignProject();
  const removeMutation = useRemoveProject();

  const assignedIds = assignedUsers.map((u: any) => u.user_id);

  const assignProject = (userId: number) => {
    assignMutation.mutate({
      user_id: userId,
      project_id: selectedProject.id,
      assigned_by: userId
    });
  };

  const removeProject = (userId: number) => {
    removeMutation.mutate({
      user_id: userId,
      project_id: selectedProject.id,
      removed_by: userId
    });
  };

  const [deleteTarget, setDeleteTarget] = useState<any>(null);

  const deleteProject = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null)
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
    <div className="projects-page">

      {/* HEADER */}
      <div className="admin-top-header">
        <div className="admin-top-header-left">
          <h2>Project Management</h2>
          <p>Railway Web GIS — Layer Styling Standards</p>
        </div>
      </div>

      {/* ===============================
         PROJECT ADMINISTRATION
      =============================== */}
      <section className="admin-section">

        <div className="section-header">
          <h3>Project Administration</h3>
          <button
            className="create-project-btn"
            onClick={() => setShowCreate(true)}
          >
            <FiPlus size={16} />
            Create Project
          </button>
        </div>

        <table className="projects-admin-table">
          <thead>
            <tr>
              <th>Project Name</th>
              <th>Code</th>
              <th>From</th>
              <th>To</th>
            <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((p: any) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.code}</td>
                <td>{p.from_station}</td>
                <td>{p.to_station}</td>

                <td className="action-cell">

                  <button
                    className="edit-btn"
                    title="Edit project"
                    onClick={() => setEditTarget(p)}
                  >
                    <FiEdit2 size={14} />
                  </button>

                  <button
                    className="delete-btn"
                    title="Delete project"
                    onClick={() => setDeleteTarget(p)}
                  >
                    <FiTrash2 size={14} />
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </section>

      {/* ===============================
         PROJECT ASSIGNMENT
      =============================== */}
      <section className="assignment-section">
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
                <p>Select a project to assign users.</p>
              </div>
            )}

            {selectedProject && (
              <>
                <div className="panel-header">
                  <div>
                    <h2>{selectedProject.name}</h2>
                    <p className="panel-desc">Assign or remove users for this project</p>
                  </div>
                  <input
                    className="search-input"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
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

                {/* ASSIGN USERS */}
                {tab === "assign" && (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Role</th>
                        <th></th>
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
                    </tbody>
                  </table>
                )}

                {/* ASSIGNED USERS */}
                {tab === "assigned" && (
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Role</th>
                        <th></th>
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
                              onClick={() => removeProject(u.id)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}

          </div>
        </div>
      </section>

      {/* MODALS */}

      {showCreate && (
        <CreateProjectModal onClose={() => setShowCreate(false)} />
      )}

      {editTarget && (
        <EditProjectModal
          project={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      <ProjectDeleteConfirmModal
        target={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={deleteProject}
      />

    </div>
  );
};

export default UserProjectsScreen;