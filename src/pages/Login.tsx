import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/useAuth";
import "../styles/auth.css";
import { userService } from "../services/user_service";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/slices/authSlice";

import companyLogo from "../assets/images/logo.jpeg";

type Props = { onLogin?: () => void };
type Errors = { username?: string; email?: string; mobile?: string; password?: string };

const Auth: React.FC<Props> = ({ onLogin }) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: ""
  });

  const [errors, setErrors] = useState<Errors>({});

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const validate = (): boolean => {

    const e: Errors = {};

    if (!formData.username.trim()) e.username = "Mobile number or Email is required";
    if (!formData.password.trim()) e.password = "Password is required";

    if (isRegister) {
      if (!formData.email.trim()) e.email = "Email is required";
      if (!formData.mobile.trim()) e.mobile = "Mobile number is required";
      if (formData.password.length < 6) e.password = "Password must be at least 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {

    if (!validate()) return;

    try {

      if (isRegister) {

        await registerMutation.mutateAsync(formData);
        setIsRegister(false);

      } else {

        const loginRes = await loginMutation.mutateAsync({
          user_id: formData.username,
          password: formData.password
        });

        if (!loginRes?.token) throw new Error("Login failed");

        localStorage.setItem("token", loginRes.token);

        const userDetails = await userService.getUserById(loginRes.userId);

        const user = userDetails.data;

        dispatch(setCredentials({
          user,
          token: loginRes.token
        }));
        localStorage.setItem("userId", loginRes.userId);
        localStorage.setItem("userData", JSON.stringify(user));
        localStorage.setItem(
          "projectIds",
          JSON.stringify(userDetails.data.projectIds)
        );

        onLogin?.();

        navigate("/map");

      }

    } catch (error: any) {

      console.error(error.message || "Something went wrong");

    }

  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (

    <div className="auth-page">

      <div className="map-grid"></div>
      <div className="railway-lines"></div>
      <div className="auth-bg"></div>

      {/* LEFT PANEL */}

      <div className="auth-brand-strip">

        <div className="auth-brand-company">

          <img
            src={companyLogo}
            alt="Dharani Geospatial Technologies"
            className="company-logo-img"
          />

          <div>

            <div className="auth-company-name">
              Dharani Geospatial Technologies
            </div>

            <div className="auth-company-tagline">
              Precision · Scale · Intelligence
            </div>

          </div>

        </div>

        <div className="auth-brand-hero">

          <div className="auth-brand-title">
            Railway Route<br />
            Infrastructure<br />
            Monitor
          </div>

          <div className="auth-brand-sub">
            Real-time GIS track system, layer management and infrastructure monitoring for the Indian Railway network.
          </div>

        </div>

        <div className="auth-brand-footer">
          Powered by <span>Dharani Geospatial Technologies</span>
        </div>

      </div>

      {/* RIGHT LOGIN */}

      <div className="auth-right">

        <div className="auth-card">

          <div className="auth-card-header">

            <img
              src={companyLogo}
              alt="Company Logo"
              className="auth-card-logo"
            />

            <div className="auth-card-company-name">
              DHARANI GEOSPATIAL TECHNOLOGIES
            </div>

            <h2 className="auth-title">
              {isRegister ? "Create Account" : "Sign In"}
            </h2>

            <p className="auth-title-sub">
              {isRegister ? "Fill details to register" : "Enter your credentials to continue"}
            </p>

          </div>

          <div className="form-group">

            <label className="form-label">
              Mobile Number / Email
            </label>

            <input
              name="username"
              type="text"
              placeholder="Enter mobile or email"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
            />

            {errors.username && (
              <p className="error-text">{errors.username}</p>
            )}

          </div>

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

              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>

            </div>

            {errors.password && (
              <p className="error-text">{errors.password}</p>
            )}

          </div>

          <button
            className="auth-button"
            onClick={handleSubmit}
            disabled={isPending}
          >

            {isPending ? "Signing in..." : "Sign In"}

          </button>

          <div className="auth-divider">or</div>

          <div className="switch-text">

            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"
            }

            <span
              className="switch-btn"
              onClick={() => setIsRegister(!isRegister)}
            >

              {isRegister ? " Sign In" : " Register"}

            </span>

          </div>

        </div>
      </div>
    </div>
  );

};

export default Auth;