import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { useAuth } from "../../../context/AuthContext";
import { getLabOrders, getLabTests, getLabBills, getLabEquipment } from "../api/labApi";
import { useNavigate } from "react-router-dom";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-3xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
      <span className={`text-xl ${color} opacity-60`}>{icon}</span>
    </div>
  </div>
);

const LabDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [tests, setTests] = useState([]);
  const [bills, setBills] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      getLabOrders(),
      getLabTests(),
      getLabBills(),
      getLabEquipment(),
    ])
      .then(([oRes, tRes, bRes, eRes]) => {
        setOrders(oRes.data || []);
        setTests(tRes.data || []);
        setBills(bRes.data || []);
        setEquipment(eRes.data || []);
      })
      .catch(() => setError("Failed to load dashboard data."))
      .finally(() => setLoading(false));
  }, []);

  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;
  const availableEquipment = equipment.filter((e) => e.status === "Available").length;

  const name = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Lab Technician";

  return (
    <LabLayout title="Dashboard">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Welcome, <span className="text-cyan-400">{name}</span> 🔬
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Pending Orders" value={loading ? "—" : pendingOrders} color="text-yellow-400" icon="🧪" />
        <StatCard label="Completed Orders" value={loading ? "—" : completedOrders} color="text-cyan-400" icon="✅" />
        <StatCard label="Lab Tests Catalogue" value={loading ? "—" : tests.length} color="text-purple-400" icon="📋" />
        <StatCard label="Active Equipment" value={loading ? "—" : availableEquipment} color="text-green-400" icon="⚙️" />
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Pending Lab Orders Table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Pending Lab Orders</h3>
          <button onClick={() => navigate("/labtechnician/orders")} className="text-xs text-cyan-400 hover:text-cyan-300 transition">
            View all →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Order No.</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.filter((o) => o.status === "Pending").length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center text-gray-500 py-10 text-sm">
                    No pending lab orders.
                  </td>
                </tr>
              ) : (
                orders
                  .filter((o) => o.status === "Pending")
                  .slice(0, 5)
                  .map((order) => (
                    <tr key={order.order_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {order.patient_name || `Patient #${order.patient}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => navigate("/labtechnician/results")}
                          className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition"
                        >
                          Enter Results
                        </button>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "View All Orders", path: "/labtechnician/orders", icon: "📋" },
          { label: "Enter Results", path: "/labtechnician/results", icon: "🔬" },
          { label: "Lab Tests Catalogue", path: "/labtechnician/tests", icon: "🧫" },
          { label: "Billing", path: "/labtechnician/billing", icon: "🧾" },
          { label: "Equipment", path: "/labtechnician/equipment", icon: "⚙️" },
          { label: "Maintenance", path: "/labtechnician/maintenance", icon: "🔧" },
        ].map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="bg-[#0d1629] border border-[#1e2d4a] hover:border-cyan-400/40 rounded-xl p-5 text-left transition-all"
          >
            <p className="text-2xl mb-2">{item.icon}</p>
            <p className="text-white font-medium text-sm">{item.label}</p>
          </button>
        ))}
      </div>
    </LabLayout>
  );
};

export default LabDashboard;