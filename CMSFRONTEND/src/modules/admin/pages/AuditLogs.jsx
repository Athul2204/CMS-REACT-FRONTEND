import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import Pagination from "../components/Pagination";
import { getAuditLogs } from "../api/adminApi";

const ACTION_STYLES = {
  CREATE:     "bg-green-500/10 text-green-400 border-green-500/20",
  UPDATE:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  DELETE:     "bg-red-500/10 text-red-400 border-red-500/20",
  LOGIN:      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  LOGOUT:     "bg-gray-500/10 text-gray-400 border-gray-500/20",
  REACTIVATE: "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

const ACTION_TYPES = ["ALL", "CREATE", "UPDATE", "DELETE", "LOGIN", "LOGOUT", "REACTIVATE"];

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/administration/audit/");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [error, setError] = useState("");

  const fetchLogs = async (url) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAuditLogs(url);
      // Backend returns standard DRF pagination: { count, next, previous, results: [...] }
      setLogs(res.results || []);
      setNext(res.next);
      setPrevious(res.previous);
    } catch {
      setError("Failed to load audit logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(currentUrl); }, [currentUrl]);

  const filtered = filter === "ALL" ? logs : logs.filter((l) => l.action === filter);

  return (
    <AdminLayout title="Audit Logs">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {ACTION_TYPES.map((a) => (
          <button
            key={a}
            onClick={() => setFilter(a)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition ${
              filter === a
                ? "bg-[#38bdf8]/10 text-[#38bdf8] border-[#38bdf8]/30"
                : "bg-transparent text-gray-500 border-[#1e2d4a] hover:text-white"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {loading && logs.length === 0 ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <div className="w-6 h-6 border-2 border-[#38bdf8] border-t-transparent rounded-full animate-spin mr-3" />
          Loading logs...
        </div>
      ) : (
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Log ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-left">Module</th>
                  <th className="px-4 py-3 text-left">Object ID</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2d4a]">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-gray-500 py-12">No logs found</td>
                  </tr>
                ) : (
                  filtered.map((log, i) => {
                    const cls = ACTION_STYLES[log.action] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
                    return (
                      <tr key={log.log_id || i} className="hover:bg-[#060d1a] transition-colors">
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.log_id ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-300">{log.user || "system"}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-md border ${cls}`}>{log.action}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400">{log.module}</td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.object_id ?? "—"}</td>
                        <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{log.description || "—"}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Pagination next={next} previous={previous} loading={loading}
        onNext={() => setCurrentUrl(next)} onPrevious={() => setCurrentUrl(previous)} />
    </AdminLayout>
  );
};

export default AuditLogs;
