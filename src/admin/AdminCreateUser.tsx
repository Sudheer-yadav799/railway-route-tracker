import { useState } from "react";
import { useCreateUser } from "../hooks/useUsers";
import "./styles/admin-create-user.css";
import { FaEye, FaEyeSlash, FaUserShield, FaUser, FaLink, FaUserFriends } from "react-icons/fa";

interface Props {
  onClose: () => void;
}

const roles = [
  { id: 1, name: "admin", label: "Admin", icon: <FaUserShield /> },
  { id: 2, name: "customer", label: "Customer", icon: <FaUser /> },
  { id: 3, name: "guest", label: "Guest", icon: <FaUserFriends /> },
];

const AdminCreateUser: React.FC<Props> = ({ onClose }) => {a
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "customer",
    password: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useCreateUser(onClose);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(form.mobile))
      newErrors.mobile = "Mobile must be 10 digits";

    if (!form.password.trim()) newErrors.password = "Password required";
    else if (form.password.length < 6)
      newErrors.password = "Min 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const selectedRole = roles.find((r) => r.name === form.role);

    const payload = {
      name: form.name,
      email: form.email,
      mobile_number: form.mobile,
      password: form.password,
      roleId: selectedRole?.id,
      roleName: selectedRole?.name,
    };

    mutate(payload);
  };

  return (
    <div className="create-user-overlay">
      <div className="create-user-card">

        {/* Header */}
        <div className="create-user-header">
          <h2>Create New User</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="form-grid">

          {/* Name */}
          <div className="form-field">
            <label>Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="form-field">
            <label>Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div className="form-field">
            <label>Mobile Number</label>
            <input
              name="mobile"
              maxLength={10}
              value={form.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <p className="error-text">{errors.mobile}</p>}
          </div>

          {/* Password */}
          <div className="form-field">
            <label>Password</label>

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}
          </div>

          {/* Role Selector */}
          <div className="form-field role-field">
            <label>Assign Role</label>

            <div className="role-selector">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`role-card ${
                    form.role === role.name ? "active" : ""
                  }`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, role: role.name }))
                  }
                >
                  <div className="role-icon">{role.icon}</div>
                  <span>{role.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="form-actions">
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>

          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create User"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AdminCreateUser;