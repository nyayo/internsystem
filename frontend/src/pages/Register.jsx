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
      [e.target.name]:
    })
  }
}