// frontend/src/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [info, setInfo] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProtected = async () => {
      try {
        const res = await API.get("/protected");
        setInfo(res.data?.message || "Welcome");
      } catch (err) {
        console.error("Protected fetch error:", err);
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
        } else {
          setInfo("Failed to load protected data");
        }
      }
    };

    fetchProtected();
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-text">{info}</p>
    </div>
  );
};

export default Dashboard;
