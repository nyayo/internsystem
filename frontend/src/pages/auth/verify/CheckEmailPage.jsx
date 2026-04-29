import { Link, useLocation } from "react-router-dom";
import "../register/RegisterPage.css";

export default function CheckEmailPage() {
  const location = useLocation();
  const state = location.state ?? {};
  const email = typeof state.email === "string" ? state.email : "";
  const role = typeof state.role === "string" ? state.role : "student";
  const detail =
    typeof state.detail === "string" && state.detail.trim()
      ? state.detail.trim()
      : "Account created. Please check your email to verify your account.";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-subtitle">{detail}</p>

        {email && (
          <p className="auth-success" role="status">
            Verification email sent to <strong>{email}</strong>.
          </p>
        )}

        <p className="auth-footer">
          Already verified?{" "}
          <Link
            to="/login"
            state={{ email, role, awaitingVerification: true }}
          >
            Go to sign in
          </Link>
        </p>

        <p className="auth-footer">
          Didn&apos;t receive the email? <Link to="/register">Register again</Link>
        </p>
      </div>
    </div>
  );
}
