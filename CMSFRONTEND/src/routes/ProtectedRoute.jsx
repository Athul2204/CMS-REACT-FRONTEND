// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  // Wait for /api/auth/me/ to resolve before making any redirect decision.
  // Without this, every page refresh kicks authenticated users to /login.
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontSize: "14px",
          color: "#6b7280",
        }}
      >
        Loading...
      </div>
    );
  }

  // Not authenticated at all
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role.
  // Redirect to /unauthorized — NOT /login — so user knows why they can't enter.
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;