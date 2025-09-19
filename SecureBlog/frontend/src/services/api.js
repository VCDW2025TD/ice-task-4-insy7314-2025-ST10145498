// frontend/src/services/api.js
import axios from "axios";

/**
 * Use this single axios instance everywhere.
 * If you want to override the backend host in dev, set VITE_BACKEND_URL in .env
 */
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const API = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
  
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { API };
export default API;
