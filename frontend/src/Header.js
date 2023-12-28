import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "./AuthService";

function Header() {
    const navigate = useNavigate();
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // Fetch user information 
        const fetchUserInfo = async () => {
            try {
                const user = await AuthService.getUserInfo();
                setUserName(user.name);
            } catch (error) {
                console.error("Failed to fetch user information", error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        AuthService.logout();
        navigate("/login");
    };

    const handleProfile = () => {
        navigate("/profile");
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
    };
    const capitalizeFirstLetter = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };
    return (
        <div className="header">
            <a href="/news-feed" className="header-link">
                <div className="header-left">

                    <img src="\images\logo.jpg" alt="Company Logo" className="logo" />
                    <h1>News App</h1>

                </div>
            </a>
            <div className="header-right">
                {userName && <div className="user-info">Welcome,  {capitalizeFirstLetter(userName)}!</div>}
                <div className="profile-icon" onClick={toggleDropdown}>
                    <img src="\images\profile.jpg" alt="Profile Icon" />
                </div>
                {dropdownVisible && (
                    <div className="dropdown" onBlur={closeDropdown}>
                        <button className="dropdown-item" onClick={handleProfile}>
                            Profile
                        </button>
                        <button className="dropdown-item" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Header;
