import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "./Auth.css";

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await registerUser({
        name,
        email,
        password,
      });

      navigate("/login");
    } catch (error) {
      console.error("Register error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card register-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="bi bi-bar-chart-fill"></i>
          </div>

          <span>BizPilot AI</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <div className="eyebrow">
            GET STARTED
          </div>

          <h1>Create your account</h1>

          <p>
            Start managing your business smarter.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth-error">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        <form
          className="auth-form"
          onSubmit={handleRegister}
        >

          {/* Name */}
          <div className="auth-field">
            <label>Full name</label>

            <div className="auth-input-wrapper">
              <i className="bi bi-person"></i>

              <input
                type="text"
                className="auth-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="auth-field">
            <label>Email address</label>

            <div className="auth-input-wrapper">
              <i className="bi bi-envelope"></i>

              <input
                type="email"
                className="auth-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Password</label>

            <div className="auth-input-wrapper">
              <i className="bi bi-lock"></i>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className="auth-input"
                placeholder="Create a password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
                minLength={6}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                <i
                  className={
                    showPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <label>Confirm password</label>

            <div className="auth-input-wrapper">
              <i className="bi bi-shield-lock"></i>

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className="auth-input"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
                minLength={6}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                <i
                  className={
                    showConfirmPassword
                      ? "bi bi-eye-slash"
                      : "bi bi-eye"
                  }
                ></i>
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="auth-terms">
            <input type="checkbox" required />

            <span>
              I agree to the{" "}
              <a
                href="#"
                onClick={(e) =>
                  e.preventDefault()
                }
              >
                Terms & Conditions
              </a>
            </span>
          </label>

          {/* Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                ></span>

                Creating account...
              </>
            ) : (
              <>
                Create Account
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>

        </form>

        {/* Login */}
        <div className="auth-switch">
          Already have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Sign in
          </button>
        </div>

      </div>

    </div>
  );
};

export default Register;