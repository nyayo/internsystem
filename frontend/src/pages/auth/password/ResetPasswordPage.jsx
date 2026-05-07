import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import authApi from "../../../services/authApi";
import "../register/RegisterPage.css";

function getErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData?.detail === "string" && responseData.detail.trim()) {
    return responseData.detail.trim();
  }

  if (responseData && typeof responseData === "object") {
    for (const value of Object.values(responseData)) {
      if (Array.isArray(value) && value.length > 0) {
        const first = value[0];
        if (typeof first === "string" && first.trim()) return first.trim();
      }
      if (typeof value === "string" && value.trim()) return value.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const queryToken = useMemo(() => searchParams.get("token") ?? "", [searchParams]);

  const [token, setToken] = useState(queryToken);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token.trim() || !newPassword || !confirmPassword) {
      setError("Token and both password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.resetPassword({
        token: token.trim(),
        newPassword,
        newPassword2: confirmPassword,
      });
      setError("");
      setSuccess(
        response?.detail?.trim() ||
          "Password reset successfully. You can now log in.",
      );
      setNewPassword("");
      setConfirmPassword("");
    } catch (requestError) {
      setSuccess("");
      setError(
        getErrorMessage(
          requestError,
          "Password reset failed. Please request a new reset link.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Reset password</h1>
        <p className="auth-subtitle">
          Enter the reset token from your email and set a new password.
        </p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {success && (
          <p className="auth-success" role="status">
            {success}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="text"
            placeholder="Reset token"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            minLength={8}
            required
          />
          <input
            className="auth-input"
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={8}
            required
          />

          <button className="auth-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="auth-footer">
          Need a token? <Link to="/forgot-password">Request reset email</Link>
        </p>
        <p className="auth-footer">
          Back to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
