// frontend/src/Pages/Logout.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    navigate("/");
  }, [navigate]);

  return <p style={{ textAlign: "center", marginTop: "2rem" }}>Logging out...</p>;
};

export default Logout;
