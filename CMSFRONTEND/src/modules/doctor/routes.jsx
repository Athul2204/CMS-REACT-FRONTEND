
import DoctorDashboard from "./pages/DoctorDashboard";
import ConsultationPage from "./pages/ConsultationPage";

const doctorRoutes = [
  {
    path: "/doctor/dashboard",
    element: <DoctorDashboard />,
  },
  {
    path: "/doctor/consultation/:appointmentId",
    element: <ConsultationPage />,
  },
];

export default doctorRoutes;


