import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { useAuth } from "../../../context/AuthContext";
import {
  getLabBills,
  createLabBill,
  updateLabBill,
  deleteLabBill,
  getLabOrders,
  getLabRequests,
  getLabTests,
} from "../api/labApi";

const buildPatientMap = (reqs) => {
  const map = {};
  reqs.forEach((r) => {
    if (r.lab_request_id && r.patient_name) map[r.lab_request_id] = r.patient_name;
  });
  return map;
};

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const LabBillingPage = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [orders, setOrders] = useState([]);
  const [labTestsById, setLabTestsById] = useState({});
  const [labTestsByName, setLabTestsByName] = useState({});
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
    Promise.all([getLabBills(), getLabOrders(), getLabRequests(), getLabTests()])
      .then(([bRes, oRes, reqRes, testRes]) => {
        setBills(bRes || []);                    // getLabBills() now returns the array directly
        const rawOrders = oRes.data || [];
        const reqs = reqRes.data || [];
        const tests = testRes.data || [];

        const testsMap = tests.reduce((acc, t) => {
          const id = t?.test_id;   // ✅ FIX: backend returns test_id not lab_test_id
          const cost = parseFloat(t?.cost || 0);
          if (id != null && Number.isFinite(cost) && cost >= 0) {
            acc[id] = cost;
          }
          return acc;
        }, {});

        const testsNameMap = tests.reduce((acc, t) => {
          const name = String(t?.test_name || "").trim().toLowerCase();
          const cost = parseFloat(t?.cost || 0);
          if (name && Number.isFinite(cost) && cost >= 0) {
            acc[name] = cost;
          }
          return acc;
        }, {});

        setLabTestsById(testsMap);
        setLabTestsByName(testsNameMap);

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

  const resolveItemCost = (item) => {
    const itemCost = parseFloat(item?.lab_test_cost || 0);
    if (Number.isFinite(itemCost) && itemCost > 0) return itemCost;

    const testId =
      typeof item?.lab_test === "object" ? item?.lab_test?.lab_test_id : item?.lab_test;
    const catalogCostById = parseFloat(labTestsById[testId] || 0);
    if (Number.isFinite(catalogCostById) && catalogCostById > 0) {
      return catalogCostById;
    }

    const testName = String(item?.lab_test_name || item?.lab_test?.test_name || "")
      .trim()
      .toLowerCase();
    const catalogCostByName = parseFloat(labTestsByName[testName] || 0);
    return Number.isFinite(catalogCostByName) && catalogCostByName > 0 ? catalogCostByName : 0;
  };

  const billedOrderIds = new Set(bills.map((b) => b.lab_order));
  // ✅ FIX: Show ALL orders that don't have a bill yet (not just Completed ones).
  // Bills must be created BEFORE results are entered (payment gate), so the order
  // is still "Pending" at billing time. Filtering for "Completed" meant the
  // dropdown was always empty and no bill could ever be created.
  const billableOrders = orders.filter(
    (o) => !billedOrderIds.has(o.order_id)
  );

  // When order selected, auto-calculate total from test costs and show items
  const handleOrderSelect = (orderId) => {
    const order = orders.find((o) => o.order_id === parseInt(orderId));
    let autoTotal = "";
    let items = [];
    if (order?.items?.length) {
      items = order.items;
      const total = order.items.reduce((sum, it) => sum + resolveItemCost(it), 0);
      if (total > 0) autoTotal = total.toFixed(2);
    }
    setSelectedOrderItems(items);
    setForm((prev) => ({ ...prev, lab_order: orderId, total_amount: autoTotal }));
  };

  useEffect(() => {
    if (!showForm || !form.lab_order || editTarget) return;

    const total = selectedOrderItems.reduce((sum, it) => sum + resolveItemCost(it), 0);
    const nextTotal = total > 0 ? total.toFixed(2) : "";

    setForm((prev) => (prev.total_amount === nextTotal ? prev : { ...prev, total_amount: nextTotal }));
  }, [showForm, form.lab_order, selectedOrderItems, labTestsById, labTestsByName, editTarget]);

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
    if (!form.lab_order) {
      setError("Please select a lab order.");
      return;
    }
    if (!form.total_amount || parseFloat(form.total_amount) < 0) {
      setError("Total amount is auto-calculated from selected tests.");
      return;
    }

    const totalAmount = parseFloat(form.total_amount || 0);
    const discountAmount = parseFloat(form.discount || 0);
    if (!Number.isFinite(discountAmount) || discountAmount < 0) {
      setError("Discount must be a valid non-negative number.");
      return;
    }
    if (discountAmount > totalAmount) {
      setError("Discount cannot exceed the total amount.");
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

  const handlePrintBill = (bill, relatedOrder) => {
    const tests = relatedOrder?.items || [];
    const patientName = relatedOrder?.patient_name || bill.patient_name || `Patient #${bill.lab_order}`;
    const generatedBy = user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user?.username || "Lab Technician";
    const dateText = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const parsedTotal = parseFloat(bill.total_amount || 0);
    const explicitAmounts = tests.map((it) => {
      const value = resolveItemCost(it);
      return Number.isFinite(value) && value > 0 ? value : 0;
    });

    // If backend does not provide per-test costs, derive printable amounts
    // from bill total so multi-test invoices still show meaningful amounts.
    const printableAmounts = [...explicitAmounts];
    const missingIndexes = printableAmounts
      .map((amount, index) => (amount <= 0 ? index : -1))
      .filter((index) => index !== -1);

    if (missingIndexes.length > 0 && parsedTotal > 0) {
      const explicitSum = printableAmounts.reduce((sum, amount) => sum + amount, 0);
      const remainder = parsedTotal - explicitSum;

      if (remainder > 0) {
        const totalCents = Math.round(remainder * 100);
        const eachCents = Math.floor(totalCents / missingIndexes.length);
        let extraCents = totalCents - eachCents * missingIndexes.length;

        missingIndexes.forEach((index) => {
          const cents = eachCents + (extraCents > 0 ? 1 : 0);
          printableAmounts[index] = cents / 100;
          if (extraCents > 0) extraCents -= 1;
        });
      }
    }

    const testsRows = tests.length
      ? tests
          .map(
            (it, idx) => {
              const displayAmount = printableAmounts[idx] || 0;

              return `
              <tr>
                <td>${idx + 1}</td>
                <td>${escapeHtml(it.lab_test_name || `Test #${it.lab_test}`)}</td>
                <td style="text-align:right;">Rs ${displayAmount.toFixed(2)}</td>
              </tr>
            `;
            }
          )
          .join("")
      : `
        <tr>
          <td colspan="3" style="text-align:center;color:#6b7280;">No test items available</td>
        </tr>
      `;

    const printHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Bill ${escapeHtml(bill.bill_number)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 0; }
          .invoice { border: 1px solid #cbd5e1; border-radius: 10px; padding: 18px; }
          .top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
          .title { font-size: 22px; font-weight: 700; margin: 0; }
          .muted { color: #64748b; font-size: 12px; margin-top: 4px; }
          .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 20px; font-size: 13px; margin: 14px 0 16px; }
          .meta strong { color: #334155; }
          table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 6px; }
          th { background: #f1f5f9; text-align: left; }
          th, td { border: 1px solid #e2e8f0; padding: 8px; }
          .totals { margin-top: 14px; margin-left: auto; width: 290px; border: 1px solid #e2e8f0; border-radius: 8px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 10px; font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          .totals-row:last-child { border-bottom: none; font-weight: 700; font-size: 15px; }
          .status { margin-top: 10px; font-size: 12px; color: #0f766e; font-weight: 600; }
          .footer { margin-top: 16px; font-size: 11px; color: #64748b; }
        </style>
      </head>
      <body>
        <section class="invoice">
          <div class="top">
            <div>
              <h1 class="title">Lab Invoice</h1>
              <p class="muted">Hospital Management System</p>
            </div>
            <div style="text-align:right; font-size:12px;">
              <div><strong>Date:</strong> ${escapeHtml(dateText)}</div>
              <div><strong>Bill No:</strong> ${escapeHtml(bill.bill_number)}</div>
            </div>
          </div>

          <div class="meta">
            <div><strong>Patient:</strong> ${escapeHtml(patientName)}</div>
            <div><strong>Order:</strong> ${escapeHtml(bill.lab_order_number || `#${bill.lab_order}`)}</div>
            <div><strong>Payment Status:</strong> ${escapeHtml(bill.payment_status)}</div>
            <div><strong>Generated By:</strong> ${escapeHtml(generatedBy)}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:55px;">No.</th>
                <th>Test</th>
                <th style="width:140px; text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${testsRows}
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Total</span><span>Rs ${escapeHtml(parseFloat(bill.total_amount || 0).toFixed(2))}</span></div>
            <div class="totals-row"><span>Discount</span><span>Rs ${escapeHtml(parseFloat(bill.discount || 0).toFixed(2))}</span></div>
            <div class="totals-row"><span>Final</span><span>Rs ${escapeHtml(parseFloat(bill.final_amount || 0).toFixed(2))}</span></div>
          </div>

          <p class="status">${bill.payment_status === "Paid" ? "Payment received" : "Payment pending"}</p>
          <p class="footer">This is a system-generated invoice.</p>
        </section>
      </body>
      </html>
    `;

    const frame = document.createElement("iframe");
    const htmlBlob = new Blob([printHtml], { type: "text/html" });
    const htmlUrl = URL.createObjectURL(htmlBlob);

    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.setAttribute("aria-hidden", "true");

    frame.onload = () => {
      try {
        const printWin = frame.contentWindow;
        if (!printWin) {
          throw new Error("Print frame is unavailable");
        }

        // Give Edge a brief moment to fully render the loaded HTML before print.
        setTimeout(() => {
          printWin.focus();
          printWin.print();
        }, 180);
      } catch {
        setError("Could not open print dialog. Please try again.");
      }

      setTimeout(() => {
        URL.revokeObjectURL(htmlUrl);
        frame.remove();
      }, 1600);
    };

    document.body.appendChild(frame);
    frame.src = htmlUrl;
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
              {billableOrders.length} order{billableOrders.length !== 1 ? "s" : ""} ready to bill
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
                Lab Order * {!editTarget && <span className="text-gray-600">(orders without a bill are shown)</span>}
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
                <p className="text-xs text-gray-500 mt-1">All orders already have a bill, or no orders exist yet.</p>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Total Amount (₹) *</label>
              <input type="number" step="0.01" min="0" required
                value={form.total_amount}
                readOnly
                placeholder="Auto-calculated from selected tests"
                className={`${inp} bg-[#0b1324] cursor-not-allowed`} />
              <p className="text-[11px] text-gray-500 mt-1">Auto-calculated from selected test rates.</p>
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
                        {resolveItemCost(it) > 0 ? `₹${resolveItemCost(it).toFixed(2)}` : <span className="text-gray-600">—</span>}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#0d1629]">
                    <td className="px-4 py-2 text-gray-400 font-semibold">Subtotal</td>
                    <td className="px-4 py-2 text-right text-white font-bold">
                      ₹{selectedOrderItems.reduce((sum, it) => sum + resolveItemCost(it), 0).toFixed(2)}
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
                                {resolveItemCost(it) > 0 ? <span className="ml-1 text-cyan-400/80">₹{resolveItemCost(it).toFixed(0)}</span> : null}
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
                          <button onClick={() => handlePrintBill(bill, relatedOrder)}
                            className="text-xs text-blue-300 hover:text-blue-200 border border-blue-300/40 px-3 py-1.5 rounded-lg transition">Print PDF</button>
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