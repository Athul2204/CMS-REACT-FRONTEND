import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import {
  getLabResults,
  createLabResult,
  updateLabResult,
  deleteLabResult,
  getLabOrderItems,
} from "../api/labApi";

const LabResultsPage = () => {
  const [results, setResults] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    lab_order_item: "",
    result_value: "",
    remarks: "",
    is_critical: false,
  };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getLabResults(), getLabOrderItems()])
      .then(([rRes, iRes]) => {
        setResults(rRes.data || []);
        setOrderItems(iRes.data || []);
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openEdit = (result) => {
    setEditTarget(result);
    setForm({
      lab_order_item: result.lab_order_item,
      result_value: result.result_value,
      remarks: result.remarks || "",
      is_critical: result.is_critical,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      if (editTarget) {
        await updateLabResult(editTarget.result_id, form);
        setSuccess("Result updated successfully.");
      } else {
        await createLabResult(form);
        setSuccess("Result entered successfully.");
      }
      setShowForm(false);
      setEditTarget(null);
      setForm(emptyForm);
      fetchAll();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.result_value?.[0] ||
        data?.lab_order_item?.[0] ||
        data?.non_field_errors?.[0] ||
        "Failed to save result."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await deleteLabResult(id);
      setSuccess("Result deleted.");
      fetchAll();
    } catch {
      setError("Failed to delete result.");
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(emptyForm);
    setError("");
  };

  return (
    <LabLayout title="Lab Results">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400 text-sm">{results.length} result(s) recorded</p>
        <button
          onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm && !editTarget ? "Cancel" : "+ Enter Result"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-400 block mb-1">Order Item</label>
            <select
              required
              value={form.lab_order_item}
              onChange={(e) => setForm({ ...form, lab_order_item: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select order item…</option>
              {orderItems.map((item) => (
                <option key={item.order_item_id} value={item.order_item_id}>
                  #{item.order_item_id} — {item.lab_test_name || `Test #${item.lab_test}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Result Value</label>
            <input
              type="text"
              required
              value={form.result_value}
              onChange={(e) => setForm({ ...form, result_value: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 12.5 g/dL"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_critical"
              checked={form.is_critical}
              onChange={(e) => setForm({ ...form, is_critical: e.target.checked })}
              className="accent-red-400"
            />
            <label htmlFor="is_critical" className="text-xs text-gray-400">
              Mark as Critical
            </label>
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
              {submitting ? "Saving…" : editTarget ? "Update Result" : "Save Result"}
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
                <th className="px-4 py-3 text-left">Result ID</th>
                <th className="px-4 py-3 text-left">Test Name</th>
                <th className="px-4 py-3 text-left">Order No.</th>
                <th className="px-4 py-3 text-left">Result Value</th>
                <th className="px-4 py-3 text-left">Critical</th>
                <th className="px-4 py-3 text-left">Remarks</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-12 text-sm">
                    No results entered yet.
                  </td>
                </tr>
              ) : (
                results.map((r) => (
                  <tr key={r.result_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">#{r.result_id}</td>
                    <td className="px-4 py-3 text-white font-medium">{r.lab_test_name || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                        {r.order_number || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white">{r.result_value}</td>
                    <td className="px-4 py-3">
                      {r.is_critical ? (
                        <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/30 px-2 py-1 rounded">
                          ⚠ Critical
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-[140px] truncate">{r.remarks || "—"}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">
                      {new Date(r.created_at).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(r)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(r.result_id)}
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

export default LabResultsPage;