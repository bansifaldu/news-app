import React, { useState } from "react";
import axios from "./axiosConfig";
import AuthService from "./AuthService";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastProvider";

function Login() {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();
    const handleValidation = () => {
        let isValid = true;

        if (!email.trim()) {
            setEmailError("Email is required.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password.trim()) {
            setPasswordError("Password is required.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!handleValidation()) {
            return;
        }
        try {
            const response = await axios.post("/api/login", { email, password });
            const token = response.data.token;

            // Store the token in localStorage
            AuthService.setToken(token);
            navigate("/news-feed");
            toast.showSuccessToast("Login successful!");
        } catch (error) {
            toast.showErrorToast("Login failed");
        }
    };
    const handleRegistration = () => {
        navigate("/register");
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Login</h2>
                <div className="input-container">
                    <input
                        type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <p className="error-message">{emailError}</p>
                </div>
                <div className="input-container">
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <p className="error-message">{passwordError}</p>
                </div>
                <button className="loginBtn" onClick={handleLogin}>
                    Login
                </button>
                <p className="register-link" onClick={handleRegistration}>
                    Don't have an account? Register here.
                </p>
            </div>
        </div>
    );
}

export default Login;
