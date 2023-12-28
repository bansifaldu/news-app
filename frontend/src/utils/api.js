// utils/api.js
import axios from "../axiosConfig";
import AuthService from "../AuthService";

const fetchSourceOptions = async () => {
  try {
    const response = await axios.get("/api/sources", {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });
    return response.data.sourceName;
  } catch (error) {
    console.error("Failed to fetch source options", error);
    throw error;
  }
};

const fetchCategoryOptions = async () => {
  try {
    const response = await axios.get("/api/categories", {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });
    return response.data.categories;
  } catch (error) {
    console.error("Failed to fetch category options", error);
    throw error;
  }
};

const fetchAuthorOptions = async () => {
    try {
      const response = await axios.get("/api/authors", {
        headers: {
          Authorization: `Bearer ${AuthService.getToken()}`,
        },
      });
      return response.data.authors;
    } catch (error) {
      console.error("Failed to fetch authors options", error);
      throw error;
    }
  };

export { fetchSourceOptions, fetchCategoryOptions, fetchAuthorOptions };
