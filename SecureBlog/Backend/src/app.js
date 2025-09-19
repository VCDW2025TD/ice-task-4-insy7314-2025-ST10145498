// frontend/src/services/api.js
import axios from "axios";

const API = axios.create({
  // Backend runs on HTTPS port 5000 - make sure this matches your backend
  baseURL: "https://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT automatically if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;