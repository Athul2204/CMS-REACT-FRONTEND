import { Routes, Route } from "react-router-dom";

import ReceptionDashboard from "./pages/ReceptionDashboard";
import PatientList from "./pages/PatientList";
import AddPatient from "./pages/AddPatient";
import DoctorAvailability from "./pages/DoctorAvailability";

const ReceptionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ReceptionDashboard />} />
      <Route path="patients" element={<PatientList />} />
      <Route path="add-patient" element={<AddPatient />} />
      <Route path="availability" element={<DoctorAvailability />} />
    </Routes>
  );
};

export default ReceptionRoutes;