import { Routes, Route } from "react-router-dom";
import Home from "../pages/LandingPage";
import Login from "../pages/Login";
import ProtectedRoute from "./ProtectedRoute";

import doctorRoutes from "../modules/doctor/routes";
import LandingPage from "../pages/LandingPage";
import receptionistRoutes from "../modules/receptionist/routes";
import pharmacistRoutes from "../modules/pharmacist/routes";
import adminRoutes from "../modules/admin/routes";
import labRoutes from "../modules/labTechnician/routes";
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
      {receptionistRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute allowedRole="receptionist">
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}

      {pharmacistRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute allowedRole="pharmacist">
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}

      {adminRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute allowedRole="admin">
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}

      {labRoutes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={
            <ProtectedRoute allowedRole="labtechnician">
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}

      
    </Routes>
  );
}

export default AppRoutes;
