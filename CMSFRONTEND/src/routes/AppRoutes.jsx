// src/routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage    from "../pages/LandingPage";
import Login          from "../pages/Login";
import Unauthorized   from "../pages/Unauthorized";
import ProtectedRoute from "./ProtectedRoute";

import adminRoutes      from "../modules/admin/routes";
import doctorRoutes     from "../modules/doctor/routes";
import receptionRoutes  from "../modules/receptionist/routes";
import pharmacistRoutes from "../modules/pharmacist/routes";
import labRoutes        from "../modules/labTechnician/routes";

// Role strings must exactly match what Django's CustomTokenObtainPairSerializer
// returns — all lowercase, no spaces:
//   admin | doctor | receptionist | pharmacist | labtechnician

const MODULE_ROUTES = [
  { role: "admin",         routes: adminRoutes },
  { role: "doctor",        routes: doctorRoutes },
  { role: "receptionist",  routes: receptionRoutes },
  { role: "pharmacist",    routes: pharmacistRoutes },
  { role: "labtechnician", routes: labRoutes },
];

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"             element={<LandingPage />} />
      <Route path="/login"        element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Role-isolated module routes */}
      {MODULE_ROUTES.flatMap(({ role, routes }) =>
        routes.map((route, i) => (
          <Route
            key={`${role}-${i}`}
            path={route.path}
            element={
              <ProtectedRoute allowedRole={role}>
                {route.element}
              </ProtectedRoute>
            }
          />
        ))
      )}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;