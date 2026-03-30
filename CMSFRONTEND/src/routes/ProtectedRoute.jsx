import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { token, user } = useAuth();

  // ❌ Not logged in (both missing)
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // ⏳ User loading (prevent flicker)
  if (!user) {
    return null; // or spinner
  }

  // ❌ Role mismatch
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Allowed
  return children;
};

export default ProtectedRoute;