// frontend/src/services/api.js
import axios from "axios";

const API = axios.create({
  // Backend runs on HTTP port 5000 - make sure this matches your backend
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach JWT automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      // Optionally redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;