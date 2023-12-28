import React from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
};

const RedirectToNewsFeed = () => {
    return isAuthenticated() ? <Navigate to="/news-feed" replace /> : <Navigate to="/login" />;
};

export default RedirectToNewsFeed;
