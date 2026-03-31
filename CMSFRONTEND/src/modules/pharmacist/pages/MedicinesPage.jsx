import React, { useEffect, useState } from "react";
import PharmacistLayout from "../components/PharmacistLayout";
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "../api/pharmacistApi";

const MedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", unit: "", price: "" });
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMedicines = (q = "") => {
    setLoading(true);
    getMedicines(q)
      .then((res) => setMedicines(res.results || res.data || []))
      .catch(() => setError("Failed to load medicines."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchMedicines(e.target.value);
  };

  const openAdd = () => {
    setEditingMed(null);
    setForm({ name: "", description: "", unit: "", price: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (med) => {
    setEditingMed(med);
    setForm({
      name: med.name,
      description: med.description || "",
      unit: med.unit || "",
      price: med.price,
    });
    setFormError("");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) {
      setFormError("Name and price are required.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      if (editingMed) {
        await updateMedicine(editingMed.medicine_id, form);
        setSuccess("Medicine updated.");
      } else {
        await createMedicine(form);
        setSuccess("Medicine added.");
      }
      setShowModal(false);
      fetchMedicines(search);
    } catch (err) {
      const msg = err?.response?.data ? JSON.stringify(err.response.data) : "Failed to save.";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await deleteMedicine(id);
      setSuccess("Medicine deleted.");
      fetchMedicines(search);
    } catch {
      setError("Failed to delete.");
    }
  };

  return (
    <PharmacistLayout title="Medicines">
      <div className="flex items-center justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Search medicines..."
          value={search}
          onChange={handleSearch}
          className="bg-[#0d1629] border border-[#1e2d4a] text-white text-sm rounded-xl px-4 py-2.5 focus:border-red-400/50 outline-none w-72"
        />
        <button
          onClick={openAdd}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition"
        >
          + Add Medicine
        </button>
      </div>

      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">{success}</div>}

      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Unit</th>
                <th className="px-4 py-3 text-left">Price (₹)</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : medicines.length === 0 ? (
                <tr><td colSpan={5} className="text-center text-gray-500 py-12 text-sm">No medicines found.</td></tr>
              ) : (
                medicines.map((med) => (
                  <tr key={med.medicine_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-white font-medium">{med.name}</td>
                    <td className="px-4 py-3 text-gray-400">{med.unit || "—"}</td>
                    <td className="px-4 py-3 text-red-400 font-semibold">₹{med.price}</td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{med.description || "—"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => openEdit(med)} className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 px-3 py-1 rounded-lg transition">Edit</button>
                      <button onClick={() => handleDelete(med.medicine_id)} className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded-lg transition">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-white font-semibold text-lg mb-4">
              {editingMed ? "Edit Medicine" : "Add Medicine"}
            </h3>
            {formError && <div className="mb-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded-lg">{formError}</div>}
            <div className="space-y-3">
              {[
                { key: "name", label: "Medicine Name", type: "text" },
                { key: "unit", label: "Unit (e.g. tablet, ml)", type: "text" },
                { key: "price", label: "Price (₹)", type: "number" },
                { key: "description", label: "Description", type: "text" },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="text-xs text-gray-400 block mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-[#060d1a] border border-[#1e2d4a] text-white text-sm rounded-lg px-3 py-2 focus:border-red-400/50 outline-none"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-[#1e2d4a] text-gray-400 hover:text-white py-2.5 rounded-xl text-sm transition">Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition">
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </PharmacistLayout>
  );
};

export default MedicinesPage;