// import DoctorDashboard from "./pages/DoctorDashboard";
// import ConsultationPage from "./pages/ConsultationPage";

// const doctorRoutes = [
//   { path: "/doctor/dashboard",                        element: <DoctorDashboard /> },
//   { path: "/doctor/consultation/:appointmentId",      element: <ConsultationPage /> },
// ];

// export default doctorRoutes;
// import DoctorDashboard from "./pages/DoctorDashboard";
// import ConsultationPage from "./pages/ConsultationPage";

// const doctorRoutes = [
//   { path: "/doctor/dashboard",                        element: <DoctorDashboard /> },
//   { path: "/doctor/consultation/:appointmentId",      element: <ConsultationPage /> },
// ];

// export default doctorRoutes;

import DoctorDashboard from "./pages/DoctorDashboard";
import ConsultationPage from "./pages/ConsultationPage";
import CreateConsultationPage from "./pages/CreateConsultationPage";
import CreateLabRequestPage from "./pages/CreateLabRequestPage";
import PrescriptionCreatePage from "./pages/PrescriptionCreatePage";
const doctorRoutes = [
  {
    path: "/doctor/dashboard",
    element: <DoctorDashboard />,
  },
  {
    path: "/doctor/consultation/create/:appointmentId",
    element: <CreateConsultationPage />,
  },
  {
    path: "/doctor/consultation/:appointmentId",
    element: <ConsultationPage />,
  },

{
  path: "/doctor/lab-request/:appointmentId",
  element: <CreateLabRequestPage />,
},
{
  path: "/doctor/prescription/:appointmentId",
  element: <PrescriptionCreatePage />,
}
];

export default doctorRoutes;