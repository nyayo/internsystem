import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import {
  REGISTER_ROLE_OPTIONS,
  REGISTRATION_FIELDS_BY_ROLE,
  getRegistrationFieldsForRole,
} from "../../../auth/authConfig";
import { useAuth } from "../../../context/AuthContext";

const ALL_ROLE_FIELD_NAMES = [
  ...new Set(
    Object.values(REGISTRATION_FIELDS_BY_ROLE)
      .flat()
      .map((field) => field.name),
  ),
];

const buildInitialState = () =>
  ALL_ROLE_FIELD_NAMES.reduce(
    (accumulator, fieldName) => ({
      ...accumulator,
      [fieldName]: "",
    }),
    {
      role: "student",
      password: "",
      confirmPassword: "",
    },
  );

function getErrorMessage(error, fallbackMessage) {
  const responseData = error?.response?.data;

  if (typeof responseData === "string" && responseData.trim()) {
    return responseData.trim();
  }

  if (responseData && typeof responseData === "object") {
    if (typeof responseData.detail === "string" && responseData.detail.trim()) {
      return responseData.detail.trim();
    }

    for (const value of Object.values(responseData)) {
      if (Array.isArray(value) && value.length > 0) {
        const firstItem = value[0];
        if (typeof firstItem === "string" && firstItem.trim()) {
          return firstItem.trim();
        }
      }

      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }
  }

  if (typeof error?.message === "string" && error.message.trim()) {
    return error.message.trim();
  }

  return fallbackMessage;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    ...buildInitialState(),
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const roleFields = getRegistrationFieldsForRole(formData.role);
    const registrationPayload = roleFields.reduce(
      (accumulator, field) => ({
        ...accumulator,
        [field.name]: formData[field.name],
      }),
      {
        role: formData.role,
        password: formData.password,
        password2: formData.confirmPassword,
      },
    );

    setIsSubmitting(true);

    try {
      const registerResponse = await register(registrationPayload);
      console.log(registerResponse)
      setError("");
      navigate("/register/check-email", {
        replace: true,
        state: {
          detail:
            registerResponse?.detail ??
            "Account created. Please check your email to verify your account.",
          email: registerResponse?.email ?? formData.email,
          role: registerResponse?.role ?? formData.role,
        },
      });
    } catch (registrationError) {
      setError(
        getErrorMessage(
          registrationError,
          "Registration failed. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldsToRender = getRegistrationFieldsForRole(formData.role);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <p className="auth-kicker">Internship Portal</p>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">Register to get started</p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label" htmlFor="register-role">
            Register as
          </label>
          <select
            className="auth-input"
            id="register-role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            {REGISTER_ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {fieldsToRender.map((field) => {
            if (field.type === "select") {
              return (
                <div key={field.name}>
                  <label className="auth-label" htmlFor={`register-${field.name}`}>
                    {field.label}
                  </label>
                  <select
                    className="auth-input"
                    id={`register-${field.name}`}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }

            return (
              <div key={field.name}>
                <label className="auth-label" htmlFor={`register-${field.name}`}>
                  {field.label}
                </label>
                <input
                  className="auth-input"
                  id={`register-${field.name}`}
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={formData[field.name]}
                  onChange={handleChange}
                  min={field.min}
                  max={field.max}
                  required
                />
              </div>
            );
          })}

          <input
            className="auth-input"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <input
            className="auth-input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
