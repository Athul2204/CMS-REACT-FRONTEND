import PharmacistDashboard from "./pages/PharmacistDashboard";
import { PrescriptionsPage, DispensePage } from "./pages/PrescriptionsPage";
import BillsPage from "./pages/BillsPage";
import MedicinesPage from "./pages/MedicinesPage";
import StockPage from "./pages/StockPage";
import PrintBillPage from "./pages/PrintBillPage";
const pharmacistRoutes = [
  { path: "/pharmacist/dashboard",                          element: <PharmacistDashboard /> },
  { path: "/pharmacist/prescriptions",                      element: <PrescriptionsPage /> },
  { path: "/pharmacist/prescriptions/:prescriptionCode",    element: <DispensePage /> },
  { path: "/pharmacist/bills",                              element: <BillsPage /> },
  { path: "/pharmacist/medicines",                          element: <MedicinesPage /> },
  { path: "/pharmacist/stock",                              element: <StockPage /> },
  { path: "/pharmacist/bills/:billId/print", element: <PrintBillPage /> },
];

export default pharmacistRoutes;