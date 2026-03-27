import { Routes, Route } from "react-router-dom";
import Home from "../pages/LandingPage";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import doctorRoutes from "../modules/doctor/routes";
import LandingPage from "../pages/LandingPage";

function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />

      {/* 🔥 Doctor Module Routes */}
      {doctorRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute allowedRole="doctor">
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}

    </Routes>
  );
}

export default AppRoutes;