import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PharmacistLayout from "../components/PharmacistLayout";
import {
  getIncomingPrescriptions,
  getPrescriptionDetail,
  getBatches,
  createDispense,
  createDispenseItem,
  createMedicineBill,
} from "../api/pharmacistApi";

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
                      {rx.items?.map((item) => item.medicine_name || item.medicine).join(", ") || "—"}
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

// ─── DISPENSE PAGE ────────────────────────────────────────────────────────────
export const DispensePage = () => {
  const { prescriptionCode } = useParams();
  const navigate = useNavigate();
  const [rx, setRx] = useState(null);
  const [batches, setBatches] = useState({});
  const [selectedBatch, setSelectedBatch] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    getPrescriptionDetail(prescriptionCode)
      .then(async (res) => {
        const data = res.data;
        setRx(data);
        // Load batches for each medicine
        if (data.items) {
          const batchMap = {};
          await Promise.all(
            data.items.map(async (item) => {
              const medId = item.medicine_id || item.medicine;
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

  const calcTotal = () => {
    if (!rx?.items) return 0;
    return rx.items.reduce((sum, item) => {
      const medId = item.medicine_id || item.medicine;
      const bId = selectedBatch[medId];
      const batchList = batches[medId] || [];
      const batch = batchList.find((b) => b.batch_id === parseInt(bId));
      const price = batch?.medicine_price || batch?.price || 0;
      return sum + price * (item.quantity || 1);
    }, 0);
  };

  const handleDispense = async () => {
    if (!rx) return;
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const total = calcTotal();
      const patientId = rx.patient_id || rx.patient;

      // 1. Create Dispense
      const dispenseRes = await createDispense({
        prescription: rx.prescription_id || rx.id,
        patient: patientId,
        total_amount: total,
        status: "Completed",
      });

      const dispenseId = dispenseRes.data?.dispense_id || dispenseRes.dispense_id;

      // 2. Create Dispense Items
      for (const item of rx.items) {
        const medId = item.medicine_id || item.medicine;
        const batchId = selectedBatch[medId];
        if (!batchId) continue;
        await createDispenseItem({
          dispense: dispenseId,
          batch: parseInt(batchId),
          quantity: item.quantity || 1,
        });
      }

      // 3. Create Medicine Bill
      const finalAmt = Math.max(total - discount, 0);
      await createMedicineBill({
        dispense: dispenseId,
        total_amount: total,
        discount: discount,
        final_amount: finalAmt,
        payment_status: "Pending",
      });

      setSuccess("Dispensed successfully! Bill created.");
      setTimeout(() => navigate("/pharmacist/prescriptions"), 2000);
    } catch (err) {
      const msg = err?.response?.data
        ? JSON.stringify(err.response.data)
        : "Failed to dispense. Check batch selections.";
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

      {rx && (
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
                  const medId = item.medicine_id || item.medicine;
                  const batchList = batches[medId] || [];
                  const selectedB = batchList.find(
                    (b) => b.batch_id === parseInt(selectedBatch[medId])
                  );

                  return (
                    <div key={medId} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-white font-medium">
                            {item.medicine_name || item.medicine_display || `Medicine #${medId}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity || 1} | {item.dosage || ""} {item.instructions || ""}
                          </p>
                        </div>
                        {selectedB && (
                          <span className="text-xs text-green-400">
                            ₹{(parseFloat(selectedB.medicine_price || selectedB.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </span>
                        )}
                      </div>
                      {batchList.length > 0 ? (
                        <select
                          value={selectedBatch[medId] || ""}
                          onChange={(e) => handleBatchSelect(medId, e.target.value)}
                          className="w-full bg-[#060d1a] border border-[#1e2d4a] text-white text-xs rounded-lg px-3 py-2 focus:border-red-400/50 outline-none"
                        >
                          <option value="">-- Select Batch --</option>
                          {batchList.map((b) => (
                            <option key={b.batch_id} value={b.batch_id}>
                              {b.batch_number} | Qty: {b.quantity} | Exp: {b.expiry_date} | ₹{b.medicine_price || b.price}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-xs text-red-400">No available batches for this medicine.</p>
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
                disabled={submitting || !rx.items?.every((item) => {
                  const medId = item.medicine_id || item.medicine;
                  return selectedBatch[medId];
                })}
                className="mt-5 w-full bg-red-500 hover:bg-red-600 disabled:bg-red-900/40 disabled:text-red-700 text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                {submitting ? "Processing..." : "Confirm Dispense & Create Bill"}
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Select batches for all medicines to proceed
              </p>
            </div>
          </div>
        </div>
      )}
    </PharmacistLayout>
  );
};