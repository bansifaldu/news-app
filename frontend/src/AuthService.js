import axios from "./axiosConfig";

class AuthService {
    getToken() {
        return localStorage.getItem("token");
    }

    setToken(token) {
        localStorage.setItem("token", token);
    }

    removeToken() {
        localStorage.removeItem("token");
    }

    isAuthenticated() {
        return !!this.getToken();
    }
    async logout() {
        try {
            await axios.post("/api/logout"); // Assuming your logout route is "/api/logout"
            this.removeToken(); // Clear the token in local storage
        } catch (error) {
            console.error("Failed to log out", error);
            throw error; // Rethrow the error for handling in the calling component
        }
    }
    async getUserInfo() {
        try {
            const response = await fetch("/api/user", {
                headers: {
                    Authorization: `Bearer ${this.getToken()}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch user information");
            }

            const data = await response.json();
            return data.user;
        } catch (error) {
            console.error("Error fetching user information:", error);
            throw error;
        }
    }
}

export default new AuthService();
