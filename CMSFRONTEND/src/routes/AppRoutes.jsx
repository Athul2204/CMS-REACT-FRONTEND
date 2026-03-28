import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";

// Reception
import ReceptionDashboard from "../modules/receptionist/pages/ReceptionDashboard";
import PatientList from "../modules/receptionist/pages/PatientList";
import AddPatient from "../modules/receptionist/pages/AddPatient";
import DoctorAvailability from "../modules/receptionist/pages/DoctorAvailability";
import Appointment from "../modules/receptionist/pages/Appointment";

// ✅ Protected Route Component
const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* 🔐 Reception Routes */}
      <Route
        path="/receptionist"
        element={
          <PrivateRoute roleRequired="receptionist">
            <ReceptionDashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/receptionist/patients"
        element={
          <PrivateRoute roleRequired="receptionist">
            <PatientList />
          </PrivateRoute>
        }
      />

      <Route
        path="/receptionist/add-patient"
        element={
          <PrivateRoute roleRequired="receptionist">
            <AddPatient />
          </PrivateRoute>
        }
      />

      <Route
        path="/receptionist/availability"
        element={
          <PrivateRoute roleRequired="receptionist">
            <DoctorAvailability />
          </PrivateRoute>
        }
      />

      <Route
        path="/receptionist/appointments"
        element={
          <PrivateRoute roleRequired="receptionist">
            <Appointment />
          </PrivateRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;