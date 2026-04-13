import { useState } from "react";
import "./LoginPage.css";


function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please fill in all the fields.");
            return;

        };
        setError("");
        console.log("Logging in:", {email, password});
    
}
    return (
    <div className="login-container">
        <h1 className="login-title">Welcome</h1>
        <p className="login-substitle">Sign in to your account</p>

        {error && <p className="login-error">{error}</p>}

        <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>setEmail(e.target.value)}
        />
        <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
            Login
        </button>

        <p> className="login-footer"
            Don't have an account? <a> href="/registerSign up</a>
        </p>

    </div>
    );
 }



 
export default LoginPage;
