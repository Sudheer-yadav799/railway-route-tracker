import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../hooks/useAuth";
import "../styles/auth.css";
import { userService } from "../services/user_service";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Props = {
  onLogin?: () => void;
};

type Errors = {
  username?: string;
  email?: string;
  mobile?: string;
  password?: string;
};

const Auth: React.FC<Props> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- VALIDATION ---------------- */

  const validate = (): boolean => {
    const newErrors: Errors = {};

    // LOGIN VALIDATION
    if (!formData.username.trim()) {
      newErrors.username = "Mobile number or Email is required";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    // REGISTER VALIDATION
    if (isRegister) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      }

      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be exactly 10 digits";
      }

      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    // Validate user_id format (email or mobile)
    if (formData.username) {
      const value = formData.username.trim();

      const isOnlyNumbers = /^[0-9]+$/.test(value);
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (isOnlyNumbers) {
        if (value.length !== 10) {
          newErrors.username = "Mobile number must be exactly 10 digits";
        }
      } else {
        if (!emailRegex.test(value)) {
          newErrors.username = "Enter valid email address";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Clear error while typing
    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      if (isRegister) {
        await registerMutation.mutateAsync(formData);
        alert("Registration successful. Please login.");
        setIsRegister(false);
      } else {
        /* ---------- 1. LOGIN ---------- */
        const loginRes = await loginMutation.mutateAsync({
          user_id: formData.username,
          password: formData.password,
        });

        if (!loginRes?.token) {
          throw new Error("Login failed. No token received.");
        }
        localStorage.setItem("token", loginRes.token);

        const userId = loginRes.userId;

        if (!userId) {
          throw new Error("User ID not found in login response.");
        }

        const userDetails = await userService.getUserById(userId);

        /* ---------- 4. STORE USER DATA ---------- */
        localStorage.setItem("userId", userDetails.id);
        localStorage.setItem("userData", JSON.stringify(userDetails));

        /* ---------- 5. NAVIGATE ---------- */
        onLogin?.();
        navigate("/map");
      }
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    }
  };


  return (
    <div className="auth-page">
      <div className="auth-overlay"></div>

      <div className="auth-card">
        <h2 className="auth-title">
          {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
        </h2>

        {/* Username */}
        <div className="form-group">
          <label className="form-label">MobileNumber / Email</label>
          <input
            name="username"
            type="text"
            placeholder="Enter mobile or email"
            className="form-input"
            value={formData.username}
            onChange={(e) => {
              let value = e.target.value;
              if (/^[0-9]*$/.test(value)) {
                value = value.slice(0, 10);
                setFormData({ ...formData, username: value });
              } else {
                // Otherwise allow email typing
                setFormData({ ...formData, username: value });
              }

              setErrors({ ...errors, username: "" });
            }}
          />
          {errors.username && (
            <p className="error-text">{errors.username}</p>
          )}
        </div>

        {/* Register Fields */}
        {isRegister && (
          <>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                placeholder="Enter email"
                className="form-input"
                onChange={handleChange}
              />
              {errors.email && (
                <p className="error-text">{errors.email}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Mobile</label>
              <input
                name="mobile"
                type="tel"
                placeholder="Enter mobile"
                className="form-input"
                onChange={handleChange}
              />
              {errors.mobile && (
                <p className="error-text">{errors.mobile}</p>
              )}
            </div>
          </>
        )}

        {/* Password */}
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
          disabled={loginMutation.isPending || registerMutation.isPending}
        >
          {loginMutation.isPending || registerMutation.isPending
            ? "Please wait..."
            : isRegister
              ? "Register"
              : "Login"}
        </button>

        <div className="switch-text">
          {isRegister
            ? "Already have an account?"
            : "Don't have an account?"}{" "}
          <span
            className="switch-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setErrors({});
            }}
          >
            {isRegister ? "Login" : "Register"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Auth;
