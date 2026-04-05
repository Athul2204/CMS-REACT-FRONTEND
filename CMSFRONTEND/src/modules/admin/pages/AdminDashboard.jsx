// src/modules/admin/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import StatsCards from "../components/StatsCards";
import { getDashboardStats } from "../api/adminApi";

const ACTION_COLORS = {
  CREATE:     "text-green-300 bg-green-400/10",
  UPDATE:     "text-blue-300 bg-blue-400/10",
  DELETE:     "text-red-300 bg-red-400/10",
  LOGIN:      "text-yellow-300 bg-yellow-400/10",
  LOGOUT:     "text-gray-300 bg-gray-400/10",
  REACTIVATE: "text-purple-300 bg-purple-400/10",
};

// FIX 3: Dashboard was wrapped in an extra <div> with a background image
// that nested AdminLayout inside two layout containers — causing the page
// to lose its sidebar and scroll context. Removed the outer wrapper;
// AdminLayout already handles the full-page layout.
//
// FIX 3b: AuditRow now reads log.user__username (the key the backend
// returns for recent_audit_logs via .values()) and falls back to log.user
// which is the username string the AuditLogSerializer now returns.
const AuditRow = ({ log }) => {
  const cls = ACTION_COLORS[log.action] || "text-gray-300 bg-gray-400/10";
  // Backend returns user__username in the dashboard values() query
  const username = log.user__username || log.user || "system";

  return (
    <tr className="border-b border-[#1e2d4a] hover:bg-[#101b33] transition">
      <td className="px-4 py-3 text-gray-200 text-sm">{username}</td>
      <td className="px-4 py-3">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${cls}`}>
          {log.action}
        </span>
      </td>
      <td className="px-4 py-3 text-gray-300 text-sm">{log.module}</td>
      <td className="px-4 py-3 text-gray-400 text-xs">
        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
      </td>
    </tr>
  );
};

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(() => setError("Failed to load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  const recentLogs = stats.recent_audit_logs || [];

  return (
    <AdminLayout title="Dashboard">
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mr-3" />
          Loading dashboard...
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
          {error}
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <StatsCards stats={stats} />

          {/* Recent Audit Logs */}
          <div className="mt-8 bg-[#0b1220]/80 backdrop-blur-md border border-[#1e2d4a] rounded-2xl overflow-hidden shadow-lg">
            <div className="px-6 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recent Activity</h2>
              <a href="/admin/audit-logs" className="text-xs text-[#38bdf8] hover:underline">
                View all →
              </a>
            </div>

            {recentLogs.length === 0 ? (
              <p className="text-center text-gray-400 py-10 text-sm">No recent activity</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs uppercase tracking-wider bg-[#0f172a]">
                      <th className="px-4 py-3 text-left">User</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">Module</th>
                      <th className="px-4 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log, i) => (
                      <AuditRow key={log.log_id ?? i} log={log} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;