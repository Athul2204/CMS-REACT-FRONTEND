import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PharmacistLayout from "../components/PharmacistLayout";
import {
  getIncomingPrescriptions,
  getPrescriptionDetail,
  getBatches,
  createDispense,
  createMedicineBill,
} from "../api/pharmacistApi";
import API from "../../../api";

// ─── PRESCRIPTIONS LIST ───────────────────────────────────────────────────────
export const PrescriptionsPage = () => {
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getIncomingPrescriptions()
      .then((res) => setPrescriptions(res.data || []))
      .catch(() => setError("Failed to load prescriptions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PharmacistLayout title="Incoming Prescriptions">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400 text-sm">
          {prescriptions.length} prescription(s) waiting for dispense
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Rx Code</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">Medicines</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
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
              ) : prescriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12 text-sm">
                    No pending prescriptions to dispense.
                  </td>
                </tr>
              ) : (
                prescriptions.map((rx) => (
                  <tr
                    key={rx.prescription_code}
                    className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                        {rx.prescription_code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {rx.patient_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      Dr. {rx.doctor_name || "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {rx.items?.map((item) => item.medicine_name).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded">
                        {rx.status || "Sent"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          navigate(`/pharmacist/prescriptions/${rx.prescription_code}`)
                        }
                        className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition"
                      >
                        Dispense →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PharmacistLayout>
  );
};

// ─── DISPENSE PAGE (FIXED) ────────────────────────────────────────────────────
export const DispensePage = () => {
  const { prescriptionCode } = useParams();
  const navigate = useNavigate();
  const [rx, setRx] = useState(null);
  const [batches, setBatches] = useState({});
  const [selectedBatch, setSelectedBatch] = useState({});
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [discount, setDiscount] = useState(0);
  const [billingBlocked, setBillingBlocked] = useState(false);
  const [billingMessage, setBillingMessage] = useState("");

  useEffect(() => {
    getPrescriptionDetail(prescriptionCode)
      .then(async (res) => {
        const data = res.data;
        setRx(data);
        
        // ─── BILLING GATE ──────────────────────────────────────
        // Check if the appointment's consultation bill is paid
        if (data.appointment_id || data.appointment) {
          const apptId = data.appointment_id || data.appointment;
          try {
            const billRes = await API.get(`/api/reception/appointments-by-date/?appointment_id=${apptId}`);
            const appts = billRes.data?.data || billRes.data || [];
            const appt = Array.isArray(appts)
              ? appts.find((a) => a.appointment_id === apptId)
              : null;
            const bill = appt?.bill;
            if (!bill || bill.status !== "Paid") {
              setBillingBlocked(true);
              setBillingMessage(
                !bill
                  ? "No consultation bill found for this patient. Please ensure billing is done by the receptionist before dispensing."
                  : "The consultation bill for this patient is not yet paid. Medicines can only be dispensed after the bill is cleared."
              );
            }
          } catch {
            // If billing check fails, don't block (fail open)
          }
        }
        // ──────────────────────────────────────────────────────
        
        // Initialize quantities from prescription
        const initialQuantities = {};
        data.items?.forEach((item) => {
          const medId = item.medicine_id;
          initialQuantities[medId] = 1; // Default quantity
        });
        setQuantities(initialQuantities);

        // Load batches for each medicine
        if (data.items) {
          const batchMap = {};
          await Promise.all(
            data.items.map(async (item) => {
              const medId = item.medicine_id;
              if (medId) {
                const bRes = await getBatches(medId);
                batchMap[medId] = bRes.results || bRes.data || bRes || [];
              }
            })
          );
          setBatches(batchMap);
        }
      })
      .catch(() => setError("Prescription not found or already dispensed."))
      .finally(() => setLoading(false));
  }, [prescriptionCode]);

  const handleBatchSelect = (medicineId, batchId) => {
    setSelectedBatch((prev) => ({ ...prev, [medicineId]: batchId }));
  };

  const handleQuantityChange = (medicineId, value) => {
    const qty = parseInt(value) || 1;
    setQuantities((prev) => ({ ...prev, [medicineId]: Math.max(1, qty) }));
  };

  const calcTotal = () => {
    if (!rx?.items) return 0;
    return rx.items.reduce((sum, item) => {
      const medId = item.medicine_id;
      const bId = selectedBatch[medId];
      const batchList = batches[medId] || [];
      const batch = batchList.find((b) => b.batch_id === parseInt(bId));
      const price = batch?.medicine_price || item.medicine_price || 0;
      const qty = quantities[medId] || 1;
      return sum + price * qty;
    }, 0);
  };

  const handleDispense = async () => {
    if (!rx) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Validate all medicines have batch selected
      const missingBatches = rx.items.filter(
        (item) => !selectedBatch[item.medicine_id]
      );
      
      if (missingBatches.length > 0) {
        setError("Please select batches for all medicines");
        setSubmitting(false);
        return;
      }

      // 1. Create Dispense with nested items (SINGLE API CALL - FIXED!)
      const dispensePayload = {
        prescription: rx.prescription_id || rx.id,
        items: rx.items.map((item) => ({
          batch: parseInt(selectedBatch[item.medicine_id]),
          quantity: quantities[item.medicine_id] || 1,
        })),
      };

      const dispenseRes = await createDispense(dispensePayload);
      const dispenseData = dispenseRes.data || dispenseRes;
      const dispenseId = dispenseData.dispense_id;
      const totalAmount = dispenseData.total_amount;

      // 2. Create Medicine Bill
      const finalAmt = Math.max(totalAmount - discount, 0);
      await createMedicineBill({
        dispense: dispenseId,
        total_amount: totalAmount,
        discount: discount,
        payment_status: "Pending",
      });

      setSuccess("✓ Dispensed successfully! Bill created.");
      setTimeout(() => navigate("/pharmacist/prescriptions"), 2000);
    } catch (err) {
      console.error("Dispense error:", err);
      const msg =
        err?.response?.data?.items?.[0] ||
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Failed to dispense. Please check batch selections and stock availability.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PharmacistLayout title="Dispense Medicines">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400 animate-pulse">Loading prescription...</div>
        </div>
      </PharmacistLayout>
    );
  }

  if (!rx) {
    return (
      <PharmacistLayout title="Dispense Medicines">
        <div className="text-center py-20">
          <p className="text-red-400 mb-4">Prescription not found</p>
          <button
            onClick={() => navigate("/pharmacist/prescriptions")}
            className="text-sm text-gray-400 hover:text-white"
          >
            ← Back to Prescriptions
          </button>
        </div>
      </PharmacistLayout>
    );
  }

  const allBatchesSelected = rx.items?.every(
    (item) => selectedBatch[item.medicine_id]
  );

  return (
    <PharmacistLayout title="Dispense Medicines">
      <button
        onClick={() => navigate("/pharmacist/prescriptions")}
        className="mb-4 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
      >
        ← Back to Prescriptions
      </button>

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

      {/* ─── BILLING GATE BANNER ─── */}
      {billingBlocked && (
        <div className="mb-5 flex items-start gap-3 px-5 py-4 rounded-xl border bg-red-500/10 border-red-400/40 text-red-300">
          <span className="text-2xl leading-none mt-0.5">🚫</span>
          <div>
            <p className="text-sm font-semibold mb-1">Dispense Blocked — Billing Pending</p>
            <p className="text-xs text-red-400/80">{billingMessage}</p>
            <p className="text-xs text-red-400/60 mt-1">Please contact the receptionist to complete billing first.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Prescription Info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Header card */}
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-white font-semibold">Prescription Details</h3>
              <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
                {rx.prescription_code}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs">Patient</p>
                <p className="text-white">{rx.patient_name || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Doctor</p>
                <p className="text-white">Dr. {rx.doctor_name || "—"}</p>
              </div>
              {rx.diagnosis && (
                <div className="col-span-2">
                  <p className="text-gray-500 text-xs">Diagnosis</p>
                  <p className="text-white">{rx.diagnosis}</p>
                </div>
              )}
            </div>
          </div>

          {/* Medicine Items */}
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e2d4a]">
              <h3 className="text-sm font-semibold text-white">Medicines to Dispense</h3>
            </div>
            <div className="divide-y divide-[#1e2d4a]">
              {rx.items?.map((item) => {
                const medId = item.medicine_id;
                const batchList = batches[medId] || [];
                const selectedB = batchList.find(
                  (b) => b.batch_id === parseInt(selectedBatch[medId])
                );
                const qty = quantities[medId] || 1;
                const price = selectedB?.medicine_price || item.medicine_price || 0;

                return (
                  <div key={medId} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {item.medicine_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.dosage} | {item.frequency} | {item.duration} days
                        </p>
                        {item.instructions && (
                          <p className="text-xs text-gray-400 mt-1">
                            Instructions: {item.instructions}
                          </p>
                        )}
                      </div>
                      {selectedB && (
                        <span className="text-xs text-green-400 font-medium whitespace-nowrap ml-4">
                          ₹{(price * qty).toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Batch Selection */}
                    {batchList.length > 0 ? (
                      <div className="space-y-2">
                        <select
                          value={selectedBatch[medId] || ""}
                          onChange={(e) => handleBatchSelect(medId, e.target.value)}
                          className="w-full bg-[#060d1a] border border-[#1e2d4a] text-white text-xs rounded-lg px-3 py-2 focus:border-red-400/50 outline-none"
                        >
                          <option value="">-- Select Batch --</option>
                          {batchList.map((b) => (
                            <option key={b.batch_id} value={b.batch_id}>
                              {b.batch_number} | Stock: {b.quantity} | Exp: {b.expiry_date} | ₹
                              {b.medicine_price}
                            </option>
                          ))}
                        </select>

                        {/* Quantity Input */}
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-400">Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            max={selectedB?.quantity || 999}
                            value={qty}
                            onChange={(e) => handleQuantityChange(medId, e.target.value)}
                            className="w-20 bg-[#060d1a] border border-[#1e2d4a] text-white text-xs rounded px-2 py-1 focus:border-red-400/50 outline-none"
                          />
                          {selectedB && (
                            <span className="text-xs text-gray-500">
                              (max: {selectedB.quantity})
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-red-400">
                        ⚠ No available batches for this medicine.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bill Summary */}
        <div className="space-y-4">
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Bill Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">₹{calcTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Discount (₹)</span>
                <input
                  type="number"
                  min={0}
                  max={calcTotal()}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-24 bg-[#060d1a] border border-[#1e2d4a] text-white text-xs rounded px-2 py-1 focus:border-red-400/50 outline-none text-right"
                />
              </div>
              <div className="border-t border-[#1e2d4a] pt-3 flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-red-400 font-bold text-lg">
                  ₹{Math.max(calcTotal() - discount, 0).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleDispense}
              disabled={submitting || !allBatchesSelected || billingBlocked}
              className="mt-5 w-full bg-red-500 hover:bg-red-600 disabled:bg-red-900/40 disabled:text-red-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              {submitting ? "Processing..." : "Confirm Dispense & Create Bill"}
            </button>
            
            {billingBlocked && (
              <p className="text-xs text-red-400 mt-2 text-center">
                🚫 Billing must be paid before dispensing
              </p>
            )}
            {!billingBlocked && !allBatchesSelected && (
              <p className="text-xs text-yellow-400 mt-2 text-center">
                ⚠ Select batches for all medicines to proceed
              </p>
            )}
          </div>
        </div>
      </div>
    </PharmacistLayout>
  );
};