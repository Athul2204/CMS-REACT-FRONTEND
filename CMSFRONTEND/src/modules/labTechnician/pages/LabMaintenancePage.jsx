import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import {
  getLabMaintenance,
  createLabMaintenance,
  updateLabMaintenance,
  deleteLabMaintenance,
  getLabEquipment,
} from "../api/labApi";

const LabMaintenancePage = () => {
  const [records, setRecords] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    equipment: "",
    service_date: "",
    technician_name: "",
    remarks: "",
    cost: "",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getLabMaintenance(), getLabEquipment()])
      .then(([mRes, eRes]) => {
        setRecords(mRes.data || []);
        setEquipment(eRes.data || []);
      })
      .catch(() => setError("Failed to load maintenance data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openEdit = (rec) => {
    setEditTarget(rec);
    setForm({
      equipment: rec.equipment,
      service_date: rec.service_date,
      technician_name: rec.technician_name,
      remarks: rec.remarks || "",
      cost: rec.cost,
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
    try {
      if (editTarget) {
        await updateLabMaintenance(editTarget.maintenance_id, form);
        setSuccess("Record updated.");
      } else {
        await createLabMaintenance(form);
        setSuccess("Maintenance record added.");
      }
      cancelForm();
      fetchAll();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.service_date?.[0] ||
        data?.cost?.[0] ||
        data?.technician_name?.[0] ||
        data?.non_field_errors?.[0] ||
        "Failed to save record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this maintenance record?")) return;
    try {
      await deleteLabMaintenance(id);
      setSuccess("Record deleted.");
      fetchAll();
    } catch {
      setError("Failed to delete record.");
    }
  };

  const totalMaintenanceCost = records.reduce(
    (sum, r) => sum + parseFloat(r.cost || 0),
    0
  );

  return (
    <LabLayout title="Equipment Maintenance">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-cyan-400">{records.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Records</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-orange-400">₹{totalMaintenanceCost.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Maintenance Cost</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-yellow-400">
            {equipment.filter((e) => e.status === "Under Maintenance").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Under Maintenance</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm && !editTarget ? "Cancel" : "+ Add Record"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-400 block mb-1">Equipment *</label>
            <select
              required
              value={form.equipment}
              onChange={(e) => setForm({ ...form, equipment: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select equipment…</option>
              {equipment.map((eq) => (
                <option key={eq.equipment_id} value={eq.equipment_id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Service Date *</label>
            <input
              type="date"
              required
              value={form.service_date}
              onChange={(e) => setForm({ ...form, service_date: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Technician Name *</label>
            <input
              type="text"
              required
              value={form.technician_name}
              onChange={(e) => setForm({ ...form, technician_name: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="Technician full name"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Cost (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.cost}
              onChange={(e) => setForm({ ...form, cost: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 1500.00"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 block mb-1">Remarks</label>
            <textarea
              rows={2}
              value={form.remarks}
              onChange={(e) => setForm({ ...form, remarks: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="Optional remarks…"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={cancelForm} className="text-sm text-gray-400 hover:text-white border border-[#1e2d4a] px-4 py-2 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={submitting} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-2 rounded-lg transition disabled:opacity-50">
              {submitting ? "Saving…" : editTarget ? "Update Record" : "Add Record"}
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
                <th className="px-4 py-3 text-left">Equipment</th>
                <th className="px-4 py-3 text-left">Service Date</th>
                <th className="px-4 py-3 text-left">Technician</th>
                <th className="px-4 py-3 text-left">Cost</th>
                <th className="px-4 py-3 text-left">Remarks</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : records.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-gray-500 py-12 text-sm">No maintenance records found.</td></tr>
              ) : (
                records.map((rec) => (
                  <tr key={rec.maintenance_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{rec.maintenance_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{rec.equipment_name || `Equipment #${rec.equipment}`}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{rec.service_date}</td>
                    <td className="px-4 py-3 text-gray-300">{rec.technician_name}</td>
                    <td className="px-4 py-3 text-cyan-400 font-semibold">₹{rec.cost}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[140px] truncate">{rec.remarks || "—"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(rec)} className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition">Edit</button>
                      <button onClick={() => handleDelete(rec.maintenance_id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition">Del</button>
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

export default LabMaintenancePage;