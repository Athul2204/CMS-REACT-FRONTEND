import React, { useEffect, useState } from "react";
import PharmacistLayout from "../components/PharmacistLayout";
import { getMedicineBills } from "../api/pharmacistApi";
import API from "../../../api";

// ─── BILLS PAGE ───────────────────────────────────────────────────────────────
const BillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "Pending" | "Paid"
  const [markingPaid, setMarkingPaid] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);

  const fetchBills = () => {
    setLoading(true);
    getMedicineBills()
      .then((res) => setBills(res.results || res.data || []))
      .catch(() => setError("Failed to load bills."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills =
    filter === "all" ? bills : bills.filter((b) => b.payment_status === filter);

  const totalRevenue = bills
    .filter((b) => b.payment_status === "Paid")
    .reduce((sum, b) => sum + parseFloat(b.final_amount || 0), 0);

  const pendingRevenue = bills
    .filter((b) => b.payment_status === "Pending")
    .reduce((sum, b) => sum + parseFloat(b.final_amount || 0), 0);

  const handleMarkPaid = async (bill) => {
    setMarkingPaid(bill.bill_id);
    setError("");
    try {
      await API.patch(`/api/pharmacist/bills/${bill.bill_id}/`, {
        payment_status: "Paid",
      });
      setSuccess(`Bill #${bill.bill_id} marked as paid.`);
      fetchBills();
      if (selectedBill?.bill_id === bill.bill_id) {
        setSelectedBill({ ...selectedBill, payment_status: "Paid" });
      }
    } catch (err) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to update bill.";
      setError(msg);
    } finally {
      setMarkingPaid(null);
    }
  };

  return (
    <PharmacistLayout title="Medicine Bills">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Bills", value: bills.length, color: "text-white", icon: "🧾" },
          {
            label: "Pending Bills",
            value: bills.filter((b) => b.payment_status === "Pending").length,
            color: "text-yellow-400",
            icon: "⏳",
          },
          {
            label: "Pending Amount",
            value: `₹${pendingRevenue.toFixed(2)}`,
            color: "text-orange-400",
            icon: "💰",
          },
          {
            label: "Total Collected",
            value: `₹${totalRevenue.toFixed(2)}`,
            color: "text-green-400",
            icon: "✅",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>
                  {loading ? "—" : stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
              <span className="text-xl opacity-60">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

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

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "All" },
          { key: "Pending", label: "Pending" },
          { key: "Paid", label: "Paid" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filter === key
                ? "bg-red-500/20 text-red-400 border border-red-400/40"
                : "text-gray-400 hover:text-white border border-transparent hover:border-white/10"
            }`}
          >
            {label}
            <span className="ml-2 text-xs opacity-60">
              (
              {key === "all"
                ? bills.length
                : bills.filter((b) => b.payment_status === key).length}
              )
            </span>
          </button>
        ))}
      </div>

      <div className="flex gap-6">
        {/* Bills table */}
        <div className={`${selectedBill ? "flex-1" : "w-full"} bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3 text-left">Bill #</th>
                  <th className="px-4 py-3 text-left">Dispense #</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Discount</th>
                  <th className="px-4 py-3 text-left">Final</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-b border-[#1e2d4a]">
                      {[...Array(8)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-16" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredBills.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center text-gray-500 py-12 text-sm">
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill.bill_id}
                      onClick={() => setSelectedBill(selectedBill?.bill_id === bill.bill_id ? null : bill)}
                      className={`border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors cursor-pointer ${
                        selectedBill?.bill_id === bill.bill_id ? "bg-[#111d35]" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                          #{bill.bill_id}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        #{bill.dispense || bill.dispense_id}
                      </td>
                      <td className="px-4 py-3 text-gray-300">₹{parseFloat(bill.total_amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {parseFloat(bill.discount || 0) > 0
                          ? `₹${parseFloat(bill.discount).toFixed(2)}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold">
                        ₹{parseFloat(bill.final_amount || 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs border px-2 py-1 rounded ${
                            bill.payment_status === "Paid"
                              ? "text-green-400 bg-green-400/10 border-green-400/30"
                              : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                          }`}
                        >
                          {bill.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {bill.created_at
                          ? new Date(bill.created_at).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        {bill.payment_status === "Pending" && (
                          <button
                            onClick={() => handleMarkPaid(bill)}
                            disabled={markingPaid === bill.bill_id}
                            className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 px-3 py-1.5 rounded-lg transition disabled:opacity-50"
                          >
                            {markingPaid === bill.bill_id ? "Updating..." : "Mark Paid"}
                          </button>
                        )}
                        {bill.payment_status === "Paid" && (
                          <span className="text-xs text-green-400 opacity-60">✓ Paid</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bill Detail Panel */}
        {selectedBill && (
          <div className="w-72 flex-shrink-0">
            <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Bill Details</h3>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="text-gray-500 hover:text-white text-xs transition"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Bill ID</span>
                  <span className="font-mono text-red-400">#{selectedBill.bill_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Dispense</span>
                  <span className="text-gray-300">#{selectedBill.dispense || selectedBill.dispense_id}</span>
                </div>
                <div className="border-t border-[#1e2d4a] pt-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">₹{parseFloat(selectedBill.total_amount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-gray-300">
                      {parseFloat(selectedBill.discount || 0) > 0
                        ? `-₹${parseFloat(selectedBill.discount).toFixed(2)}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[#1e2d4a] pt-2">
                    <span className="text-white font-semibold">Final Amount</span>
                    <span className="text-red-400 font-bold text-lg">
                      ₹{parseFloat(selectedBill.final_amount || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status</span>
                  <span
                    className={`text-xs border px-2 py-1 rounded ${
                      selectedBill.payment_status === "Paid"
                        ? "text-green-400 bg-green-400/10 border-green-400/30"
                        : "text-yellow-400 bg-yellow-400/10 border-yellow-400/30"
                    }`}
                  >
                    {selectedBill.payment_status}
                  </span>
                </div>
                {selectedBill.created_at && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date</span>
                    <span className="text-gray-300 text-xs">
                      {new Date(selectedBill.created_at).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>

              {selectedBill.payment_status === "Pending" && (
                <button
                  onClick={() => handleMarkPaid(selectedBill)}
                  disabled={markingPaid === selectedBill.bill_id}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-semibold transition"
                >
                  {markingPaid === selectedBill.bill_id ? "Processing..." : "✓ Mark as Paid"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </PharmacistLayout>
  );
};

export default BillsPage;