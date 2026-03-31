// import ReceptionDashboard from "./pages/ReceptionDashboard";
// import PatientsPage from "./pages/PatientsPage";
// import AppointmentsPage from "./pages/AppointmentsPage";
// import BillingPage from "./pages/BillingPage";

// const receptionRoutes = [
//   { path: "/reception/dashboard",    element: <ReceptionDashboard /> },
//   { path: "/reception/patients",     element: <PatientsPage /> },
//   { path: "/reception/appointments", element: <AppointmentsPage /> },
//   { path: "/reception/billing",      element: <BillingPage /> },
// ];

// export default receptionRoutes;
import ReceptionDashboard from "./pages/ReceptionDashboard";
import PatientsPage from "./pages/PatientsPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import BillingPage from "./pages/BillingPage";

const receptionRoutes = [
  { path: "/reception/dashboard", element: <ReceptionDashboard /> },
  { path: "/reception/patients", element: <PatientsPage /> },
  { path: "/reception/appointments", element: <AppointmentsPage /> },
  { path: "/reception/billing", element: <BillingPage /> },
];

export default receptionRoutes;