import { Link, useLocation } from "react-router-dom";
import "../register/RegisterPage.css";

export default function EmailConfirmedPage() {
  const location = useLocation();
  const state = location.state ?? {};
  const detail =
    typeof state.detail === "string" && state.detail.trim()
      ? state.detail.trim()
      : "Email verified successfully. You can now log in.";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Email confirmed</h1>
        <p className="auth-success" role="status">
          {detail}
        </p>

        <p className="auth-footer">
          <Link to="/login" state={{ emailVerified: true }}>
            Continue to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
