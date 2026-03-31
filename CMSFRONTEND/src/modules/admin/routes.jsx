// // src/modules/admin/routes.jsx
// import AdminDashboard from "./pages/AdminDashboard";
// import StaffManagement from "./pages/StaffManagement";
// import DoctorsManagement from "./pages/DoctorsManagement";
// import ReceptionistsManagement from "./pages/ReceptionistsManagement";
// import LabTechniciansManagement from "./pages/LabTechniciansManagement";
// import PharmacistsManagement from "./pages/PharmacistsManagement";
// import AuditLogs from "./pages/AuditLogs";

// const adminRoutes = [
//   { path: "/admin/dashboard",       element: <AdminDashboard /> },
//   { path: "/admin/staff",           element: <StaffManagement /> },
//   { path: "/admin/doctors",         element: <DoctorsManagement /> },
//   { path: "/admin/receptionists",   element: <ReceptionistsManagement /> },
//   { path: "/admin/lab-technicians", element: <LabTechniciansManagement /> },
//   { path: "/admin/pharmacists",     element: <PharmacistsManagement /> },
//   { path: "/admin/audit-logs",      element: <AuditLogs /> },
// ];

// export default adminRoutes;
import AdminDashboard from "./pages/AdminDashboard";
import StaffManagement from "./pages/StaffManagement";
import DoctorsManagement from "./pages/DoctorsManagement";
import ReceptionistsManagement from "./pages/ReceptionistsManagement";
import LabTechniciansManagement from "./pages/LabTechniciansManagement";
import PharmacistsManagement from "./pages/PharmacistsManagement";
import AuditLogs from "./pages/AuditLogs";

const adminRoutes = [
  { path: "/admin/dashboard",       element: <AdminDashboard /> },
  { path: "/admin/staff",           element: <StaffManagement /> },
  { path: "/admin/doctors",         element: <DoctorsManagement /> },
  { path: "/admin/receptionists",   element: <ReceptionistsManagement /> },
  { path: "/admin/lab-technicians", element: <LabTechniciansManagement /> },
  { path: "/admin/pharmacists",     element: <PharmacistsManagement /> },
  { path: "/admin/audit-logs",      element: <AuditLogs /> },
];

export default adminRoutes;