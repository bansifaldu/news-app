import React, { useState } from "react";
import axios from "./axiosConfig";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ToastProvider";

function Registration() {
    const toast = useToast();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const handleValidation = () => {
        let isValid = true;

        if (!name.trim()) {
            setNameError("Name is required.");
            isValid = false;
        } else {
            setNameError("");
        }

        if (!email.trim()) {
            setEmailError("Email is required.");
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password.trim()) {
            setPasswordError("Password is required.");
            isValid = false;
        } else if (password.trim().length < 8) {
            setPasswordError("Password should be at least 8 characters.");
            isValid = false;
        } else {
            setPasswordError("");
        }

        return isValid;
    };

    const handleRegistration = async () => {
        if (!handleValidation()) {
            return;
        }

        try {
            const response = await axios.post("/api/register", {
                name,
                email,
                password,
            });
            console.log(response.data);

            navigate("/login");
            toast.showSuccessToast("Registration successful! Please log in.");
        } catch (error) {
            toast.showErrorToast("Registration failed!");
        }
    };

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Registration</h2>
                <div className="input-container">
                    <input
                        type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <p className="error-message">{nameError}</p>
                </div>
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
                <button className="registerBtn" onClick={handleRegistration}>
                    Register
                </button>
                <p className="login-link" onClick={handleLogin}>
                    Already have an account? Login here.
                </p>
            </div>
        </div>
    );
}

export default Registration;
