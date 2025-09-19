// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Logout from "./Pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute";
import SecurityDemo from "./SecurityDemo"; // optional - include only if you added the file

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<h1 style={{ textAlign: "center" }}>Home</h1>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/logout" element={<Logout />} />
          <Route path="/security-demo" element={<SecurityDemo />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
