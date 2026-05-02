import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { LOGIN_ROLE_OPTIONS } from "../../../auth/authConfig";
import { useAuth } from "../../../context/AuthContext";

function getErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  if (responseData && typeof responseData === "object") {
    if (typeof responseData.detail === "string" && responseData.detail.trim()) {
      return responseData.detail.trim();
    }
    if (typeof responseData.message === "string" && responseData.message.trim()) {
      return responseData.message.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, getRoleHomePath } = useAuth();
  const registrationState = location.state ?? {};

  const [role, setRole] = useState(registrationState.role ?? "student");
  const [email, setEmail] = useState(registrationState.email ?? "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const sessionUser = await login({ role, email, password });
      setError("");
      navigate(getRoleHomePath(sessionUser.role), { replace: true });
    } catch (loginError) {
      setError(getErrorMessage(loginError, "Login failed. Please try again."));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue</p>
        {registrationState.registered && (
          <p className="auth-success">Registration successful. You can now sign in.</p>
        )}
        {registrationState.awaitingVerification && (
          <p className="auth-success">
            Account created. Check your email and verify your account before signing in.
          </p>
        )}
        {registrationState.emailVerified && (
          <p className="auth-success">
            Email verified successfully. You can now sign in.
          </p>
        )}

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <select
            className="auth-input"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {LOGIN_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            className="auth-input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          <button className="auth-btn" type="submit">
            Sign in
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
