import React, { useEffect, useState } from "react";
import ReceptionLayout from "../components/ReceptionLayout";
import { getAppointmentsByDate, payBill } from "../api/receptionApi";

// ─── STATUS BADGE ─────────────────────────────────────────────────
const BillBadge = ({ status }) => {
  const cls =
    status === "Paid"
      ? "bg-green-400/10 text-green-400 border-green-400/30"
      : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded border ${cls}`}>
      {status}
    </span>
  );
};

const BillingPage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [payingId, setPayingId] = useState(null);

  const fetchData = async (d) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAppointmentsByDate(d);
      // Only show appointments that have a bill (completed/scheduled)
      setAppointments(res.data || []);
    } catch {
      setError("Failed to load billing data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(date); }, [date]);

  const handlePay = async (billId) => {
    if (!billId) { alert("No bill found for this appointment."); return; }
    if (!window.confirm("Mark this bill as Paid?")) return;
    setPayingId(billId);
    try {
      await payBill(billId);
      fetchData(date);
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to mark as paid.");
    } finally {
      setPayingId(null);
    }
  };

  const billedAppointments = appointments.filter((a) => a.status !== "Cancelled");

  const totalRevenue = billedAppointments
    .filter((a) => a.bill?.status === "Paid")
    .reduce((sum, a) => sum + (a.consultation_fee || 0), 0);

  const pendingRevenue = billedAppointments
    .filter((a) => a.bill?.status === "Unpaid")
    .reduce((sum, a) => sum + (a.consultation_fee || 0), 0);

  return (
    <ReceptionLayout title="Billing">
      {/* Date Picker */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400 transition"
          />
          {date !== today && (
            <button onClick={() => setDate(today)} className="text-xs text-yellow-400 hover:underline">
              Today
            </button>
          )}
        </div>
      </div>

      {/* Revenue Stats */}
      {!loading && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
            <p className="text-2xl font-bold text-green-400">₹{totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Collected Today</p>
          </div>
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
            <p className="text-2xl font-bold text-yellow-400">₹{pendingRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Pending Collection</p>
          </div>
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
            <p className="text-2xl font-bold text-white">{billedAppointments.length}</p>
            <p className="text-xs text-gray-500 mt-1">Billable Appointments</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Bills Table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2d4a]">
          <h3 className="text-sm font-semibold text-white">Bills</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">Appt. Status</th>
                <th className="px-4 py-3 text-left">Amount</th>
                <th className="px-4 py-3 text-left">Bill Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : billedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-12 text-sm">
                    No billable appointments for this date.
                  </td>
                </tr>
              ) : (
                billedAppointments.map((appt) => {
                  const bill = appt.bill;
                  return (
                    <tr key={appt.appointment_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                      <td className="px-4 py-3 text-blue-400 font-bold">#{appt.token_number}</td>
                      <td className="px-4 py-3 text-white font-medium">
                        {appt.patient_full_name || appt.patient_name || `#${appt.patient}`}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {appt.doctor_name || `#${appt.doctor}`}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded border ${
                          appt.status === "Completed"
                            ? "bg-green-400/10 text-green-400 border-green-400/30"
                            : "bg-blue-400/10 text-blue-400 border-blue-400/30"
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-emerald-400 font-semibold">
                        ₹{appt.consultation_fee ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {bill ? (
                          <BillBadge status={bill.status} />
                        ) : (
                          <span className="text-gray-600 text-xs">No bill</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {bill && bill.status === "Unpaid" && (
                          <button
                            onClick={() => handlePay(bill.bill_id)}
                            disabled={payingId === bill.bill_id}
                            className="text-xs text-green-400 hover:text-green-300 border border-green-400/30 px-3 py-1 rounded-lg transition disabled:opacity-50 flex items-center gap-1"
                          >
                            {payingId === bill.bill_id ? (
                              <span className="w-3 h-3 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
                            ) : (
                              "✓"
                            )}{" "}
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ReceptionLayout>
  );
};

export default BillingPage;