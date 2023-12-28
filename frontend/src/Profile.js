import React, { useState, useEffect } from "react";
import axios from "./axiosConfig";
import Header from "./Header";
import AuthService from "./AuthService";
import Select from "react-select";
import { fetchSourceOptions, fetchCategoryOptions, fetchAuthorOptions } from "./utils/api";
import { useToast } from "./ToastProvider";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";

function Profile() {
    const toast = useToast();
    const [user, setUser] = useState({
        name: "",
        email: "",
        sources: [],
        categories: [],
        authors: [],
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [sourceOptions, setSourceOptions] = useState([]);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [authorOptions, setAuthorOptions] = useState([]);
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");

    useEffect(() => {
        setLoading(true);
        const fetchSourceData = async () => {
            try {
                const options = await fetchSourceOptions();
                const formattedOptions = options.map((source) => ({ value: source, label: source }));
                setSourceOptions(formattedOptions);
            } catch (error) {
                console.error("Failed to fetch data", error);
            }
        };

        const fetchCategoryData = async () => {
            try {
                const options = await fetchCategoryOptions();
                const formattedOptions = options.map((category) => ({ value: category, label: category }));
                setCategoryOptions(formattedOptions);
            } catch (error) {
                console.error("Failed to fetch category data", error);
            }
        };
        const fetchAuthorData = async () => {
            try {
                const options = await fetchAuthorOptions();
                const formattedOptions = options.map((author) => ({ value: author, label: author }));
                setAuthorOptions(formattedOptions);
            } catch (error) {
                console.error("Failed to fetch author data", error);
            }
        };
        const fetchUserData = async () => {

            try {
                const response = await axios.get("/api/user", {
                    headers: {
                        Authorization: `Bearer ${AuthService.getToken()}`,
                    },
                });

                const formattedUserSources = response.data.sources.map((source) => ({
                    value: source,
                    label: source,
                }));

                const formattedUserCategories = response.data.categories.map((category) => ({
                    value: category,
                    label: category,
                }));
                const formattedUserAuthors = response.data.authors.map((author) => ({
                    value: author,
                    label: author,
                }));

                setUser({
                    ...response.data.user,
                    sources: formattedUserSources,
                    categories: formattedUserCategories,
                    authors: formattedUserAuthors,
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchSourceData();
        fetchCategoryData();
        fetchAuthorData();
        fetchUserData();

    }, []);


    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });

    };

    const handleSourcesChange = (selectedOptions) => {
        setUser({
            ...user,
            sources: selectedOptions,
        });
    };
    const handleCategoriesChange = (selectedOptions) => {
        setUser({
            ...user,
            categories: selectedOptions,
        });
    };
    const handleAuthorsChange = (selectedOptions) => {
        setUser({
            ...user,
            authors: selectedOptions,
        });
    };
   
     
    const handleValidation = () => {
        let isValid = true;

        if (!user.name.trim()) {
            setNameError("Name is required.");
            isValid = false;
        } else {
            setNameError("");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!user.email.trim() && !emailRegex.test(user.email)) {
            setEmailError("Email is required.");
            isValid = false;
        } else {
            setEmailError("");
        }


        return isValid;
    };
    const handleSave = async () => {
        if (!handleValidation()) {
            return;
        }
        try {
            const selectedSourceNames = user.sources.map((source) => source.value);
            const selectedCategoryNames = user.categories.map((category) => category.value);
            const selectedAuthorNames = user.authors.map((author) => author.value);

            const userDataWithSources = {
                ...user,
                sources: selectedSourceNames,
                categories: selectedCategoryNames,
                authors: selectedAuthorNames,
            };

            await axios.put("/api/user", userDataWithSources, {
                headers: {
                    Authorization: `Bearer ${AuthService.getToken()}`,
                },
            });
            toast.showSuccessToast("Profile updated successfully!");

        } catch (error) {

            toast.showErrorToast("Failed to update profile. Please try again later.");

        }
    };
    const homagePage = () => {
        navigate("/news-feed");
    };
    return (
        <div>
            <Header />
            <h2 className="section-title profile-title">User Profile</h2>
            {loading && <Loader />}
            <div className="profile-container">
                <div className="form-box">
                    <div className="form-field">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={user.name}
                            onChange={handleInputChange}
                        />
                        {nameError && <span className="error-message">{nameError}</span>}

                    </div>
                    <div className="form-field">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                        />
                        {emailError && <span className="error-message">{emailError}</span>}

                    </div>
                    <div className="form-field">
                        <label>Sources:</label>
                        <Select
                            options={sourceOptions}
                            isMulti
                            value={user.sources}
                            onChange={handleSourcesChange}
                        />
                    </div>
                    <div className="form-field mt-5">
                        <label>Categories:</label>
                        <Select
                            options={categoryOptions}
                            isMulti
                            value={user.categories}
                            onChange={handleCategoriesChange}
                        />
                    </div>
                    <div className="form-field mt-5">
                        <label>Authors:</label>
                        <Select
                            options={authorOptions}
                            isMulti
                            value={user.authors}
                            onChange={handleAuthorsChange}
                        />
                    </div>
                    <button className="mt-5" onClick={handleSave}>
                        Update
                    </button>
                    <button className="mt-5 ml-5 back-btn" onClick={homagePage}>
                        Back
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
