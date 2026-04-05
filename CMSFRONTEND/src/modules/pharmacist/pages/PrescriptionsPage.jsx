// //--------------------------------


// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import PharmacistLayout from "../components/PharmacistLayout";
// import {
//   getIncomingPrescriptions,
//   getPrescriptionDetail,
//   getBatches,
//   createDispense,
//   createMedicineBill,
// } from "../api/pharmacistApi";

// // ─── PRESCRIPTIONS LIST ───────────────────────────────────────────────────────
// export const PrescriptionsPage = () => {
//   const navigate = useNavigate();
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     getIncomingPrescriptions()
//       .then((res) => setPrescriptions(res.data || []))
//       .catch(() => setError("Failed to load prescriptions."))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <PharmacistLayout title="Incoming Prescriptions">
//       <div className="mb-4">
//         <p className="text-gray-400 text-sm">
//           {prescriptions.length} prescription(s) waiting for dispense
//         </p>
//       </div>

//       {error && (
//         <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       )}

//       <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead>
//               <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
//                 <th className="px-4 py-3 text-left">Rx Code</th>
//                 <th className="px-4 py-3 text-left">Patient</th>
//                 <th className="px-4 py-3 text-left">Doctor</th>
//                 <th className="px-4 py-3 text-left">Medicines</th>
//                 <th className="px-4 py-3 text-left">Status</th>
//                 <th className="px-4 py-3 text-left">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 [...Array(4)].map((_, i) => (
//                   <tr key={i} className="border-b border-[#1e2d4a]">
//                     {[...Array(6)].map((_, j) => (
//                       <td key={j} className="px-4 py-3">
//                         <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" />
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : prescriptions.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="text-center text-gray-500 py-12 text-sm">
//                     No pending prescriptions to dispense.
//                   </td>
//                 </tr>
//               ) : (
//                 prescriptions.map((rx) => (
//                   <tr
//                     key={rx.prescription_code}
//                     className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors"
//                   >
//                     <td className="px-4 py-3">
//                       <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
//                         {rx.prescription_code}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-white font-medium">{rx.patient_name || "—"}</td>
//                     <td className="px-4 py-3 text-gray-400">Dr. {rx.doctor_name || "—"}</td>
//                     <td className="px-4 py-3 text-gray-400">
//                       {rx.items?.map((i) => i.medicine_name).join(", ") || "—"}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded">
//                         {rx.status || "Sent"}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <button
//                         onClick={() => navigate(`/pharmacist/prescriptions/${rx.prescription_code}`)}
//                         className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition"
//                       >
//                         Dispense →
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </PharmacistLayout>
//   );
// };

// // ─── HELPERS ──────────────────────────────────────────────────────────────────
// const getPrescribedQty = (item) => {
//   const freq = parseInt(item.frequency, 10) || 1;
//   const duration = parseInt(item.duration, 10) || 1;
//   return freq * duration;
// };

// // ─── DISPENSE PAGE ────────────────────────────────────────────────────────────
// export const DispensePage = () => {
//   const { prescriptionCode } = useParams();
//   const navigate = useNavigate();

//   const [rx, setRx] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [discount, setDiscount] = useState(0);

//   // availableBatches: { [medId]: [ ...batchObjects ] }
//   const [availableBatches, setAvailableBatches] = useState({});

//   // dispenseQty: { [medId]: { [batchId]: number } }
//   // How many units to take from each batch for each medicine
//   const [dispenseQty, setDispenseQty] = useState({});

//   useEffect(() => {
//     getPrescriptionDetail(prescriptionCode)
//       .then(async (res) => {
//         const data = res.data;
//         setRx(data);

//         if (data.items) {
//           const batchMap = {};
//           const qtyMap = {};
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);

//           await Promise.all(
//             data.items.map(async (item) => {
//               const medId = item.medicine_id;
//               try {
//                 const bRes = await getBatches(medId);
//                 const allBatches = bRes.results || bRes.data || bRes || [];

//                 // Only non-expired batches with stock
//                 const valid = allBatches.filter((b) => {
//                   const expiry = new Date(b.expiry_date);
//                   expiry.setHours(0, 0, 0, 0);
//                   return b.quantity > 0 && expiry >= today;
//                 });

//                 batchMap[medId] = valid;

//                 // Default qty = 0 for every batch
//                 qtyMap[medId] = {};
//                 valid.forEach((b) => {
//                   qtyMap[medId][b.batch_id] = 0;
//                 });
//               } catch {
//                 batchMap[medId] = [];
//                 qtyMap[medId] = {};
//               }
//             })
//           );

//           setAvailableBatches(batchMap);
//           setDispenseQty(qtyMap);
//         }
//       })
//       .catch(() => setError("Prescription not found or already dispensed."))
//       .finally(() => setLoading(false));
//   }, [prescriptionCode]);

//   // ── Update qty for one (medicine, batch) pair ─────────────────────────────
//   const handleQtyChange = (medId, batchId, rawValue) => {
//     const batch = (availableBatches[medId] || []).find((b) => b.batch_id === batchId);
//     if (!batch) return;

//     const parsed = parseInt(rawValue, 10);
//     const value = isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed, batch.quantity));

//     setDispenseQty((prev) => ({
//       ...prev,
//       [medId]: { ...prev[medId], [batchId]: value },
//     }));
//   };

//   // ── Totals ────────────────────────────────────────────────────────────────
//   const getAllocatedQty = (medId) => {
//     const qMap = dispenseQty[medId] || {};
//     return Object.values(qMap).reduce((s, v) => s + (v || 0), 0);
//   };

//   const getMedicineLineTotal = (medId) => {
//     const batches = availableBatches[medId] || [];
//     const qMap = dispenseQty[medId] || {};
//     return batches.reduce(
//       (s, b) => s + (qMap[b.batch_id] || 0) * parseFloat(b.medicine_price || 0),
//       0
//     );
//   };

//   const calcTotal = () => {
//     if (!rx?.items) return 0;
//     return rx.items.reduce((sum, item) => sum + getMedicineLineTotal(item.medicine_id), 0);
//   };

//   // ── Validation ────────────────────────────────────────────────────────────
//   const getIssues = () => {
//     if (!rx?.items) return [];
//     const issues = [];
//     for (const item of rx.items) {
//       const medId = item.medicine_id;
//       const batches = availableBatches[medId] || [];
//       if (batches.length === 0) continue; // no stock — silently skip
//       const required = getPrescribedQty(item);
//       const allocated = getAllocatedQty(medId);
//       if (allocated === 0) {
//         issues.push(`${item.medicine_name}: no quantity entered`);
//       } else if (allocated < required) {
//         issues.push(`${item.medicine_name}: ${allocated}/${required} — need ${required - allocated} more`);
//       } else if (allocated > required) {
//         issues.push(`${item.medicine_name}: over-allocated by ${allocated - required} (max ${required})`);
//       }
//     }
//     return issues;
//   };

//   // ── Submit ────────────────────────────────────────────────────────────────
//   const handleDispense = async () => {
//     if (!rx) return;
//     const issues = getIssues();
//     if (issues.length > 0) {
//       setError(issues.join(" · "));
//       return;
//     }

//     setSubmitting(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Build flat items array — one entry per batch with qty > 0
//       const items = [];
//       for (const item of rx.items) {
//         const medId = item.medicine_id;
//         const batches = availableBatches[medId] || [];
//         const qMap = dispenseQty[medId] || {};
//         batches.forEach((b) => {
//           const qty = qMap[b.batch_id] || 0;
//           if (qty > 0) items.push({ batch: b.batch_id, quantity: qty });
//         });
//       }

//       if (items.length === 0) {
//         setError("No medicines selected for dispensing.");
//         setSubmitting(false);
//         return;
//       }

//       const dispenseRes = await createDispense({
//         prescription: rx.prescription_id || rx.id,
//         items,
//       });

//       const dispenseData = dispenseRes.data || dispenseRes;
//       const dispenseId = dispenseData.dispense_id;
//       const totalAmount = dispenseData.total_amount;

//       await createMedicineBill({
//         dispense: dispenseId,
//         total_amount: totalAmount,
//         discount: discount,
//         payment_status: "Pending",
//       });

//       setSuccess("✓ Dispensed successfully! Bill created.");
//       setTimeout(() => navigate("/pharmacist/prescriptions"), 2000);
//     } catch (err) {
//       const d = err?.response?.data;
//       const msg =
//         (Array.isArray(d?.items)
//           ? d.items.map((e) => (typeof e === "string" ? e : JSON.stringify(e))).join(", ")
//           : null) ||
//         d?.non_field_errors?.[0] ||
//         d?.detail ||
//         (typeof d === "object" ? JSON.stringify(d) : null) ||
//         "Failed to dispense.";
//       setError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Loading / not-found states ────────────────────────────────────────────
//   if (loading) {
//     return (
//       <PharmacistLayout title="Dispense Medicines">
//         <div className="flex items-center justify-center py-20">
//           <div className="text-gray-400 animate-pulse">Loading prescription...</div>
//         </div>
//       </PharmacistLayout>
//     );
//   }

//   if (!rx) {
//     return (
//       <PharmacistLayout title="Dispense Medicines">
//         <div className="text-center py-20">
//           <p className="text-red-400 mb-4">Prescription not found</p>
//           <button onClick={() => navigate("/pharmacist/prescriptions")} className="text-sm text-gray-400 hover:text-white">
//             ← Back
//           </button>
//         </div>
//       </PharmacistLayout>
//     );
//   }

//   const issues = getIssues();
//   const canSubmit = issues.length === 0;
//   const total = calcTotal();

//   return (
//     <PharmacistLayout title="Dispense Medicines">
//       <button
//         onClick={() => navigate("/pharmacist/prescriptions")}
//         className="mb-4 text-sm text-gray-400 hover:text-white transition flex items-center gap-1"
//       >
//         ← Back to Prescriptions
//       </button>

//       {error && (
//         <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
//           {error}
//         </div>
//       )}
//       {success && (
//         <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
//           {success}
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

//         {/* ── Left panel ───────────────────────────────────────────────────── */}
//         <div className="lg:col-span-2 space-y-4">

//           {/* Prescription info */}
//           <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-white font-semibold">Prescription Details</h3>
//               <span className="font-mono text-xs text-red-400 bg-red-400/10 px-2 py-1 rounded">
//                 {rx.prescription_code}
//               </span>
//             </div>
//             <div className="grid grid-cols-2 gap-3 text-sm">
//               <div>
//                 <p className="text-gray-500 text-xs">Patient</p>
//                 <p className="text-white">{rx.patient_name || "—"}</p>
//               </div>
//               <div>
//                 <p className="text-gray-500 text-xs">Doctor</p>
//                 <p className="text-white">Dr. {rx.doctor_name || "—"}</p>
//               </div>
//               {rx.diagnosis && (
//                 <div className="col-span-2">
//                   <p className="text-gray-500 text-xs">Diagnosis</p>
//                   <p className="text-white">{rx.diagnosis}</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* One card per medicine */}
//           {rx.items?.map((item) => {
//             const medId = item.medicine_id;
//             const batches = availableBatches[medId] || [];
//             const qMap = dispenseQty[medId] || {};
//             const required = getPrescribedQty(item);
//             const allocated = getAllocatedQty(medId);
//             const remaining = required - allocated;
//             const pct = Math.min((allocated / required) * 100, 100);

//             const statusText =
//               allocated === 0 ? "Nothing entered yet" :
//               allocated < required ? `${allocated} allocated · ${remaining} more needed` :
//               allocated === required ? "✓ Fully allocated" :
//               `⚠ Over-allocated by ${allocated - required}`;

//             const statusColor =
//               allocated === 0 ? "text-gray-500" :
//               allocated < required ? "text-yellow-400" :
//               allocated === required ? "text-green-400" : "text-red-400";

//             const barColor =
//               allocated > required ? "bg-red-500" :
//               allocated === required ? "bg-green-500" : "bg-red-400";

//             return (
//               <div key={medId} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">

//                 {/* Medicine header */}
//                 <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-start justify-between gap-4">
//                   <div className="flex-1 min-w-0">
//                     <p className="text-white font-semibold">{item.medicine_name}</p>
//                     <p className="text-xs text-gray-500 mt-0.5">
//                       {item.dosage} · {item.frequency}x/day · {item.duration} days
//                     </p>
//                     {item.instructions && (
//                       <p className="text-xs text-gray-400 mt-0.5">ℹ {item.instructions}</p>
//                     )}
//                   </div>
//                   <div className="text-right flex-shrink-0">
//                     <p className="text-xs text-gray-500">Prescribed</p>
//                     <p className="text-cyan-400 font-bold text-2xl leading-none">{required}</p>
//                     <p className="text-xs text-gray-600">units</p>
//                   </div>
//                 </div>

//                 {/* Progress */}
//                 <div className="px-5 py-3 border-b border-[#1e2d4a]">
//                   <div className="flex justify-between text-xs mb-1.5">
//                     <span className={statusColor}>{statusText}</span>
//                     <span className="text-gray-500 font-mono">{allocated} / {required}</span>
//                   </div>
//                   <div className="h-2 bg-[#1e2d4a] rounded-full overflow-hidden">
//                     <div
//                       className={`h-full rounded-full transition-all duration-300 ${barColor}`}
//                       style={{ width: `${pct}%` }}
//                     />
//                   </div>
//                 </div>

//                 {/* Batch table */}
//                 {batches.length === 0 ? (
//                   <div className="px-5 py-4">
//                     <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg">
//                       ⚠ No available stock for this medicine — all batches are either expired or out of stock
//                     </div>
//                   </div>
//                 ) : (
//                   <div>
//                     {/* Table header */}
//                     <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#060d1a] text-xs text-gray-500 uppercase tracking-wider border-b border-[#1e2d4a]">
//                       <div className="col-span-3">Batch #</div>
//                       <div className="col-span-3">Expiry</div>
//                       <div className="col-span-2 text-center">In Stock</div>
//                       <div className="col-span-2 text-right">Price/unit</div>
//                       <div className="col-span-2 text-right">Qty ↓</div>
//                     </div>

//                     {/* One row per batch */}
//                     {batches.map((batch) => {
//                       const qty = qMap[batch.batch_id] || 0;
//                       const lineTotal = qty * parseFloat(batch.medicine_price || 0);
//                       const isActive = qty > 0;

//                       return (
//                         <div
//                           key={batch.batch_id}
//                           className={`grid grid-cols-12 gap-2 px-5 py-3 items-center border-b border-[#1e2d4a] last:border-0 transition-colors ${
//                             isActive ? "bg-red-400/5" : "hover:bg-[#111d35]"
//                           }`}
//                         >
//                           {/* Batch number */}
//                           <div className="col-span-3">
//                             <span className={`font-mono text-xs px-2 py-1 rounded ${
//                               isActive
//                                 ? "text-red-300 bg-red-400/20 border border-red-400/30"
//                                 : "text-gray-400 bg-[#0d1629] border border-[#1e2d4a]"
//                             }`}>
//                               {batch.batch_number}
//                             </span>
//                           </div>

//                           {/* Expiry */}
//                           <div className="col-span-3 text-xs text-gray-400">
//                             {batch.expiry_date}
//                           </div>

//                           {/* Stock */}
//                           <div className="col-span-2 text-center">
//                             <span className={`text-sm font-semibold ${
//                               batch.quantity <= 10 ? "text-yellow-400" : "text-white"
//                             }`}>
//                               {batch.quantity}
//                             </span>
//                             {batch.quantity <= 10 && (
//                               <span className="ml-1 text-yellow-400 text-xs">⚠</span>
//                             )}
//                           </div>

//                           {/* Price */}
//                           <div className="col-span-2 text-right text-xs text-gray-400">
//                             ₹{parseFloat(batch.medicine_price || 0).toFixed(2)}
//                           </div>

//                           {/* Qty input */}
//                           <div className="col-span-2 flex flex-col items-end gap-0.5">
//                             <input
//                               type="number"
//                               min={0}
//                               max={batch.quantity}
//                               value={qty === 0 ? "" : qty}
//                               placeholder="0"
//                               onChange={(e) => handleQtyChange(medId, batch.batch_id, e.target.value)}
//                               className={`w-16 text-center text-sm rounded-lg px-2 py-1.5 outline-none border transition-colors ${
//                                 isActive
//                                   ? "bg-red-400/10 border-red-400/40 text-white"
//                                   : "bg-[#060d1a] border-[#1e2d4a] text-white focus:border-red-400/50"
//                               }`}
//                             />
//                             {isActive && (
//                               <span className="text-xs text-green-400 font-medium">
//                                 ₹{lineTotal.toFixed(2)}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}

//                     {/* Medicine footer total */}
//                     {allocated > 0 && (
//                       <div className="flex justify-between items-center px-5 py-2 bg-[#060d1a] border-t border-[#1e2d4a] text-xs">
//                         <span className="text-gray-500">
//                           Using {batches.filter((b) => (qMap[b.batch_id] || 0) > 0).length} of {batches.length} batch(es)
//                         </span>
//                         <span className="text-white font-semibold">
//                           ₹{getMedicineLineTotal(medId).toFixed(2)}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}

//           {/* Validation issues panel */}
//           {issues.length > 0 && (
//             <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
//               <p className="text-yellow-400 text-xs font-semibold mb-2">⚠ Fix before dispensing:</p>
//               <ul className="space-y-1">
//                 {issues.map((issue, i) => (
//                   <li key={i} className="text-yellow-300 text-xs flex gap-1.5">
//                     <span>•</span><span>{issue}</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>

//         {/* ── Right panel: Bill summary ─────────────────────────────────────── */}
//         <div>
//           <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 sticky top-24 space-y-4">
//             <h3 className="text-sm font-semibold text-white">Bill Summary</h3>

//             {/* Per-medicine line items */}
//             <div className="space-y-2">
//               {rx.items?.map((item) => {
//                 const medId = item.medicine_id;
//                 const required = getPrescribedQty(item);
//                 const allocated = getAllocatedQty(medId);
//                 const lineTotal = getMedicineLineTotal(medId);

//                 return (
//                   <div key={medId} className="flex items-center justify-between text-xs gap-2">
//                     <div className="flex-1 min-w-0">
//                       <p className="text-gray-300 truncate">{item.medicine_name}</p>
//                       <p className={`${
//                         allocated === 0 ? "text-gray-600" :
//                         allocated < required ? "text-yellow-400" :
//                         allocated === required ? "text-green-400" : "text-red-400"
//                       }`}>
//                         {allocated}/{required} units
//                       </p>
//                     </div>
//                     <span className="text-white font-medium flex-shrink-0">
//                       {lineTotal > 0 ? `₹${lineTotal.toFixed(2)}` : "—"}
//                     </span>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="border-t border-[#1e2d4a] pt-3 space-y-3 text-sm">
//               <div className="flex justify-between">
//                 <span className="text-gray-400">Subtotal</span>
//                 <span className="text-white font-medium">₹{total.toFixed(2)}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-400">Discount (₹)</span>
//                 <input
//                   type="number"
//                   min={0}
//                   max={total}
//                   value={discount}
//                   onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
//                   className="w-24 bg-[#060d1a] border border-[#1e2d4a] text-white text-xs rounded px-2 py-1 focus:border-red-400/50 outline-none text-right"
//                 />
//               </div>
//               <div className="border-t border-[#1e2d4a] pt-3 flex justify-between items-center">
//                 <span className="text-white font-semibold">Total</span>
//                 <span className="text-red-400 font-bold text-xl">
//                   ₹{Math.max(total - discount, 0).toFixed(2)}
//                 </span>
//               </div>
//             </div>

//             <button
//               onClick={handleDispense}
//               disabled={submitting || !canSubmit}
//               className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-900/40 disabled:text-red-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
//             >
//               {submitting ? "Processing..." : "Confirm Dispense & Create Bill"}
//             </button>

//             {!canSubmit && (
//               <p className="text-xs text-yellow-400 text-center">
//                 ⚠ Resolve issues to proceed
//               </p>
//             )}
//           </div>
//         </div>

//       </div>
//     </PharmacistLayout>
//   );
// };
//----------------------------------


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
      <div className="mb-4">
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
                    <td className="px-4 py-3 text-white font-medium">{rx.patient_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">Dr. {rx.doctor_name || "—"}</td>
                    <td className="px-4 py-3 text-gray-400">
                      {rx.items?.map((i) => i.medicine_name).join(", ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded">
                        {rx.status || "Sent"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/pharmacist/prescriptions/${rx.prescription_code}`)}
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

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const MAX_DISCOUNT_PERCENT = 50; // Maximum allowed discount: 50% of subtotal

const getPrescribedQty = (item) => {
  const freq = parseInt(item.frequency, 10) || 1;
  const duration = parseInt(item.duration, 10) || 1;
  return freq * duration;
};

// ─── DISPENSE PAGE ────────────────────────────────────────────────────────────
export const DispensePage = () => {
  const { prescriptionCode } = useParams();
  const navigate = useNavigate();

  const [rx, setRx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [discountError, setDiscountError] = useState(""); // separate discount error
  const [success, setSuccess] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountInput, setDiscountInput] = useState("0"); // raw string for input

  // availableBatches: { [medId]: [ ...batchObjects ] }
  const [availableBatches, setAvailableBatches] = useState({});

  // dispenseQty: { [medId]: { [batchId]: number } }
  const [dispenseQty, setDispenseQty] = useState({});
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

        if (data.items) {
          const batchMap = {};
          const qtyMap = {};
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          await Promise.all(
            data.items.map(async (item) => {
              const medId = item.medicine_id;
              try {
                const bRes = await getBatches(medId);
                const allBatches = bRes.results || bRes.data || bRes || [];

                const valid = allBatches.filter((b) => {
                  const expiry = new Date(b.expiry_date);
                  expiry.setHours(0, 0, 0, 0);
                  return b.quantity > 0 && expiry >= today;
                });

                batchMap[medId] = valid;
                qtyMap[medId] = {};
                valid.forEach((b) => { qtyMap[medId][b.batch_id] = 0; });
              } catch {
                batchMap[medId] = [];
                qtyMap[medId] = {};
              }
            })
          );

          setAvailableBatches(batchMap);
          setDispenseQty(qtyMap);
        }
      })
      .catch(() => setError("Prescription not found or already dispensed."))
      .finally(() => setLoading(false));
  }, [prescriptionCode]);

  // ── Qty helpers ───────────────────────────────────────────────────────────
  const handleQtyChange = (medId, batchId, rawValue) => {
    const batch = (availableBatches[medId] || []).find((b) => b.batch_id === batchId);
    if (!batch) return;
    const parsed = parseInt(rawValue, 10);
    const value = isNaN(parsed) ? 0 : Math.max(0, Math.min(parsed, batch.quantity));
    setDispenseQty((prev) => ({
      ...prev,
      [medId]: { ...prev[medId], [batchId]: value },
    }));
  };
  
  const getAllocatedQty = (medId) => {
    return Object.values(dispenseQty[medId] || {}).reduce((s, v) => s + (v || 0), 0);
  };
  const getTotalAvailableQty = (medId) => {
  return (availableBatches[medId] || []).reduce(
    (sum, batch) => sum + (batch.quantity || 0),
    0
  );
};
  const getMedicineLineTotal = (medId) => {
    const batches = availableBatches[medId] || [];
    const qMap = dispenseQty[medId] || {};
    return batches.reduce(
      (s, b) => s + (qMap[b.batch_id] || 0) * parseFloat(b.medicine_price || 0),
      0
    );
  };

  const calcSubtotal = () => {
    if (!rx?.items) return 0;
    return rx.items.reduce((sum, item) => sum + getMedicineLineTotal(item.medicine_id), 0);
  };

  // ── Discount handling with 50% cap ────────────────────────────────────────
  const maxAllowedDiscount = (subtotal) => parseFloat(((subtotal * MAX_DISCOUNT_PERCENT) / 100).toFixed(2));

  const handleDiscountChange = (rawValue) => {
    setDiscountInput(rawValue);
    const parsed = parseFloat(rawValue);
    const subtotal = calcSubtotal();

    if (rawValue === "" || isNaN(parsed) || parsed < 0) {
      setDiscount(0);
      setDiscountError("");
      return;
    }

    const maxDisc = maxAllowedDiscount(subtotal);

    if (parsed > maxDisc) {
      setDiscountError(
        `Discount cannot exceed ${MAX_DISCOUNT_PERCENT}% of the subtotal. Maximum allowed: ₹${maxDisc.toFixed(2)}`
      );
      // Still store the entered value so user can see what they typed, but mark invalid
      setDiscount(parsed);
    } else {
      setDiscountError("");
      setDiscount(parsed);
    }
  };

  const isDiscountValid = () => {
    const subtotal = calcSubtotal();
    if (discount < 0) return false;
    if (discount > maxAllowedDiscount(subtotal)) return false;
    return true;
  };

  // ── Medicine qty validation ───────────────────────────────────────────────
  // const getQtyIssues = () => {
  //   if (!rx?.items) return [];
  //   const issues = [];
  //   for (const item of rx.items) {
  //     const medId = item.medicine_id;
  //     const batches = availableBatches[medId] || [];
  //     if (batches.length === 0) continue;
  //     const required = getPrescribedQty(item);
  //     const allocated = getAllocatedQty(medId);
  //     if (allocated === 0) {
  //       issues.push(`${item.medicine_name}: no quantity entered`);
  //     } else if (allocated < required) {
  //       issues.push(`${item.medicine_name}: ${allocated}/${required} — need ${required - allocated} more`);
  //     } else if (allocated > required) {
  //       issues.push(`${item.medicine_name}: over-allocated by ${allocated - required} (max ${required})`);
  //     }
  //   }
  //   return issues;
  // };
  const getQtyIssues = () => {
  if (!rx?.items) return [];

  const issues = [];

  for (const item of rx.items) {
    const medId = item.medicine_id;
    const batches = availableBatches[medId] || [];
    if (batches.length === 0) continue;

    const required = getPrescribedQty(item);
    const allocated = getAllocatedQty(medId);
    const totalAvailable = getTotalAvailableQty(medId);

    if (allocated === 0) {
      issues.push(`${item.medicine_name}: no quantity entered`);
      continue;
    }

    if (allocated > required) {
      issues.push(
        `${item.medicine_name}: over-allocated by ${allocated - required} (max ${required})`
      );
      continue;
    }

    // Stock is enough -> must fully allocate prescribed quantity
    if (totalAvailable >= required && allocated < required) {
      issues.push(
        `${item.medicine_name}: ${allocated}/${required} — need ${required - allocated} more`
      );
      continue;
    }

    // Stock is not enough -> allow only if pharmacist dispenses all available stock
    if (totalAvailable < required && allocated < totalAvailable) {
      issues.push(
        `${item.medicine_name}: only ${totalAvailable} available, allocate all available stock`
      );
      continue;
    }
  }

  return issues;
};
  // ── Submit ────────────────────────────────────────────────────────────────
  const handleDispense = async () => {
    if (!rx) return;

    // 1. Validate quantities
    const qtyIssues = getQtyIssues();
    if (qtyIssues.length > 0) {
      setError(qtyIssues.join(" · "));
      return;
    }

    // 2. Validate discount BEFORE any API call
    if (!isDiscountValid()) {
      const subtotal = calcSubtotal();
      const maxDisc = maxAllowedDiscount(subtotal);
      setDiscountError(
        `Discount cannot exceed ${MAX_DISCOUNT_PERCENT}% of the subtotal. Maximum allowed: ₹${maxDisc.toFixed(2)}`
      );
      setError("Please fix the discount amount before dispensing.");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    // 3. Build items array
    const items = [];
    for (const item of rx.items) {
      const medId = item.medicine_id;
      const batches = availableBatches[medId] || [];
      const qMap = dispenseQty[medId] || {};
      batches.forEach((b) => {
        const qty = qMap[b.batch_id] || 0;
        if (qty > 0) items.push({ batch: b.batch_id, quantity: qty });
      });
    }

    if (items.length === 0) {
      setError("No medicines selected for dispensing.");
      setSubmitting(false);
      return;
    }

    try {
      // 4. Create dispense
      const dispenseRes = await createDispense({
        prescription: rx.prescription_id || rx.id,
        items,
      });

      const dispenseData = dispenseRes.data || dispenseRes;
      const dispenseId = dispenseData.dispense_id;
      const totalAmount = parseFloat(dispenseData.total_amount);
      const finalDiscount = Math.min(discount, maxAllowedDiscount(totalAmount));

      // 5. Create bill — if this fails we show the error but dispense is already done
      //    so we navigate to bills page so user can see and fix
      try {
        await createMedicineBill({
          dispense: dispenseId,
          total_amount: totalAmount,
          discount: finalDiscount,
          payment_status: "Pending",
        });
        setSuccess("✓ Dispensed successfully! Bill created.");
        setTimeout(() => navigate("/pharmacist/prescriptions"), 2000);
      } catch (billErr) {
        // Dispense succeeded but bill failed — alert user and redirect to bills
        const d = billErr?.response?.data;
        const billMsg =
          d?.non_field_errors?.[0] ||
          d?.detail ||
          (typeof d === "object" ? JSON.stringify(d) : null) ||
          "Bill creation failed.";
        setError(
          `Medicines were dispensed (ID: ${dispenseId}) but bill creation failed: ${billMsg}. ` +
          `Please go to Bills page and create the bill manually for Dispense #${dispenseId}.`
        );
        setSubmitting(false);
      }
    } catch (err) {
      const d = err?.response?.data;
      const msg =
        (Array.isArray(d?.items)
          ? d.items.map((e) => (typeof e === "string" ? e : JSON.stringify(e))).join(", ")
          : null) ||
        d?.non_field_errors?.[0] ||
        d?.detail ||
        (typeof d === "object" ? JSON.stringify(d) : null) ||
        "Failed to dispense.";
      setError(msg);
      setSubmitting(false);
    }
  };

  // ── Loading / not-found ───────────────────────────────────────────────────
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
          <button onClick={() => navigate("/pharmacist/prescriptions")} className="text-sm text-gray-400 hover:text-white">
            ← Back
          </button>
        </div>
      </PharmacistLayout>
    );
  }

  const qtyIssues = getQtyIssues();
  const subtotal = calcSubtotal();
  const maxDisc = maxAllowedDiscount(subtotal);
  const discountOk = isDiscountValid();
  const canSubmit = qtyIssues.length === 0 && discountOk;
  const finalTotal = Math.max(subtotal - (discountOk ? discount : 0), 0);

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

        {/* ── Left panel ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Prescription info */}
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

          {/* One card per medicine */}
          {rx.items?.map((item) => {
            const medId = item.medicine_id;
            const batches = availableBatches[medId] || [];
            const qMap = dispenseQty[medId] || {};
            // const required = getPrescribedQty(item);
            // const allocated = getAllocatedQty(medId);
            // const remaining = required - allocated;
            // const pct = Math.min((allocated / required) * 100, 100);
            const required = getPrescribedQty(item);
            const allocated = getAllocatedQty(medId);
            const totalAvailable = getTotalAvailableQty(medId);
            const remaining = required - allocated;
            const pct = Math.min((allocated / required) * 100, 100);
            const stockInsufficient = totalAvailable < required;
            const fullyAllocatedForCurrentStock =
              stockInsufficient ? allocated === totalAvailable : allocated === required;
              const statusText =
              allocated === 0
                ? "Nothing entered yet"
                : allocated > required
                ? `⚠ Over-allocated by ${allocated - required}`
                : stockInsufficient
                ? allocated === totalAvailable
                  ? `✓ Partial dispense: ${allocated}/${required} (all available stock allocated)`
                  : `${allocated} allocated · ${totalAvailable - allocated} more available`
                : allocated === required
                ? "✓ Fully allocated"
                : `${allocated} allocated · ${remaining} more needed`;

            const statusColor =
              allocated === 0
                ? "text-gray-500"
                : allocated > required
                ? "text-red-400"
                : fullyAllocatedForCurrentStock
                ? "text-green-400"
                : "text-yellow-400";

            const barColor =
              allocated > required
                ? "bg-red-500"
                : fullyAllocatedForCurrentStock
                ? "bg-green-500"
                : "bg-red-400";
            // const statusText =
            //   allocated === 0 ? "Nothing entered yet" :
            //   allocated < required ? `${allocated} allocated · ${remaining} more needed` :
            //   allocated === required ? "✓ Fully allocated" :
            //   `⚠ Over-allocated by ${allocated - required}`;

            // const statusColor =
            //   allocated === 0 ? "text-gray-500" :
            //   allocated < required ? "text-yellow-400" :
            //   allocated === required ? "text-green-400" : "text-red-400";

            // const barColor =
            //   allocated > required ? "bg-red-500" :
              //allocated === required ? "bg-green-500" : "bg-red-400";

            return (
              <div key={medId} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">

                {/* Medicine header */}
                <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold">{item.medicine_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {item.dosage} · {item.frequency}x/day · {item.duration} days
                    </p>
                    {item.instructions && (
                      <p className="text-xs text-gray-400 mt-0.5">ℹ {item.instructions}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-500">Prescribed</p>
                    <p className="text-cyan-400 font-bold text-2xl leading-none">{required}</p>
                    <p className="text-xs text-gray-600">units</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="px-5 py-3 border-b border-[#1e2d4a]">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className={statusColor}>{statusText}</span>
                    <span className="text-gray-500 font-mono">{allocated} / {required}</span>
                  </div>
                  <div className="h-2 bg-[#1e2d4a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* Batch table */}
                {batches.length === 0 ? (
                  <div className="px-5 py-4">
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg">
                      ⚠ No available stock for this medicine — all batches are expired or out of stock
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Table header */}
                    <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-[#060d1a] text-xs text-gray-500 uppercase tracking-wider border-b border-[#1e2d4a]">
                      <div className="col-span-3">Batch #</div>
                      <div className="col-span-3">Expiry</div>
                      <div className="col-span-2 text-center">In Stock</div>
                      <div className="col-span-2 text-right">Price/unit</div>
                      <div className="col-span-2 text-right">Qty ↓</div>
                    </div>

                    {batches.map((batch) => {
                      const qty = qMap[batch.batch_id] || 0;
                      const lineTotal = qty * parseFloat(batch.medicine_price || 0);
                      const isActive = qty > 0;

                      return (
                        <div
                          key={batch.batch_id}
                          className={`grid grid-cols-12 gap-2 px-5 py-3 items-center border-b border-[#1e2d4a] last:border-0 transition-colors ${
                            isActive ? "bg-red-400/5" : "hover:bg-[#111d35]"
                          }`}
                        >
                          <div className="col-span-3">
                            <span className={`font-mono text-xs px-2 py-1 rounded ${
                              isActive
                                ? "text-red-300 bg-red-400/20 border border-red-400/30"
                                : "text-gray-400 bg-[#0d1629] border border-[#1e2d4a]"
                            }`}>
                              {batch.batch_number}
                            </span>
                          </div>
                          <div className="col-span-3 text-xs text-gray-400">{batch.expiry_date}</div>
                          <div className="col-span-2 text-center">
                            <span className={`text-sm font-semibold ${batch.quantity <= 10 ? "text-yellow-400" : "text-white"}`}>
                              {batch.quantity}
                            </span>
                            {batch.quantity <= 10 && <span className="ml-1 text-yellow-400 text-xs">⚠</span>}
                          </div>
                          <div className="col-span-2 text-right text-xs text-gray-400">
                            ₹{parseFloat(batch.medicine_price || 0).toFixed(2)}
                          </div>
                          <div className="col-span-2 flex flex-col items-end gap-0.5">
                            <input
                              type="number"
                              min={0}
                              max={batch.quantity}
                              value={qty === 0 ? "" : qty}
                              placeholder="0"
                              onChange={(e) => handleQtyChange(medId, batch.batch_id, e.target.value)}
                              className={`w-16 text-center text-sm rounded-lg px-2 py-1.5 outline-none border transition-colors ${
                                isActive
                                  ? "bg-red-400/10 border-red-400/40 text-white"
                                  : "bg-[#060d1a] border-[#1e2d4a] text-white focus:border-red-400/50"
                              }`}
                            />
                            {isActive && (
                              <span className="text-xs text-green-400 font-medium">
                                ₹{lineTotal.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Medicine footer */}
                    {allocated > 0 && (
                      <div className="flex justify-between items-center px-5 py-2 bg-[#060d1a] border-t border-[#1e2d4a] text-xs">
                        <span className="text-gray-500">
                          Using {batches.filter((b) => (qMap[b.batch_id] || 0) > 0).length} of {batches.length} batch(es)
                        </span>
                        <span className="text-white font-semibold">
                          ₹{getMedicineLineTotal(medId).toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Qty issues panel */}
          {qtyIssues.length > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-yellow-400 text-xs font-semibold mb-2">⚠ Fix before dispensing:</p>
              <ul className="space-y-1">
                {qtyIssues.map((issue, i) => (
                  <li key={i} className="text-yellow-300 text-xs flex gap-1.5">
                    <span>•</span><span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── Right panel: Bill summary ─────────────────────────────────────── */}
        <div>
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 sticky top-24 space-y-4">
            <h3 className="text-sm font-semibold text-white">Bill Summary</h3>

            {/* Per-medicine line items */}
            <div className="space-y-2">
              {rx.items?.map((item) => {
                const medId = item.medicine_id;
                const required = getPrescribedQty(item);
                const allocated = getAllocatedQty(medId);
                const lineTotal = getMedicineLineTotal(medId);
                return (
                  <div key={medId} className="flex items-center justify-between text-xs gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-300 truncate">{item.medicine_name}</p>
                      {/* <p className={`${
                        allocated === 0 ? "text-gray-600" :
                        allocated < required ? "text-yellow-400" :
                        allocated === required ? "text-green-400" : "text-red-400"
                      }`}>
                        {allocated}/{required} units
                      </p> */}
                      <p
                        className={`${
                          (() => {
                            const totalAvailable = getTotalAvailableQty(medId);
                            const stockInsufficient = totalAvailable < required;
                            const ok = stockInsufficient
                              ? allocated === totalAvailable
                              : allocated === required;

                            return allocated === 0
                              ? "text-gray-600"
                              : allocated > required
                              ? "text-red-400"
                              : ok
                              ? "text-green-400"
                              : "text-yellow-400";
                          })()
                        }`}
                      >
                        {allocated}/{required} units
                      </p>
                    </div>
                    <span className="text-white font-medium flex-shrink-0">
                      {lineTotal > 0 ? `₹${lineTotal.toFixed(2)}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#1e2d4a] pt-3 space-y-3 text-sm">

              {/* Subtotal */}
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
              </div>

              {/* Discount input with 50% cap indicator */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-gray-400 text-sm">Discount (₹)</span>
                    <p className="text-xs text-gray-600">
                      Max {MAX_DISCOUNT_PERCENT}% — up to ₹{maxDisc.toFixed(2)}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    max={maxDisc}
                    value={discountInput}
                    onChange={(e) => handleDiscountChange(e.target.value)}
                    className={`w-24 text-xs rounded px-2 py-1.5 outline-none text-right border transition-colors ${
                      discountError
                        ? "bg-red-500/10 border-red-400/60 text-red-300"
                        : "bg-[#060d1a] border-[#1e2d4a] text-white focus:border-red-400/50"
                    }`}
                  />
                </div>

                {/* Discount error message */}
                {discountError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                    <p className="text-red-400 text-xs">{discountError}</p>
                    <p className="text-red-300 text-xs mt-1 font-medium">
                      Please enter ₹{maxDisc.toFixed(2)} or less.
                    </p>
                  </div>
                )}

                {/* Discount % indicator when valid and non-zero */}
                {!discountError && discount > 0 && subtotal > 0 && (
                  <p className="text-xs text-green-400 text-right">
                    {((discount / subtotal) * 100).toFixed(1)}% discount applied
                  </p>
                )}
              </div>

              {/* Total */}
              <div className="border-t border-[#1e2d4a] pt-3 flex justify-between items-center">
                <span className="text-white font-semibold">Total</span>
                <span className={`font-bold text-xl ${discountError ? "text-gray-500" : "text-red-400"}`}>
                  ₹{discountError ? subtotal.toFixed(2) : finalTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              onClick={handleDispense}
              disabled={submitting || !canSubmit || billingBlocked}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-900/40 disabled:text-red-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition text-sm"
            >
              {submitting ? "Processing..." : "Confirm Dispense & Create Bill"}
            </button>

            {billingBlocked && (
              <p className="text-xs text-red-400 mt-2 text-center">
                🚫 Billing must be paid before dispensing
              </p>
            )}
            {!billingBlocked && !canSubmit && (
              <p className="text-xs text-yellow-400 text-center">
                {discountError ? "⚠ Fix discount to proceed" : "⚠ Resolve issues to proceed"}
              </p>
            )}
          </div>
        </div>

      </div>
    </PharmacistLayout>
  );
};
