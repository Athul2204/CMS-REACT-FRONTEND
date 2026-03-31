import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import {
  getLabBills,
  createLabBill,
  updateLabBill,
  deleteLabBill,
  getLabOrders,
} from "../api/labApi";

const LabBillingPage = () => {
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const emptyForm = {
    lab_order: "",
    total_amount: "",
    discount: "0",
    payment_status: "Pending",
  };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getLabBills(), getLabOrders()])
      .then(([bRes, oRes]) => {
        setBills(bRes.data || []);
        setOrders(oRes.data || []);
      })
      .catch(() => setError("Failed to load billing data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const openEdit = (bill) => {
    setEditTarget(bill);
    setForm({
      lab_order: bill.lab_order,
      total_amount: bill.total_amount,
      discount: bill.discount,
      payment_status: bill.payment_status,
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
        await updateLabBill(editTarget.lab_bill_id, form);
        setSuccess("Bill updated.");
      } else {
        await createLabBill(form);
        setSuccess("Bill created.");
      }
      cancelForm();
      fetchAll();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.lab_order?.[0] ||
        data?.total_amount?.[0] ||
        data?.discount?.[0] ||
        data?.non_field_errors?.[0] ||
        "Failed to save bill."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try {
      await deleteLabBill(id);
      setSuccess("Bill deleted.");
      fetchAll();
    } catch {
      setError("Failed to delete bill.");
    }
  };

  const finalAmount = (total, discount) => {
    const t = parseFloat(total) || 0;
    const d = parseFloat(discount) || 0;
    return (t - d).toFixed(2);
  };

  const totalRevenue = bills
    .filter((b) => b.payment_status === "Paid")
    .reduce((sum, b) => sum + parseFloat(b.final_amount || 0), 0);

  return (
    <LabLayout title="Lab Billing">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-cyan-400">{bills.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Bills</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-yellow-400">
            {bills.filter((b) => b.payment_status === "Pending").length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Pending</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Collected Revenue</p>
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition"
        >
          {showForm && !editTarget ? "Cancel" : "+ Create Bill"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="text-xs text-gray-400 block mb-1">Lab Order *</label>
            <select
              required
              value={form.lab_order}
              onChange={(e) => setForm({ ...form, lab_order: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="">Select order…</option>
              {orders.map((o) => (
                <option key={o.order_id} value={o.order_id}>
                  {o.order_number} — {o.patient_name || `Patient #${o.patient}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Total Amount (₹) *</label>
            <input
              type="number"
              step="0.01"
              min="0"
              required
              value={form.total_amount}
              onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
              placeholder="e.g. 500.00"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Discount (₹)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1">Payment Status</label>
            <select
              value={form.payment_status}
              onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
              className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          {form.total_amount && (
            <div className="md:col-span-2 bg-[#060d1a] border border-cyan-400/20 rounded-lg px-4 py-3">
              <span className="text-xs text-gray-400">Final Amount: </span>
              <span className="text-cyan-400 font-bold">
                ₹{finalAmount(form.total_amount, form.discount)}
              </span>
            </div>
          )}
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
              {submitting ? "Saving…" : editTarget ? "Update Bill" : "Create Bill"}
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
                <th className="px-4 py-3 text-left">Bill No.</th>
                <th className="px-4 py-3 text-left">Order No.</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Discount</th>
                <th className="px-4 py-3 text-left">Final</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : bills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-12 text-sm">
                    No bills found.
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill.lab_bill_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">
                        {bill.bill_number}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{bill.lab_order_number || `#${bill.lab_order}`}</td>
                    <td className="px-4 py-3 text-white">₹{bill.total_amount}</td>
                    <td className="px-4 py-3 text-orange-400">₹{bill.discount}</td>
                    <td className="px-4 py-3 text-cyan-400 font-semibold">₹{bill.final_amount}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          bill.payment_status === "Paid"
                            ? "bg-green-400/10 text-green-400 border-green-400/30"
                            : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                        }`}
                      >
                        {bill.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button
                        onClick={() => openEdit(bill)}
                        className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(bill.lab_bill_id)}
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

export default LabBillingPage;