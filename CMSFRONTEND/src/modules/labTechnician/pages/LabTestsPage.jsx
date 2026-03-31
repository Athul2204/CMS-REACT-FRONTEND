import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { getLabTests, createLabTest, updateLabTest, deleteLabTest } from "../api/labApi";

const LabTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const emptyForm = { test_name: "", description: "", cost: "", normal_range: "", unit: "" };
  const [form, setForm] = useState(emptyForm);

  const fetchTests = () => {
    setLoading(true);
    getLabTests()
      .then((res) => setTests(res.data || []))
      .catch(() => setError("Failed to load lab tests."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTests(); }, []);

  const openEdit = (test) => {
    setEditTarget(test);
    setForm({
      test_name: test.test_name,
      description: test.description || "",
      cost: test.cost,
      normal_range: test.normal_range || "",
      unit: test.unit || "",
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
        await updateLabTest(editTarget.test_id, form);
        setSuccess("Lab test updated.");
      } else {
        await createLabTest(form);
        setSuccess("Lab test created.");
      }
      cancelForm();
      fetchTests();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.test_name?.[0] || data?.cost?.[0] || data?.non_field_errors?.[0] || "Failed to save."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lab test?")) return;
    try {
      await deleteLabTest(id);
      setSuccess("Lab test deleted.");
      fetchTests();
    } catch {
      setError("Failed to delete lab test.");
    }
  };

  const filtered = tests.filter((t) =>
    t.test_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <LabLayout title="Lab Tests Catalogue">
      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tests…"
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 w-60"
        />
        <button
          onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm && !editTarget ? "Cancel" : "+ Add Test"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-400 block mb-1">Test Name *</label>
            <input
              type="text"
              required
              value={form.test_name}
              onChange={(e) => setForm({ ...form, test_name: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. Complete Blood Count"
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
              placeholder="e.g. 250.00"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Normal Range</label>
            <input
              type="text"
              value={form.normal_range}
              onChange={(e) => setForm({ ...form, normal_range: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 4.5–11.0 × 10⁹/L"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Unit</label>
            <input
              type="text"
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. mg/dL"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-gray-400 block mb-1">Description</label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 resize-none"
              placeholder="Optional description…"
            />
          </div>
          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelForm}
              className="text-sm text-gray-400 hover:text-white border border-[#1e2d4a] px-4 py-2 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-2 rounded-lg transition disabled:opacity-50"
            >
              {submitting ? "Saving…" : editTarget ? "Update Test" : "Add Test"}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">{success}</div>
      )}

      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Test Name</th>
                <th className="px-4 py-3 text-left">Cost</th>
                <th className="px-4 py-3 text-left">Normal Range</th>
                <th className="px-4 py-3 text-left">Unit</th>
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
                    No lab tests found.
                  </td>
                </tr>
              ) : (
                filtered.map((test) => (
                  <tr key={test.test_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{test.test_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{test.test_name}</td>
                    <td className="px-4 py-3 text-cyan-400 font-semibold">₹{test.cost}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{test.normal_range || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{test.unit || "—"}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(test)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(test.test_id)}
                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Del
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

export default LabTestsPage;