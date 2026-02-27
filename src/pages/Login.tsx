import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/useAuth";
import "../styles/auth.css";
import { userService } from "../services/user_service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = { onLogin?: () => void };
type Errors = { username?: string; email?: string; mobile?: string; password?: string };

const Auth: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ username: "", email: "", mobile: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  /* ── Validation (unchanged logic) ── */
  const validate = (): boolean => {
    const e: Errors = {};
    if (!formData.username.trim()) e.username = "Mobile number or Email is required";
    if (!formData.password.trim()) e.password = "Password is required";
    if (isRegister) {
      if (!formData.email.trim()) e.email = "Email is required";
      if (!formData.mobile.trim()) e.mobile = "Mobile number is required";
      else if (!/^[0-9]{10}$/.test(formData.mobile)) e.mobile = "Mobile number must be exactly 10 digits";
      if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    }
    if (formData.username) {
      const v = formData.username.trim();
      if (/^[0-9]+$/.test(v)) { if (v.length !== 10) e.username = "Mobile number must be exactly 10 digits"; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) e.username = "Enter valid email address";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  /* ── Submit (unchanged logic) ── */
  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (isRegister) {
        await registerMutation.mutateAsync(formData);
        alert("Registration successful. Please login.");
        setIsRegister(false);
      } else {
        const loginRes = await loginMutation.mutateAsync({ user_id: formData.username, password: formData.password });
        if (!loginRes?.token) throw new Error("Login failed. No token received.");
        localStorage.setItem("token", loginRes.token);
        const userId = loginRes.userId;
        if (!userId) throw new Error("User ID not found in login response.");
        const userDetails = await userService.getUserById(userId);
        localStorage.setItem("userId", userDetails.id);
        localStorage.setItem("userData", JSON.stringify(userDetails));
        onLogin?.();
        navigate("/map");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="auth-page">
      {/* ── Left brand strip (desktop) ── */}
      <div className="auth-brand-strip">
        <div className="auth-brand-logo">🚆</div>
        <div className="auth-brand-title">Railway Route<br />Infrastructure<br />Monitor</div>
        <div className="auth-brand-sub">
          Real-time GIS tracking, layer management, and infrastructure monitoring
          for the Indian Railway network.
        </div>
        <div className="auth-brand-tag">Ministry of Railways</div>
      </div>

      {/* ── Right form area ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card-logo">🚆</div>

          <h2 className="auth-title">{isRegister ? "CREATE ACCOUNT" : "SIGN IN"}</h2>
          <p className="auth-title-sub">
            {isRegister ? "Fill in details to register" : "Enter your credentials to continue"}
          </p>

          {/* ── Mobile / Email ── */}
          <div className="form-group">
            <label className="form-label">Mobile Number / Email</label>
            <input
              name="username" type="text"
              placeholder="Enter mobile or email"
              className="form-input"
              value={formData.username}
              onChange={(e) => {
                let value = e.target.value;
                if (/^[0-9]*$/.test(value)) value = value.slice(0, 10);
                setFormData({ ...formData, username: value });
                setErrors({ ...errors, username: "" });
              }}
            />
            {errors.username && <p className="error-text">{errors.username}</p>}
          </div>

          {/* ── Register extra fields ── */}
          {isRegister && (
            <>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input name="email" type="email" placeholder="Enter email" className="form-input" onChange={handleChange} />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label className="form-label">Mobile</label>
                <input name="mobile" type="tel" placeholder="Enter mobile" className="form-input" onChange={handleChange} />
                {errors.mobile && <p className="error-text">{errors.mobile}</p>}
              </div>
            </>
          )}

          {/* ── Password ── */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                className="form-input"
                onChange={handleChange}
              />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <button className="auth-button" onClick={handleSubmit} disabled={isPending}>
            {isPending ? <><span className="auth-spinner" />{isRegister ? "Registering..." : "Signing in..."}</> : isRegister ? "Create Account" : "Sign In"}
          </button>

          <div className="auth-divider">or</div>

          <div className="switch-text">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <span className="switch-btn" onClick={() => { setIsRegister(!isRegister); setErrors({}); }}>
              {isRegister ? " Sign In" : " Register"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
