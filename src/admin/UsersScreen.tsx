import { useState, useMemo } from "react";
import { useDeleteUser, useGetUsers } from "../hooks/useUsers";
import AdminCreateUser from "./AdminCreateUser";
import "../styles/user-account.css";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const PAGE_SIZE = 5;

const UsersScreen = () => {
    const { data: users = [], isLoading } = useGetUsers();

    const [openCreate, setOpenCreate] = useState(false);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [sortField, setSortField] = useState("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [page, setPage] = useState(1);

 const currentUser = localStorage.getItem('userId')

 console.log()

    // 🔎 FILTER + SEARCH
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
                (user: any) =>
                    user.Roles?.[0]?.name?.toLowerCase() === roleFilter
            );
        }

        result.sort((a: any, b: any) => {
            const aValue = a[sortField] || "";
            const bValue = b[sortField] || "";

            if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
            if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
            return 0;
        });

        return result;
    }, [users, search, roleFilter, sortField, sortOrder]);

    const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE);
    const paginatedUsers = filteredUsers.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };



const { mutate: deleteUser, isPending: isDeleting } =
  useDeleteUser();

const handleDelete = (id: number) => {
  console.log("Deleting user:", id);
  console.log("Current user:", currentUser);

  if (!currentUser) {
    console.log("No current user ID");
    return;
  }

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this user?"
  );

  if (!confirmDelete) return;

  deleteUser({
    id,
    deletedById: currentUser,
  });
};

    return (
        <div className="users-page">

            {/* TOP BAR */}
            <div className="users-topbar">
                <div>
                    <h2 className="page-title">Users</h2>
                    <p className="page-subtitle">Manage all system users</p>
                </div>

                <button
                    className="btn-primary"
                    onClick={() => setOpenCreate(true)}
                >
                    + New User
                </button>
            </div>

            {/* FILTER CARD */}
            <div className="card filter-card">
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    className="role-select"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="customer">Customer</option>
                    <option value="guest">Guest</option>
                </select>
            </div>

            {/* TABLE CARD */}
            <div className="card table-card">

                <div className="table-header">
                    <div onClick={() => handleSort("name")}>Name</div>
                    <div>Email</div>
                    <div>Mobile</div>
                    <div>Role</div>
                    <div>Status</div>
                    <div>Created</div>
                    <div>Actions</div>
                </div>

                {isLoading ? (
                    <div className="table-loader">
                        Loading users...
                    </div>
                ) : (
                    paginatedUsers.map((user: any) => (
                        <div key={user.id} className="table-row">

                            <div className="user-info">
                                <div className="avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="user-name">{user.name}</div>
                                </div>
                            </div>

                            <div className="user-email-small">{user.email}</div>
                            <div className="user-name">{user.mobile_number}</div>

                            <div>
                                <span className="role-badge">
                                    {user.Roles?.[0]?.name || "No Role"}
                                </span>
                            </div>

                            <div>
                                <span className={`status-badge ${user.is_active ? "active" : "inactive"}`}>
                                    {user.is_active ? "Active" : "Inactive"}
                                </span>
                            </div>

                            <div className="user-email-small">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </div>

                            <div>
                                <button
                                    className="btn-danger-sm"
                                    onClick={() => handleDelete(user.id)}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </button>
                            </div>

                        </div>
                    ))
                )}

            </div>

            {/* PAGINATION */}
            <div className="pagination">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>

            {openCreate && (
                <AdminCreateUser onClose={() => setOpenCreate(false)} />
            )}
        </div>
    );
};

export default UsersScreen;