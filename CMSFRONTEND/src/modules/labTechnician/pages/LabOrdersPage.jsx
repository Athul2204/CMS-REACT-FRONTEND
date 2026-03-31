import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { getLabOrders, createLabOrder, deleteLabOrder } from "../api/labApi";

const LabOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState({ lab_request: "", patient: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchOrders = () => {
    setLoading(true);
    getLabOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setError("Failed to load lab orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await createLabOrder(form);
      setSuccess("Lab order created successfully.");
      setShowForm(false);
      setForm({ lab_request: "", patient: "" });
      fetchOrders();
    } catch (err) {
      setError(err?.response?.data?.non_field_errors?.[0] || "Failed to create lab order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      await deleteLabOrder(id);
      setSuccess("Order deleted.");
      fetchOrders();
    } catch {
      setError("Failed to delete order.");
    }
  };

  const filtered = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <LabLayout title="Lab Orders">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {["All", "Pending", "Completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-lg border transition ${
                filter === f
                  ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40"
                  : "text-gray-400 border-[#1e2d4a] hover:border-cyan-400/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm ? "Cancel" : "+ New Order"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Lab Request ID</label>
            <input
              type="number"
              required
              value={form.lab_request}
              onChange={(e) => setForm({ ...form, lab_request: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 1"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Patient ID</label>
            <input
              type="number"
              required
              value={form.patient}
              onChange={(e) => setForm({ ...form, patient: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 3"
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create Order"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Order No.</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Lab Request</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Created</th>
                <th className="px-4 py-3 text-left">Actions</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12 text-sm">
                    No lab orders found.
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.order_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                        {order.order_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {order.patient_name || `Patient #${order.patient}`}
                    </td>
                    <td className="px-4 py-3 text-gray-400">#{order.lab_request}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          order.status === "Completed"
                            ? "bg-green-400/10 text-green-400 border-green-400/30"
                            : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(order.order_id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LabLayout>
  );
};

export default LabOrdersPage;