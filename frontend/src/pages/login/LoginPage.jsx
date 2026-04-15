import { useState } from "react";
import "./LoginPage.css";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) {
            setError("Please fill in all the fields.");
            return;

        };
        setError("");
        console.log("Logging in with:", {email, password});

    
}
    return (
    <div className="login-container">
        <form className="login-card"
        onSubmit={handleSubmit}>

        <h2>Internship System</h2>
        <p>Login to continue</p>

        {error && <p className="error message">{error}</p>}

        <input
            
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
        />
        <input
            
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" >
            Login
        </button>

        <div className="login-links">
            <a href="#">Forgot Password?</a>
        </div>
        </form>

    </div>
    );
 }



 
export default LoginPage;
