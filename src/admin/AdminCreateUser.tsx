import { useState } from "react";
import { useCreateUser } from "../hooks/useUsers";
import "./styles/admin-create-user.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface Props {
  onClose: () => void;
}

const AdminCreateUser: React.FC<Props> = ({ onClose }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "admin",
    password: "",
  });


  const currentUser = useSelector((state: RootState) => state.auth.user);
  

  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useCreateUser(onClose);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔥 Validation
  const validate = () => {
    const newErrors: any = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      newErrors.mobile = "Mobile must be exactly 10 digits";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      name: form.name,
      email: form.email,
      mobile_number: form.mobile,
      password: form.password,
      roleId :currentUser?.Roles?.[0]?.id,
      roleName: form.role,
    };

    mutate(payload);
  };

   console.log("user",currentUser?.Roles?.[0]?.id)
  return (
    <div className="create-user-overlay">
      <div className="create-user-card">
        <div className="create-user-header">
          <h2>Create New User</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
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
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Mobile */}
          <div className="form-field">
            <label>Mobile</label>
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

          {/* Role */}
          <div className="form-field">
            <label>Role</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
              <option value="guest">Guest</option>
            </select>
          </div>

        </div>

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