

import { useState } from "react";
import "./Register.css";

export default function Register() {
  const [formData, setFoamData] = useState({
    fullName:"",
    email:"",
    phone:"",
    password:"",
    confirmPassword:"",
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
    alert("Registration Successful🎉");
  };

  return(
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

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
        placeholder="Email"
        onChange={handleChange}
        required
        />

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

        

        <button type="submit">Sign Up</button>

        
      </form>
    </div>
  );
}

