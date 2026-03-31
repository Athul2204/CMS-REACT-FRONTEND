import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import {
  getLabBills,
  createLabBill,
  updateLabBill,
  deleteLabBill,
  getLabOrders,
  getLabRequests,
} from "../api/labApi";

const buildPatientMap = (reqs) => {
  const map = {};
  reqs.forEach((r) => {
    if (r.lab_request_id && r.patient_name) map[r.lab_request_id] = r.patient_name;
  });
  return map;
};

const LabBillingPage = () => {
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // The selected order's test item breakdown for preview
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);

  const emptyForm = { lab_order: "", total_amount: "", discount: "0", payment_status: "Pending" };
  const [form, setForm] = useState(emptyForm);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([getLabBills(), getLabOrders(), getLabRequests()])
      .then(([bRes, oRes, reqRes]) => {
        setBills(bRes.data || []);
        const rawOrders = oRes.data || [];
        const reqs = reqRes.data || [];
        const patientMap = buildPatientMap(reqs);
        const enriched = rawOrders.map((o) => ({
          ...o,
          patient_name: o.patient_name || patientMap[o.lab_request] || null,
        }));
        setOrders(enriched);
      })
      .catch(() => setError("Failed to load billing data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const billedOrderIds = new Set(bills.map((b) => b.lab_order));
  const billableOrders = orders.filter(
    (o) => o.status === "Completed" && !billedOrderIds.has(o.order_id)
  );

  // When order selected, auto-calculate total from test costs and show items
  const handleOrderSelect = (orderId) => {
    const order = orders.find((o) => o.order_id === parseInt(orderId));
    let autoTotal = "";
    let items = [];
    if (order?.items?.length) {
      items = order.items;
      const total = order.items.reduce((sum, it) => sum + parseFloat(it.lab_test_cost || 0), 0);
      if (total > 0) autoTotal = total.toFixed(2);
    }
    setSelectedOrderItems(items);
    setForm({ ...form, lab_order: orderId, total_amount: autoTotal });
  };

  const openEdit = (bill) => {
    setEditTarget(bill);
    // Find order items for this bill to show breakdown
    const relatedOrder = orders.find((o) => o.order_id === bill.lab_order);
    setSelectedOrderItems(relatedOrder?.items || []);
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
    setSelectedOrderItems([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.total_amount || parseFloat(form.total_amount) < 0) {
      setError("Enter a valid total amount.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (editTarget) {
        await updateLabBill(editTarget.lab_bill_id, form);
        setSuccess("Bill updated successfully.");
      } else {
        await createLabBill(form);
        setSuccess("Bill created successfully.");
      }
      cancelForm();
      fetchAll();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.lab_order?.[0] || data?.total_amount?.[0] || data?.discount?.[0] ||
        data?.non_field_errors?.[0] || data?.detail || "Failed to save bill."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const markPaid = async (bill) => {
    try {
      await updateLabBill(bill.lab_bill_id, {
        lab_order: bill.lab_order,
        total_amount: bill.total_amount,
        discount: bill.discount,
        payment_status: "Paid",
      });
      setSuccess(`Bill ${bill.bill_number} marked as Paid.`);
      fetchAll();
    } catch {
      setError("Failed to update payment status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try { await deleteLabBill(id); setSuccess("Bill deleted."); fetchAll(); }
    catch { setError("Failed to delete bill."); }
  };

  const finalAmt = (total, discount) => {
    const t = parseFloat(total) || 0;
    const d = parseFloat(discount) || 0;
    return Math.max(0, t - d).toFixed(2);
  };

  const totalRevenue = bills
    .filter((b) => b.payment_status === "Paid")
    .reduce((sum, b) => sum + parseFloat(b.final_amount || 0), 0);

  const pendingRevenue = bills
    .filter((b) => b.payment_status === "Pending")
    .reduce((sum, b) => sum + parseFloat(b.final_amount || 0), 0);

  const inp = "w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400 transition";

  return (
    <LabLayout title="Lab Billing">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-cyan-400">{bills.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Bills</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-yellow-400">{bills.filter((b) => b.payment_status === "Pending").length}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Payment</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Collected</p>
        </div>
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
          <p className="text-2xl font-bold text-orange-400">₹{pendingRevenue.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Pending Amount</p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          {billableOrders.length > 0 && (
            <span className="text-xs text-yellow-400 bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-lg">
              {billableOrders.length} completed order{billableOrders.length !== 1 ? "s" : ""} ready to bill
            </span>
          )}
        </div>
        <button onClick={() => { cancelForm(); setShowForm((p) => !p); }}
          className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 px-4 py-2 rounded-lg hover:bg-cyan-500/30 transition">
          {showForm && !editTarget ? "Cancel" : "+ Create Bill"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 mb-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Lab Order * {!editTarget && <span className="text-gray-600">(only completed orders shown)</span>}
              </label>
              <select required value={form.lab_order}
                onChange={(e) => handleOrderSelect(e.target.value)}
                disabled={!!editTarget} className={inp}>
                <option value="">Select order…</option>
                {editTarget ? (
                  <option value={editTarget.lab_order}>
                    {editTarget.lab_order_number || `Order #${editTarget.lab_order}`}
                  </option>
                ) : (
                  billableOrders.map((o) => (
                    <option key={o.order_id} value={o.order_id}>
                      {o.order_number} — {o.patient_name || `Patient #${o.patient}`} ({o.items?.length || 0} test{o.items?.length !== 1 ? "s" : ""})
                    </option>
                  ))
                )}
              </select>
              {!editTarget && billableOrders.length === 0 && (
                <p className="text-xs text-gray-500 mt-1">No completed orders available to bill yet.</p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Total Amount (₹) *</label>
              <input type="number" step="0.01" min="0" required
                value={form.total_amount}
                onChange={(e) => setForm({ ...form, total_amount: e.target.value })}
                placeholder="e.g. 500.00" className={inp} />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Discount (₹)</label>
              <input type="number" step="0.01" min="0"
                value={form.discount}
                onChange={(e) => setForm({ ...form, discount: e.target.value })}
                className={inp} />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Payment Status</label>
              <select value={form.payment_status}
                onChange={(e) => setForm({ ...form, payment_status: e.target.value })}
                className={inp}>
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>

          {/* Test Items Breakdown */}
          {selectedOrderItems.length > 0 && (
            <div className="bg-[#060d1a] border border-[#1e2d4a] rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#1e2d4a] flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-300">🧪 Test Items Breakdown</span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-[#1e2d4a]">
                    <th className="px-4 py-2 text-left">Test Name</th>
                    <th className="px-4 py-2 text-right">Cost (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderItems.map((it) => (
                    <tr key={it.order_item_id} className="border-b border-[#1e2d4a]/50">
                      <td className="px-4 py-2 text-purple-300">
                        🧪 {it.lab_test_name || `Test #${it.lab_test}`}
                      </td>
                      <td className="px-4 py-2 text-right text-cyan-400 font-medium">
                        {it.lab_test_cost ? `₹${parseFloat(it.lab_test_cost).toFixed(2)}` : <span className="text-gray-600">—</span>}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#0d1629]">
                    <td className="px-4 py-2 text-gray-400 font-semibold">Subtotal</td>
                    <td className="px-4 py-2 text-right text-white font-bold">
                      ₹{selectedOrderItems.reduce((sum, it) => sum + parseFloat(it.lab_test_cost || 0), 0).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Final amount preview */}
          {form.total_amount && (
            <div className="bg-[#060d1a] border border-cyan-400/20 rounded-xl px-5 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">Final Amount After Discount</span>
              <span className="text-cyan-400 font-bold text-lg">₹{finalAmt(form.total_amount, form.discount)}</span>
            </div>
          )}

          {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={cancelForm}
              className="text-sm text-gray-400 hover:text-white border border-[#1e2d4a] px-5 py-2 rounded-lg transition">Cancel</button>
            <button type="submit" disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm px-6 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2">
              {submitting && <span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {submitting ? "Saving…" : editTarget ? "Update Bill" : "Create Bill"}
            </button>
          </div>
        </form>
      )}

      {success && <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">✓ {success}</div>}
      {!showForm && error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {/* Bills table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Bill No.</th>
                <th className="px-4 py-3 text-left">Order</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Tests</th>
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
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-16" /></td>
                    ))}
                  </tr>
                ))
              ) : bills.length === 0 ? (
                <tr><td colSpan={9} className="text-center text-gray-500 py-12 text-sm">No bills created yet.</td></tr>
              ) : (
                bills.map((bill) => {
                  const relatedOrder = orders.find((o) => o.order_id === bill.lab_order);
                  return (
                    <tr key={bill.lab_bill_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{bill.bill_number}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 text-xs">{bill.lab_order_number || `#${bill.lab_order}`}</td>
                      <td className="px-4 py-3 text-white text-sm font-medium">
                        {relatedOrder?.patient_name || bill.patient_name || `Patient #${bill.lab_order}`}
                      </td>
                      <td className="px-4 py-3">
                        {relatedOrder?.items?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {relatedOrder.items.map((it) => (
                              <span key={it.order_item_id} className="text-xs bg-purple-400/10 text-purple-300 border border-purple-400/20 px-2 py-0.5 rounded">
                                🧪 {it.lab_test_name || `Test #${it.lab_test}`}
                                {it.lab_test_cost ? <span className="ml-1 text-cyan-400/80">₹{parseFloat(it.lab_test_cost).toFixed(0)}</span> : null}
                              </span>
                            ))}
                          </div>
                        ) : <span className="text-xs text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3 text-white">₹{bill.total_amount}</td>
                      <td className="px-4 py-3 text-orange-400">₹{bill.discount}</td>
                      <td className="px-4 py-3 text-cyan-400 font-semibold">₹{bill.final_amount}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          bill.payment_status === "Paid"
                            ? "bg-green-400/10 text-green-400 border-green-400/30"
                            : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                        }`}>{bill.payment_status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          {bill.payment_status === "Pending" && (
                            <button onClick={() => markPaid(bill)}
                              className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 px-3 py-1.5 rounded-lg transition">Mark Paid</button>
                          )}
                          <button onClick={() => openEdit(bill)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 border border-cyan-400/30 px-3 py-1.5 rounded-lg transition">Edit</button>
                          <button onClick={() => handleDelete(bill.lab_bill_id)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition">Del</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </LabLayout>
  );
};

export default LabBillingPage;