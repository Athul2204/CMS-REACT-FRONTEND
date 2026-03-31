import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorLayout from "../components/DoctorLayout";
import { getTodayAppointments } from "../api/doctorApi";
import { useAuth } from "../../../context/AuthContext";

const StatCard = ({ label, value, color }) => (
  <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 text-center">
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
  </div>
);

const StatusBadge = ({ status }) => {
  const cls = {
    Scheduled: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    Completed: "bg-green-400/10 text-green-400 border-green-400/30",
    Cancelled: "bg-red-400/10 text-red-400 border-red-400/30",
  }[status] || "bg-gray-400/10 text-gray-400 border-gray-400/30";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded border ${cls}`}>
      {status}
    </span>
  );
};

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTodayAppointments()
      .then((res) => setAppointments(res.data || []))
      .catch(() => setError("Failed to load today's appointments."))
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: appointments.length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    scheduled: appointments.filter((a) => a.status === "Scheduled").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  const doctorName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || "Doctor";

  return (
    <DoctorLayout title="Dashboard">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">
          Welcome, <span className="text-blue-400">Dr. {doctorName}</span> 👨‍⚕️
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
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Today" value={loading ? "—" : stats.total} color="text-white" />
        <StatCard label="Scheduled" value={loading ? "—" : stats.scheduled} color="text-blue-400" />
        <StatCard label="Completed" value={loading ? "—" : stats.completed} color="text-green-400" />
        <StatCard label="Cancelled" value={loading ? "—" : stats.cancelled} color="text-red-400" />
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2d4a]">
          <h3 className="text-sm font-semibold text-white">Today's Patient Queue</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12 text-sm">
                    No appointments scheduled for today.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.appointment_id}
                    className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-blue-400">
                        #{appt.token_number}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-white font-medium">
                          {appt.patient_full_name || appt.patient_name || `Patient #${appt.patient}`}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">
                      {appt.appointment_time}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">
                      {appt.reason}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 py-3">
                      {appt.status !== "Cancelled" && (
                        <button
                          onClick={() =>
                            navigate(`/doctor/consultation/${appt.appointment_id}`)
                          }
                          className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1.5 rounded-lg transition flex items-center gap-1"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                            <rect x="9" y="3" width="6" height="4" rx="1" />
                          </svg>
                          Consult
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
