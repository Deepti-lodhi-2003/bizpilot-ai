import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Auth.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await loginUser({
        email,
        password,
      });

      localStorage.setItem("token", response.token);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-logo">
          <div className="auth-logo-icon">
            <i className="bi bi-bar-chart-fill"></i>
          </div>

          <span>BizPilot AI</span>
        </div>

        {/* Heading */}
        <div className="auth-heading">
          <div className="eyebrow">WELCOME BACK</div>

          <h1>Sign in to BizPilot</h1>

          <p>
            Continue managing your business smarter.
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
          onSubmit={handleLogin}
        >

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                required
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

          {/* Options */}
          <div className="login-options">

            <label className="remember">
              <input type="checkbox" />
              Remember me
            </label>

            <a
              href="#"
              className="forgot-link"
              onClick={(e) =>
                e.preventDefault()
              }
            >
              Forgot password?
            </a>

          </div>

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

                Signing in...
              </>
            ) : (
              <>
                Sign In
                <i className="bi bi-arrow-right"></i>
              </>
            )}
          </button>

        </form>

        {/* Register */}
        <div className="auth-switch">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={() =>
              navigate("/register")
            }
          >
            Create account
          </button>
        </div>

      </div>
    </div>
  );
};

export default Login;