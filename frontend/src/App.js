import React from 'react';
import { Route, Navigate, Routes, BrowserRouter as Router } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import NewsFeed from './NewsFeed';
import './css/AuthForm.css';
import ToastProvider from "./ToastProvider";
const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const PrivateRoute = ({ element, path }) => {
    return isAuthenticated() ? (
        element
    ) : (
        <Navigate to="/login" state={{ from: path }} replace />
    );
};

function App() {
    return (
        <Router>
            <ToastProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile"
                        element={<PrivateRoute element={<Profile />} path="/profile" />}
                    />
                    <Route
                        path="/news-feed"
                        element={<PrivateRoute element={<NewsFeed />} path="/news-feed" />}
                    />
                </Routes>
            </ToastProvider>
        </Router>
    );
}

export default App;
