// frontend/src/Pages/Login.jsx
import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isStrongPassword } from "../utils/validators";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password) {
      setMessage("Email and password are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Invalid email format.");
      return;
    }
    if (!isStrongPassword(password)) {
      setMessage("Password must be at least 8 characters and include letters and numbers.");
      return;
    }

    setLoading(true);
    try {
      const response = await API.post("/auth/login", { email, password });
      if (response?.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        setMessage("Login failed");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Invalid credentials";
      setMessage(msg);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Login</h2>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleLogin} className="form">
        <input
          className="form-input"
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="form-btn" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
