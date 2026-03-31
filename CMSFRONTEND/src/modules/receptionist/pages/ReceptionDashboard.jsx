import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReceptionLayout from "../components/ReceptionLayout";
import { useAuth } from "../../../context/AuthContext";
import { getPatients, getAppointmentsByDate } from "../api/receptionApi";

const StatCard = ({ label, value, color, icon }) => (
  <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 flex items-center gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-3xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  </div>
);

const ReceptionDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [totalPatients, setTotalPatients] = useState(0);
  const [todayStats, setTodayStats] = useState({ total: 0, scheduled: 0, completed: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    Promise.all([getPatients(), getAppointmentsByDate(today)])
      .then(([patients, appts]) => {
        setTotalPatients(patients.count || 0);
        const data = appts.data || [];
        setTodayStats({
          total: appts.count || 0,
          scheduled: data.filter((a) => a.status === "Scheduled").length,
          completed: data.filter((a) => a.status === "Completed").length,
          cancelled: data.filter((a) => a.status === "Cancelled").length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const quickActions = [
    {
      label: "Register New Patient",
      desc: "Add a patient to the system",
      color: "bg-emerald-500/20 border-emerald-500/30 hover:bg-emerald-500/30",
      textColor: "text-emerald-300",
      onClick: () => navigate("/reception/patients?action=add"),
      icon: "➕",
    },
    {
      label: "Book Appointment",
      desc: "Schedule doctor visit",
      color: "bg-blue-500/20 border-blue-500/30 hover:bg-blue-500/30",
      textColor: "text-blue-300",
      onClick: () => navigate("/reception/appointments?action=book"),
      icon: "📅",
    },
    {
      label: "View Patients",
      desc: "Browse all registered patients",
      color: "bg-purple-500/20 border-purple-500/30 hover:bg-purple-500/30",
      textColor: "text-purple-300",
      onClick: () => navigate("/reception/patients"),
      icon: "👥",
    },
    {
      label: "Billing",
      desc: "Manage consultation bills",
      color: "bg-yellow-500/20 border-yellow-500/30 hover:bg-yellow-500/30",
      textColor: "text-yellow-300",
      onClick: () => navigate("/reception/billing"),
      icon: "💰",
    },
  ];

  return (
    <ReceptionLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Welcome,{" "}
          <span className="text-emerald-400">
            {user?.first_name
              ? `${user.first_name} ${user.last_name || ""}`.trim()
              : user?.username || "Receptionist"}
          </span>
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 h-24" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Patients" value={totalPatients} color="bg-emerald-400/10 text-emerald-400" icon="👥" />
          <StatCard label="Today's Appointments" value={todayStats.total} color="bg-blue-400/10 text-blue-400" icon="📅" />
          <StatCard label="Completed" value={todayStats.completed} color="bg-green-400/10 text-green-400" icon="✅" />
          <StatCard label="Cancelled" value={todayStats.cancelled} color="bg-red-400/10 text-red-400" icon="❌" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`border rounded-xl p-5 text-left transition-all cursor-pointer ${action.color}`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <p className={`font-semibold text-sm ${action.textColor}`}>{action.label}</p>
              <p className="text-gray-500 text-xs mt-1">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default ReceptionDashboard;
