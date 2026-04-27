import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import authApi from "../../../services/authApi";
import "../register/RegisterPage.css";

function getErrorMessage(error) {
  const responseData = error?.response?.data;

  if (typeof responseData?.detail === "string" && responseData.detail.trim()) {
    return responseData.detail.trim();
  }

  if (responseData && typeof responseData === "object") {
    const tokenError = responseData.token;
    if (Array.isArray(tokenError) && tokenError.length > 0) {
      const firstItem = tokenError[0];
      if (typeof firstItem === "string" && firstItem.trim()) {
        return firstItem.trim();
      }
    }
    if (typeof tokenError === "string" && tokenError.trim()) {
      return tokenError.trim();
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return "Verification failed. Please request a new verification email.";
}

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const token = searchParams.get("token");

    async function verify() {
      if (!token) {
        if (active) {
          setError("Verification token is missing from the link.");
        }
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        if (!active) {
          return;
        }

        navigate("/email-confirmed", {
          replace: true,
          state: {
            detail: response?.detail,
            emailVerified: true,
          },
        });
      } catch (verificationError) {
        if (active) {
          setError(getErrorMessage(verificationError));
        }
      }
    }

    verify();

    return () => {
      active = false;
    };
  }, [navigate, searchParams]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Verifying your email</h1>
        <p className="auth-subtitle">Please wait while we confirm your account.</p>

        {error ? (
          <>
            <p className="auth-error" role="alert">
              {error}
            </p>
            <p className="auth-footer">
              <Link to="/register">Go back to registration</Link>
            </p>
          </>
        ) : (
          <p className="auth-success" role="status">
            Verifying...
          </p>
        )}
      </div>
    </div>
  );
}
