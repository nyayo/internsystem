import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import {
  REGISTER_ROLE_OPTIONS,
  REGISTRATION_FIELDS_BY_ROLE,
  getRegistrationFieldsForRole,
} from "../../../auth/authConfig";
// import { useAuth } from "../../../context/AuthContext";

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

export default function RegisterPage() {
  const navigate = useNavigate();
  // const { register } = useAuth();
  const [formData, setFormData] = useState({
    ...buildInitialState(),
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
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
      },
    );

    try {
      register(registrationPayload);
      setError("");
      navigate("/login", {
        replace: true,
        state: {
          registered: true,
          email: formData.email,
          role: formData.role,
        },
      });
    } catch (registrationError) {
      setError(registrationError.message);
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

          <button className="auth-btn" type="submit">
            Register
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
