// frontend/src/components/Layout.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div className="nav-left">
          <Link to="/" className="nav-logo">
            SecureBlog
          </Link>
          <Link to="/" className="nav-link">
            Home
          </Link>
          {!isLoggedIn && (
            <>
              <Link to="/register" className="nav-link">
                Register
              </Link>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </>
          )}
          {isLoggedIn && (
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
          )}
        </div>

        <div className="nav-right">
          {isLoggedIn && (
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          )}
        </div>
      </nav>

      <main className="main-content">{children}</main>

      <footer className="footer">© {new Date().getFullYear()} SecureBlog</footer>
    </div>
  );
};

export default Layout;
