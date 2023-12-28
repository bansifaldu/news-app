import React, { createContext, useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const ToastProvider = ({ children }) => {
    const toastConfig = {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    };

    const showToast = (message, options = {}) => {
        toast(message, { ...toastConfig, ...options });
    };

    const showSuccessToast = (message, options = {}) => {
        showToast(message, { type: "success", ...options, style: { background: "green", color: "#fff" } });
    };

    const showErrorToast = (message, options = {}) => {
        showToast(message, { type: "error", ...options, style: { background: "red", color: "#fff" } });
    };

    return (
        <ToastContext.Provider value={{ showToast, showSuccessToast, showErrorToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

export default ToastProvider;
