import { useState, useMemo } from "react";
import { FaUserPlus, FaSearch, FaTrash, FaSortAmountDown, FaSortAmountUp, FaEdit } from "react-icons/fa";
import { useDeleteUser, useGetUsers } from "../hooks/useUsers";
import AdminCreateUser from "./AdminCreateUser";
import "../styles/user-account.css";

const PAGE_SIZE = 5;

const UsersScreen = () => {
  const { data: users = [], isLoading } = useGetUsers();

  const [openCreate, setOpenCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);

  const currentUser = localStorage.getItem("userId");
  const [editUser, setEditUser] = useState<any>(null);

  /* ── filter + sort ── */
  const filteredUsers = useMemo(() => {
    let result = [...users];

    if (search) {
      result = result.filter((user: any) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      result = result.filter(
        (user: any) => user.Roles?.[0]?.name?.toLowerCase() === roleFilter
      );
    }

    result.sort((a: any, b: any) => {
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [users, search, roleFilter, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: string) => {
    if (sortField === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDelete = (id: number) => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    deleteUser({ id, deletedById: currentUser });
  };

  /* ── role → colour ── */
  const roleCls = (role: string) => {
    const r = role?.toLowerCase();
    if (r === "admin") return "role-admin";
    if (r === "customer") return "role-customer";
    if (r === "guest") return "role-guest";
    return "role-default";
  };

  /* ── avatar colour from name ── */
  const avatarColor = (name: string) => {
    const colors = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899"];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="us-page">

      {/* ── HEADER ── */}
      <div className="us-header">
        <div>
          <h2 className="us-title">Users</h2>
          <p className="us-subtitle">Manage all system users · {users.length} total</p>
        </div>
        <button className="us-btn-new" onClick={() => setOpenCreate(true)}>
          <FaUserPlus /> New User
        </button>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="us-filters">
        <div className="us-search-wrap">
          <FaSearch className="us-search-icon" />
          <input
            className="us-search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>

        <div className="us-role-tabs">
          {["all", "admin", "customer", "guest"].map((r) => (
            <button
              key={r}
              className={`us-role-tab ${roleFilter === r ? "active" : ""}`}
              onClick={() => { setRoleFilter(r); setPage(1); }}
            >
              {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <span className="us-count">{filteredUsers.length} users</span>
      </div>

      {/* ── TABLE ── */}
      <div className="us-card">
        <table className="us-table">
          <thead>
            <tr>
              <th className="us-th us-col-name" onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                <span>Name</span>
                {sortField === "name"
                  ? (sortOrder === "asc" ? <FaSortAmountUp className="us-sort-icon" /> : <FaSortAmountDown className="us-sort-icon" />)
                  : <FaSortAmountDown className="us-sort-icon us-sort-inactive" />}
              </th>
              <th className="us-th us-col-email">Email</th>
              <th className="us-th us-col-mobile">Mobile</th>
              <th className="us-th us-col-role">Role</th>
              <th className="us-th us-col-status">Status</th>
              <th className="us-th us-col-date" onClick={() => handleSort("createdAt")} style={{ cursor: "pointer" }}>
                <span>Created</span>
                {sortField === "createdAt"
                  ? (sortOrder === "asc" ? <FaSortAmountUp className="us-sort-icon" /> : <FaSortAmountDown className="us-sort-icon" />)
                  : null}
              </th>
              <th className="us-th us-col-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="us-loading">
                  <span className="us-spinner" /> Loading users…
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="us-empty">No users found.</td>
              </tr>
            ) : (
              paginatedUsers.map((user: any) => (
                <tr key={user.id} className="us-row">
                  <td className="us-td">
                    <div className="us-user-info">
                      <div className="us-avatar" style={{ background: avatarColor(user.name) }}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="us-user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className="us-td us-text-soft">{user.email}</td>
                  <td className="us-td us-text-soft">{user.mobile_number || "—"}</td>
                  <td className="us-td">
                    <span className={`us-role-badge ${roleCls(user.Roles?.[0]?.name)}`}>
                      {user.Roles?.[0]?.name || "No Role"}
                    </span>
                  </td>
                  <td className="us-td">
                    <span className={`us-status-badge ${user.is_active ? "us-active" : "us-inactive"}`}>
                      <span className="us-status-dot" />
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="us-td us-text-soft">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit", month: "short", year: "numeric",
                    })}
                  </td>
                  <td className="us-td ">
                    <div className="us-actions ">

                      <button
                       className="us-btn-delete"
                        onClick={() => {
                          setEditUser(user);
                          setOpenCreate(true);
                        }}
                        title="Edit user"
                      >
                        <FaEdit /> Edit
                      </button>

                      {/* DELETE */}
                      <button
                        className="us-btn-delete"
                        onClick={() => handleDelete(user.id)}
                        disabled={isDeleting}
                        title="Delete user"
                      >
                        <FaTrash />
                        {isDeleting ? "Deleting…" : "Delete"}
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── PAGINATION ── */}
      <div className="us-pagination">
        <span className="us-page-info">
          Showing {Math.min((page - 1) * PAGE_SIZE + 1, filteredUsers.length)}–
          {Math.min(page * PAGE_SIZE, filteredUsers.length)} of {filteredUsers.length}
        </span>
        <div className="us-page-btns">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={page === p ? "us-page-active" : ""}
              onClick={() => setPage(p)}
            >{p}</button>
          ))}
          <button disabled={page === totalPages || totalPages === 0} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      </div>

      {openCreate && (
        <AdminCreateUser
          onClose={() => {
            setOpenCreate(false);
            setEditUser(null);
          }}
          editUser={editUser} 
        />
      )}
    </div>
  );
};

export default UsersScreen;