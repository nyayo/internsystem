import { useState } from "react";
import { Link } from "react-router-dom";
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.forgotPassword(email.trim());
      setError("");
      setSuccess(
        response?.detail?.trim() || "Password reset email has been sent.",
      );
    } catch (requestError) {
      setSuccess("");
      setError(
        getErrorMessage(
          requestError,
          "Unable to send reset email right now. Please try again.",
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
        <h1 className="auth-title">Forgot password</h1>
        <p className="auth-subtitle">
          Enter your email and we&apos;ll send a password reset link.
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
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button className="auth-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="auth-footer">
          Already have a reset token? <Link to="/reset-password">Reset password</Link>
        </p>
        <p className="auth-footer">
          Back to <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
