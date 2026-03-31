import React from "react";
import LabDashboard from "./pages/LabDashboard";
import LabOrdersPage from "./pages/LabOrdersPage";
import LabResultsPage from "./pages/LabResultsPage";
import LabTestsPage from "./pages/LabTestsPage";
import LabBillingPage from "./pages/LabBillingPage";
import LabEquipmentPage from "./pages/LabEquipmentPage";
import LabMaintenancePage from "./pages/LabMaintenancePage";

const labRoutes = [
  { path: "/labtechnician/dashboard", element: <LabDashboard /> },
  { path: "/labtechnician/orders", element: <LabOrdersPage /> },
  { path: "/labtechnician/results", element: <LabResultsPage /> },
  { path: "/labtechnician/tests", element: <LabTestsPage /> },
  { path: "/labtechnician/billing", element: <LabBillingPage /> },
  { path: "/labtechnician/equipment", element: <LabEquipmentPage /> },
  { path: "/labtechnician/maintenance", element: <LabMaintenancePage /> },
];

export default labRoutes; 