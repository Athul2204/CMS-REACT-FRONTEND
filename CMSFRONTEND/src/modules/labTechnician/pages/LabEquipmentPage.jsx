import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import {
  getLabEquipment,
  createLabEquipment,
  updateLabEquipment,
  deleteLabEquipment,
} from "../api/labApi";

const STATUS_OPTIONS = ["Available", "Under Maintenance", "Out of Service"];

const statusStyle = (s) => {
  if (s === "Available") return "bg-green-400/10 text-green-400 border-green-400/30";
  if (s === "Under Maintenance") return "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
  return "bg-red-400/10 text-red-400 border-red-400/30";
};

const LabEquipmentPage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  const emptyForm = {
    name: "",
    purchase_date: "",
    last_service_date: "",
    status: "Available",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchEquipment = () => {
    setLoading(true);
    getLabEquipment()
      .then((res) => setEquipment(res.data || []))
      .catch(() => setError("Failed to load equipment."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEquipment(); }, []);

  const openEdit = (eq) => {
    setEditTarget(eq);
    setForm({
      name: eq.name,
      purchase_date: eq.purchase_date,
      last_service_date: eq.last_service_date || "",
      status: eq.status,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const payload = { ...form, last_service_date: form.last_service_date || null };
    try {
      if (editTarget) {
        await updateLabEquipment(editTarget.equipment_id, payload);
        setSuccess("Equipment updated.");
      } else {
        await createLabEquipment(payload);
        setSuccess("Equipment added.");
      }
      cancelForm();
      fetchEquipment();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.name?.[0] ||
        data?.last_service_date?.[0] ||
        data?.non_field_errors?.[0] ||
        "Failed to save equipment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this equipment?")) return;
    try {
      await deleteLabEquipment(id);
      setSuccess("Equipment deleted.");
      fetchEquipment();
    } catch {
      setError("Failed to delete equipment.");
    }
  };

  const filtered =
    filterStatus === "All"
      ? equipment
      : equipment.filter((e) => e.status === filterStatus);

  return (
    <LabLayout title="Lab Equipment">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATUS_OPTIONS.map((s) => (
          <div key={s} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-4">
            <p className={`text-2xl font-bold ${s === "Available" ? "text-green-400" : s === "Under Maintenance" ? "text-yellow-400" : "text-red-400"}`}>
              {equipment.filter((e) => e.status === s).length}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-2">
          {["All", ...STATUS_OPTIONS].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-2 rounded-lg border transition ${
                filterStatus === s
                  ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40"
                  : "text-gray-400 border-[#1e2d4a] hover:border-cyan-400/30"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm && !editTarget ? "Cancel" : "+ Add Equipment"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-400 block mb-1">Equipment Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. Centrifuge"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Purchase Date *</label>
            <input
              type="date"
              required
              value={form.purchase_date}
              onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Last Service Date</label>
            <input
              type="date"
              value={form.last_service_date}
              onChange={(e) => setForm({ ...form, last_service_date: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={cancelForm} className="text-sm text-gray-400 hover:text-white border border-[#1e2d4a] px-4 py-2 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={submitting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-2 rounded-lg transition disabled:opacity-50">
              {submitting ? "Saving…" : editTarget ? "Update" : "Add Equipment"}
            </button>
          </div>
        </form>
      )}

      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">{success}</div>}

      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Purchase Date</th>
                <th className="px-4 py-3 text-left">Last Service</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(6)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-gray-500 py-12 text-sm">No equipment found.</td></tr>
              ) : (
                filtered.map((eq) => (
                  <tr key={eq.equipment_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{eq.equipment_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{eq.name}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded border ${statusStyle(eq.status)}`}>{eq.status}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{eq.purchase_date}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{eq.last_service_date || "—"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(eq)} className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition">Edit</button>
                      <button onClick={() => handleDelete(eq.equipment_id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition">Del</button>
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

export default LabEquipmentPage;