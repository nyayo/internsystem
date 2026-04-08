JSX

import { useState } from "react";

export default function Register() {
  const [formData, setFoamData] = useState({
    fullName:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
    university:"",
    year:"",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    console.log("User Registered;", formData);
    alert("Registration Successful");
  };

  return(
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>
        <p>Apply for internships easily</p>

        {error && <p className="error">{error}</p>}

        <input
        type="text"
        name="fullName"
        placeholder="FullName"
        onChange={handleChange}
        required
        />

        <input
        type="email"
        name="email"
        placeholder="Email Address"
        onChange={handleChange}
        required
        />

        <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        onChange={handleChange}
        />

        <input
        type="text"
        name="university"
        placeholder="University"
        onChange={handleChange}
        />

        <select name="year" onChange={handleChange}>
          <option value="">Year of Study</option>
          <option value="1">Year 1</option>
          <option value="2">Year 2</option>
          <option value="3">Year 3</option>
          <option value="4">Year 4</option>
        </select>

        <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
        />

        <input
        type="password"
        name="confirm Password"
        placeholder="Confirm Password"
        onChange={handleChange}
        required
        />

        <div className="checkbox">
          <input type="checkbox" required />
          <label>l agree to Terms & Conditions</label>
        </div>

        <button type="submit">Sign Up</button>

        <p className="login-text">
          Already have an account? <span>Login</span>
        </p>
      </form>
    </div>
  );
}

