// import React, { useEffect, useState } from "react";
// import LabLayout from "../components/LabLayout";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   getLabResults,
//   createLabResult,
//   updateLabResult,
//   deleteLabResult,
//   getLabBills,
//   getLabOrders,
//   getLabRequests,
//   getLabTests,
// } from "../api/labApi";

// const buildPatientMap = (reqs) => {
//   const map = {};
//   reqs.forEach((r) => {
//     if (r.lab_request_id && r.patient_name) map[r.lab_request_id] = r.patient_name;
//   });
//   return map;
// };

// const escapeHtml = (value) =>
//   String(value ?? "")
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/\"/g, "&quot;")
//     .replace(/'/g, "&#39;");

// const parseRangeRule = (normalRangeText) => {
//   const text = String(normalRangeText || "").trim();
//   if (!text) return null;

//   const betweenMatch = text.match(/(-?\d+(?:\.\d+)?)\s*[–-]\s*(-?\d+(?:\.\d+)?)/);
//   if (betweenMatch) {
//     return {
//       type: "between",
//       min: parseFloat(betweenMatch[1]),
//       max: parseFloat(betweenMatch[2]),
//       raw: text,
//     };
//   }

//   const comparatorMatch = text.match(/(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)/);
//   if (comparatorMatch) {
//     return {
//       type: comparatorMatch[1],
//       value: parseFloat(comparatorMatch[2]),
//       raw: text,
//     };
//   }

//   return null;
// };

// const validateResultValue = (rawValue, normalRangeText) => {
//   const rule = parseRangeRule(normalRangeText);
//   if (!rule) return { error: "", warning: "" };

//   const value = String(rawValue || "").trim();
//   const numericPattern = /^-?\d+(?:\.\d+)?$/;
//   if (!numericPattern.test(value)) {
//     return {
//       error: "This test expects a numeric result (example: 4.8).",
//       warning: "",
//     };
//   }

//   const numericValue = parseFloat(value);
//   let outOfRange = false;

//   if (rule.type === "between") {
//     outOfRange = numericValue < rule.min || numericValue > rule.max;
//   } else if (rule.type === "<") {
//     outOfRange = !(numericValue < rule.value);
//   } else if (rule.type === "<=") {
//     outOfRange = !(numericValue <= rule.value);
//   } else if (rule.type === ">") {
//     outOfRange = !(numericValue > rule.value);
//   } else if (rule.type === ">=") {
//     outOfRange = !(numericValue >= rule.value);
//   }

//   return {
//     error: "",
//     warning: outOfRange
//       ? `Result ${numericValue} is outside reference range (${rule.raw}). You can still save if clinically intended.`
//       : "",
//   };
// };

// const ResultForm = ({ item, existingResult, labMeta, onSaved, onCancel }) => {
//   const [form, setForm] = useState({
//     lab_order_item: item.order_item_id,
//     result_value: existingResult?.result_value || "",
//     remarks: existingResult?.remarks || "",
//     is_critical: existingResult?.is_critical || false,
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [warning, setWarning] = useState("");

//   const handleSubmit = async () => {
//     if (!form.result_value.trim()) { setError("Result value is required."); return; }

//     const validation = validateResultValue(form.result_value, labMeta?.normal_range);
//     if (validation.error) {
//       setError(validation.error);
//       return;
//     }

//     setWarning(validation.warning || "");
//     setSubmitting(true);
//     setError("");
//     try {
//       if (existingResult) {
//         await updateLabResult(existingResult.result_id, form);
//       } else {
//         await createLabResult(form);
//       }
//       onSaved();
//     } catch (err) {
//       const data = err?.response?.data;
//       setError(
//         data?.result_value?.[0] || data?.lab_order_item?.[0] ||
//         data?.non_field_errors?.[0] || data?.detail || "Failed to save result."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const inp = "w-full bg-[#0a1628] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition";

//   return (
//     <div className="mt-3 bg-[#060d1a] border border-cyan-400/30 rounded-xl p-4 space-y-3">
//       {error && <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">{error}</div>}
//       {warning && <div className="text-yellow-300 text-xs bg-yellow-400/10 border border-yellow-400/30 px-3 py-2 rounded-lg">{warning}</div>}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <div>
//           <label className="text-xs text-gray-400 block mb-1">Result Value *</label>
//           <input type="text" value={form.result_value}
//             onChange={(e) => setForm({ ...form, result_value: e.target.value })}
//             placeholder="e.g. 12.5 g/dL, Negative, Normal" className={inp} autoFocus />
//           {(labMeta?.unit || labMeta?.normal_range) && (
//             <p className="text-[11px] text-gray-500 mt-1">
//               {labMeta?.unit ? `Unit: ${labMeta.unit}` : ""}
//               {labMeta?.unit && labMeta?.normal_range ? " | " : ""}
//               {labMeta?.normal_range ? `Reference: ${labMeta.normal_range}` : ""}
//             </p>
//           )}
//         </div>
//         <div>
//           <label className="text-xs text-gray-400 block mb-1">Remarks (optional)</label>
//           <input type="text" value={form.remarks}
//             onChange={(e) => setForm({ ...form, remarks: e.target.value })}
//             placeholder="Any additional notes…" className={inp} />
//         </div>
//       </div>
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <label className="flex items-center gap-2 cursor-pointer select-none">
//           <input type="checkbox" checked={form.is_critical}
//             onChange={(e) => setForm({ ...form, is_critical: e.target.checked })}
//             className="accent-red-400 w-3.5 h-3.5" />
//           <span className="text-xs text-gray-400">Mark as Critical ⚠</span>
//         </label>
//         <div className="flex gap-2">
//           <button type="button" onClick={onCancel}
//             className="px-4 py-1.5 text-xs text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
//           <button type="button" onClick={handleSubmit} disabled={submitting}
//             className="px-5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition disabled:opacity-50 flex items-center gap-1.5">
//             {submitting && <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
//             {submitting ? "Saving…" : existingResult ? "Update" : "Save Result"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const OrderCard = ({
//   order,
//   resultMap,
//   onRefresh,
//   billedOrderIds,
//   onPrintReport,
//   getItemLabMeta,
// }) => {
//   const [openItemId, setOpenItemId] = useState(null);
//   const items = order.items || [];
//   const total = items.length;
//   const done = items.filter((it) => resultMap[it.order_item_id]).length;
//   const allDone = total > 0 && done === total;

//   // Billing gate: only allow result entry if the lab order has a paid bill
//   const isBillingPaid = billedOrderIds?.has(order.order_id);
//   const billingBlocked = !isBillingPaid;

//   const handleDelete = async (resultId) => {
//     if (!window.confirm("Delete this result?")) return;
//     try { await deleteLabResult(resultId); onRefresh(); }
//     catch { alert("Failed to delete result."); }
//   };

//   if (total === 0) {
//     return (
//       <div className="bg-[#0d1629] border border-orange-400/20 rounded-xl p-5">
//         <div className="flex items-start justify-between flex-wrap gap-3">
//           <div>
//             <div className="flex items-center gap-2 mb-1">
//               <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{order.order_number}</span>
//               <span className="text-white text-sm font-semibold">{order.patient_name || `Patient #${order.patient}`}</span>
//             </div>
//             <p className="text-xs text-gray-500">
//               {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
//             </p>
//           </div>
//           <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg px-4 py-2 text-xs text-orange-300 max-w-xs">
//             <p className="font-semibold mb-1">⚠ No test items found</p>
//             <p className="text-orange-400/70">This order has no test items. This can happen if the backend didn't attach tests when the order was created. Please delete this order and re-accept the doctor's request to regenerate it correctly.</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`bg-[#0d1629] border rounded-xl overflow-hidden ${allDone ? "border-green-400/30" : billingBlocked ? "border-orange-400/30" : "border-[#1e2d4a]"}`}>
//       <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between gap-3 flex-wrap">
//         <div className="flex items-center gap-3 flex-wrap">
//           <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{order.order_number}</span>
//           <span className="text-white font-semibold text-sm">{order.patient_name || `Patient #${order.patient}`}</span>
//           <span className="text-xs text-gray-500">
//             {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
//           </span>
//         </div>
//         <div className="flex items-center gap-3">
//           <span className="text-xs text-gray-400">{done}/{total} done</span>
//           <span className={`text-xs px-2 py-1 rounded border ${allDone ? "bg-green-400/10 text-green-400 border-green-400/30" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"}`}>
//             {allDone ? "✓ Completed" : "Pending"}
//           </span>
//           {allDone && (
//             <button
//               type="button"
//               onClick={() => onPrintReport(order)}
//               className="text-xs px-3 py-1.5 rounded-lg border border-blue-400/40 text-blue-300 hover:text-blue-200 transition"
//             >
//               Print Report
//             </button>
//           )}
//           {billingBlocked && (
//             <span className="text-xs px-2 py-1 rounded border bg-orange-400/10 text-orange-400 border-orange-400/30">
//               💳 Bill Pending
//             </span>
//           )}
//         </div>
//       </div>

//       {/* ─── BILLING GATE BANNER ─── */}
//       {billingBlocked && (
//         <div className="mx-4 mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-300">
//           <span className="text-xl leading-none mt-0.5">🚫</span>
//           <div>
//             <p className="text-xs font-semibold">Results Blocked — Billing Not Paid</p>
//             <p className="text-xs text-orange-400/80 mt-0.5">
//               Lab results can only be entered after the patient's consultation bill has been paid. Please ask the receptionist to complete billing first.
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="h-1 bg-[#1e2d4a]">
//         <div className="h-1 bg-cyan-400 transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
//       </div>
//       <div className="p-4 space-y-2">
//         {items.map((item) => {
//           const result = resultMap[item.order_item_id];
//           const labMeta = getItemLabMeta(item);
//           const isOpen = openItemId === item.order_item_id;
//           return (
//             <div key={item.order_item_id} className="bg-[#060d1a] rounded-xl p-4">
//               <div className="flex items-center justify-between gap-3 flex-wrap">
//                 <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
//                   <span className="text-xs text-purple-300 bg-purple-400/10 border border-purple-400/20 px-2.5 py-1 rounded-lg flex-shrink-0">
//                     🧪 {item.lab_test_name || `Test #${item.lab_test}`}
//                   </span>
//                   {result ? (
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className="text-sm text-white font-semibold">{result.result_value}</span>
//                       {result.is_critical && <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/30 px-2 py-0.5 rounded">⚠ Critical</span>}
//                       {result.remarks && <span className="text-xs text-gray-400 italic">— {result.remarks}</span>}
//                     </div>
//                   ) : <span className="text-xs text-gray-500 italic">No result yet</span>}
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0">
//                   {result ? (
//                     <>
//                       <button
//                         onClick={() => !billingBlocked && setOpenItemId(isOpen ? null : item.order_item_id)}
//                         disabled={billingBlocked}
//                         className={`text-xs border px-3 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-600" : "text-cyan-400 hover:text-cyan-300 border-cyan-400/30"}`}
//                       >
//                         {isOpen ? "Cancel" : "Edit"}
//                       </button>
//                       <button
//                         onClick={() => !billingBlocked && handleDelete(result.result_id)}
//                         disabled={billingBlocked}
//                         className={`text-xs border px-3 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-600" : "text-red-400 hover:text-red-300 border-red-400/30"}`}
//                       >
//                         Del
//                       </button>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => !billingBlocked && setOpenItemId(isOpen ? null : item.order_item_id)}
//                       disabled={billingBlocked}
//                       className={`text-xs font-bold px-4 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed bg-gray-700 text-gray-500" : "text-black bg-cyan-400 hover:bg-cyan-300"}`}
//                     >
//                       {billingBlocked ? "🔒 Billing Pending" : isOpen ? "Cancel" : "+ Enter Result"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//               {isOpen && !billingBlocked && (
//                 <ResultForm item={item} existingResult={result || null} labMeta={labMeta}
//                   onSaved={() => { setOpenItemId(null); onRefresh(); }}
//                   onCancel={() => setOpenItemId(null)} />
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// const LabResultsPage = () => {
//   const { user } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [results, setResults] = useState([]);
//   const [bills, setBills] = useState([]);
//   const [labTestsById, setLabTestsById] = useState({});
//   const [labTestsByName, setLabTestsByName] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [filter, setFilter] = useState("Pending");

//   const fetchAll = () => {
//     setLoading(true);
//     setError("");
//     Promise.all([getLabOrders(), getLabResults(), getLabRequests(), getLabBills(), getLabTests()])
//       .then(([oRes, rRes, reqRes, bRes, tRes]) => {
//         const rawOrders = oRes.data || [];
//         const reqs = reqRes.data || [];
//         const tests = tRes.data || [];

//         const testsMapById = tests.reduce((acc, t) => {
//           if (t?.lab_test_id != null) acc[t.lab_test_id] = t;
//           return acc;
//         }, {});

//         const testsMapByName = tests.reduce((acc, t) => {
//           const key = String(t?.test_name || "").trim().toLowerCase();
//           if (key) acc[key] = t;
//           return acc;
//         }, {});

//         setLabTestsById(testsMapById);
//         setLabTestsByName(testsMapByName);

//         const patientMap = buildPatientMap(reqs);
//         const enriched = rawOrders.map((o) => ({
//           ...o,
//           patient_name: o.patient_name || patientMap[o.lab_request] || null,
//         }));
//         setOrders(enriched);
//         setResults(rRes.data || []);
//         setBills(bRes.data || []);
//       })
//       .catch(() => setError("Failed to load data."))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => { fetchAll(); }, []);

//   const getItemLabMeta = (item) => {
//     const byId = labTestsById[item?.lab_test];
//     if (byId) return byId;

//     const key = String(item?.lab_test_name || "").trim().toLowerCase();
//     return key ? labTestsByName[key] : null;
//   };

//   const handlePrintReport = (order) => {
//     const generatedBy = user?.first_name
//       ? `${user.first_name} ${user.last_name || ""}`.trim()
//       : user?.username || "Lab Technician";

//     const items = order.items || [];
//     const rows = items.map((item, index) => {
//       const result = resultMap[item.order_item_id];
//       const meta = getItemLabMeta(item);

//       return `
//         <tr>
//           <td>${index + 1}</td>
//           <td>${escapeHtml(item.lab_test_name || `Test #${item.lab_test}`)}</td>
//           <td>${escapeHtml(result?.result_value || "--")}</td>
//           <td>${escapeHtml(meta?.unit || "--")}</td>
//           <td>${escapeHtml(meta?.normal_range || "--")}</td>
//         </tr>
//       `;
//     }).join("");

//     const reportDate = new Date().toLocaleDateString("en-IN", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });

//     const html = `
//       <!doctype html>
//       <html>
//       <head>
//         <meta charset="utf-8" />
//         <title>Lab Report ${escapeHtml(order.order_number)}</title>
//         <style>
//           @page { size: A4; margin: 14mm; }
//           body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 0; }
//           .report { border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; }
//           .top { display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
//           .title { font-size: 24px; font-weight: 700; margin: 0; }
//           .sub { margin-top: 4px; color: #64748b; font-size: 12px; }
//           .meta { display:grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin: 12px 0; font-size: 13px; }
//           table { width:100%; border-collapse: collapse; font-size: 12px; }
//           th, td { border: 1px solid #dbe3ef; padding: 7px; vertical-align: top; }
//           th { background: #f1f5f9; text-align: left; }
//           .footer { margin-top: 18px; display:flex; justify-content: space-between; font-size: 12px; }
//           .line { border-top: 1px solid #94a3b8; width: 220px; margin-top: 28px; padding-top: 5px; text-align: center; }
//           .note { margin-top: 10px; font-size: 11px; color:#64748b; }
//         </style>
//       </head>
//       <body>
//         <section class="report">
//           <div class="top">
//             <div>
//               <h1 class="title">Lab Report</h1>
//               <div class="sub">Hospital Management System</div>
//             </div>
//             <div style="text-align:right;font-size:12px;">
//               <div><strong>Date:</strong> ${escapeHtml(reportDate)}</div>
//               <div><strong>Order:</strong> ${escapeHtml(order.order_number || `#${order.order_id}`)}</div>
//             </div>
//           </div>

//           <div class="meta">
//             <div><strong>Patient:</strong> ${escapeHtml(order.patient_name || `Patient #${order.patient}`)}</div>
//             <div><strong>Order Status:</strong> ${escapeHtml(order.status || "--")}</div>
//             <div><strong>Reported By:</strong> ${escapeHtml(generatedBy)}</div>
//             <div><strong>Collected Date:</strong> ${escapeHtml(order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "--")}</div>
//           </div>

//           <table>
//             <thead>
//               <tr>
//                 <th style="width:45px;">No.</th>
//                 <th style="width:210px;">Test</th>
//                 <th style="width:150px;">Result</th>
//                 <th style="width:110px;">Unit</th>
//                 <th>Reference Range</th>
//               </tr>
//             </thead>
//             <tbody>
//               ${rows || `<tr><td colspan="5" style="text-align:center; color:#64748b;">No results found</td></tr>`}
//             </tbody>
//           </table>

//           <div class="footer">
//             <div class="line">Lab Technician Signature</div>
//             <div class="line">Doctor Verification</div>
//           </div>

//           <div class="note">This is a system-generated clinical report.</div>
//         </section>
//       </body>
//       </html>
//     `;

//     const frame = document.createElement("iframe");
//     const htmlBlob = new Blob([html], { type: "text/html" });
//     const htmlUrl = URL.createObjectURL(htmlBlob);

//     frame.style.position = "fixed";
//     frame.style.right = "0";
//     frame.style.bottom = "0";
//     frame.style.width = "0";
//     frame.style.height = "0";
//     frame.style.border = "0";
//     frame.setAttribute("aria-hidden", "true");

//     frame.onload = () => {
//       try {
//         const printWin = frame.contentWindow;
//         if (!printWin) throw new Error("Print frame unavailable");

//         setTimeout(() => {
//           printWin.focus();
//           printWin.print();
//         }, 180);
//       } catch {
//         setError("Could not open print dialog for lab report.");
//       }

//       setTimeout(() => {
//         URL.revokeObjectURL(htmlUrl);
//         frame.remove();
//       }, 1600);
//     };

//     document.body.appendChild(frame);
//     frame.src = htmlUrl;
//   };

//   const resultMap = {};
//   results.forEach((r) => { resultMap[r.lab_order_item] = r; });

//   // Orders with a PAID lab bill
//   const billedOrderIds = new Set(
//     bills
//       .filter((b) => b.payment_status === "Paid" || b.payment_status === "paid")
//       .map((b) => b.lab_order)
//   );

//   const pendingCount = orders.filter((o) => o.status === "Pending").length;
//   const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

//   return (
//     <LabLayout title="Lab Results">
//       <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
//         <div className="flex gap-1 bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-1">
//           {["Pending", "Completed", "All"].map((f) => (
//             <button key={f} onClick={() => setFilter(f)}
//               className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "text-gray-500 hover:text-gray-300"}`}>
//               {f}
//               {f === "Pending" && pendingCount > 0 && (
//                 <span className="ml-1.5 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
//               )}
//             </button>
//           ))}
//         </div>
//         <p className="text-xs text-gray-500">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} · {results.length} result{results.length !== 1 ? "s" : ""} entered</p>
//       </div>

//       {/* Billing gate notice */}
//       <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/5 border border-blue-400/20 text-blue-300/70 text-xs">
//         <span>💡</span>
//         <span>Results can only be entered after the patient's <strong className="text-blue-300">consultation bill is paid</strong> by the receptionist.</span>
//       </div>

//       {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

//       {loading ? (
//         <div className="space-y-4">
//           {[...Array(2)].map((_, i) => (
//             <div key={i} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 animate-pulse space-y-3">
//               <div className="flex justify-between"><div className="h-4 bg-[#1e2d4a] rounded w-32" /><div className="h-4 bg-[#1e2d4a] rounded w-20" /></div>
//               <div className="h-12 bg-[#1e2d4a] rounded" /><div className="h-12 bg-[#1e2d4a] rounded" />
//             </div>
//           ))}
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl py-16 text-center">
//           <p className="text-4xl mb-3">🔬</p>
//           <p className="text-gray-400 text-sm">{filter === "Pending" ? "No pending orders — all results entered! ✓" : "No orders found."}</p>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredOrders.map((order) => (
//             <OrderCard
//               key={order.order_id}
//               order={order}
//               resultMap={resultMap}
//               onRefresh={fetchAll}
//               billedOrderIds={billedOrderIds}
//               onPrintReport={handlePrintReport}
//               getItemLabMeta={getItemLabMeta}
//             />
//           ))}
//         </div>
//       )}
//     </LabLayout>
//   );
// };

// export default LabResultsPage;

import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { useAuth } from "../../../context/AuthContext";
import {
  getLabResults,
  createLabResult,
  updateLabResult,
  deleteLabResult,
  getLabBills,
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

const parseRangeRule = (normalRangeText) => {
  const text = String(normalRangeText || "").trim();
  if (!text) return null;

  const betweenMatch = text.match(/(-?\d+(?:\.\d+)?)\s*[–-]\s*(-?\d+(?:\.\d+)?)/);
  if (betweenMatch) {
    return {
      type: "between",
      min: parseFloat(betweenMatch[1]),
      max: parseFloat(betweenMatch[2]),
      raw: text,
    };
  }

  const comparatorMatch = text.match(/(<=|>=|<|>)\s*(-?\d+(?:\.\d+)?)/);
  if (comparatorMatch) {
    return {
      type: comparatorMatch[1],
      value: parseFloat(comparatorMatch[2]),
      raw: text,
    };
  }

  return null;
};

const validateResultValue = (rawValue, normalRangeText) => {
  const rule = parseRangeRule(normalRangeText);
  if (!rule) return { error: "", warning: "" };

  const value = String(rawValue || "").trim();
  const numericPattern = /^-?\d+(?:\.\d+)?$/;
  if (!numericPattern.test(value)) {
    return {
      error: "This test expects a numeric result (example: 4.8).",
      warning: "",
    };
  }

  const numericValue = parseFloat(value);
  let outOfRange = false;

  if (rule.type === "between") {
    outOfRange = numericValue < rule.min || numericValue > rule.max;
  } else if (rule.type === "<") {
    outOfRange = !(numericValue < rule.value);
  } else if (rule.type === "<=") {
    outOfRange = !(numericValue <= rule.value);
  } else if (rule.type === ">") {
    outOfRange = !(numericValue > rule.value);
  } else if (rule.type === ">=") {
    outOfRange = !(numericValue >= rule.value);
  }

  return {
    error: "",
    warning: outOfRange
      ? `Result ${numericValue} is outside reference range (${rule.raw}). You can still save if clinically intended.`
      : "",
  };
};

const ResultForm = ({ item, existingResult, labMeta, onSaved, onCancel }) => {
  const [form, setForm] = useState({
    lab_order_item: item.order_item_id,
    result_value: existingResult?.result_value || "",
    remarks: existingResult?.remarks || "",
    is_critical: existingResult?.is_critical || false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  const handleSubmit = async () => {
    if (!form.result_value.trim()) { setError("Result value is required."); return; }

    const validation = validateResultValue(form.result_value, labMeta?.normal_range);
    if (validation.error) {
      setError(validation.error);
      return;
    }

    setWarning(validation.warning || "");
    setSubmitting(true);
    setError("");
    try {
      if (existingResult) {
        await updateLabResult(existingResult.result_id, form);
      } else {
        await createLabResult(form);
      }
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      setError(
        data?.result_value?.[0] || data?.lab_order_item?.[0] ||
        data?.non_field_errors?.[0] || data?.detail || "Failed to save result."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inp = "w-full bg-[#0a1628] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400 transition";

  return (
    <div className="mt-3 bg-[#060d1a] border border-cyan-400/30 rounded-xl p-4 space-y-3">
      {error && <div className="text-red-400 text-xs bg-red-400/10 border border-red-400/30 px-3 py-2 rounded-lg">{error}</div>}
      {warning && <div className="text-yellow-300 text-xs bg-yellow-400/10 border border-yellow-400/30 px-3 py-2 rounded-lg">{warning}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-400 block mb-1">Result Value *</label>
          <input type="text" value={form.result_value}
            onChange={(e) => setForm({ ...form, result_value: e.target.value })}
            placeholder="e.g. 12.5 g/dL, Negative, Normal" className={inp} autoFocus />
          {(labMeta?.unit || labMeta?.normal_range) && (
            <p className="text-[11px] text-gray-500 mt-1">
              {labMeta?.unit ? `Unit: ${labMeta.unit}` : ""}
              {labMeta?.unit && labMeta?.normal_range ? " | " : ""}
              {labMeta?.normal_range ? `Reference: ${labMeta.normal_range}` : ""}
            </p>
          )}
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1">Remarks (optional)</label>
          <input type="text" value={form.remarks}
            onChange={(e) => setForm({ ...form, remarks: e.target.value })}
            placeholder="Any additional notes…" className={inp} />
        </div>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.is_critical}
            onChange={(e) => setForm({ ...form, is_critical: e.target.checked })}
            className="accent-red-400 w-3.5 h-3.5" />
          <span className="text-xs text-gray-400">Mark as Critical ⚠</span>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="px-4 py-1.5 text-xs text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={submitting}
            className="px-5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition disabled:opacity-50 flex items-center gap-1.5">
            {submitting && <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
            {submitting ? "Saving…" : existingResult ? "Update" : "Save Result"}
          </button>
        </div>
      </div>
    </div>
  );
};

const OrderCard = ({
  order,
  resultMap,
  onRefresh,
  billedOrderIds,
  onPrintReport,
  getItemLabMeta,
}) => {
  const [openItemId, setOpenItemId] = useState(null);
  const items = order.items || [];
  const total = items.length;
  const done = items.filter((it) => resultMap[it.order_item_id]).length;
  const allDone = total > 0 && done === total;

  // Billing gate: only allow result entry if the lab order has a paid bill
  const isBillingPaid = billedOrderIds?.has(order.order_id);
  const billingBlocked = !isBillingPaid;

  const handleDelete = async (resultId) => {
    if (!window.confirm("Delete this result?")) return;
    try { await deleteLabResult(resultId); onRefresh(); }
    catch { alert("Failed to delete result."); }
  };

  if (total === 0) {
    return (
      <div className="bg-[#0d1629] border border-orange-400/20 rounded-xl p-5">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{order.order_number}</span>
              <span className="text-white text-sm font-semibold">{order.patient_name || `Patient #${order.patient}`}</span>
            </div>
            <p className="text-xs text-gray-500">
              {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
            </p>
          </div>
          <div className="bg-orange-400/10 border border-orange-400/30 rounded-lg px-4 py-2 text-xs text-orange-300 max-w-xs">
            <p className="font-semibold mb-1">⚠ No test items found</p>
            <p className="text-orange-400/70">This order has no test items. This can happen if the backend didn't attach tests when the order was created. Please delete this order and re-accept the doctor's request to regenerate it correctly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0d1629] border rounded-xl overflow-hidden ${allDone ? "border-green-400/30" : billingBlocked ? "border-orange-400/30" : "border-[#1e2d4a]"}`}>
      <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{order.order_number}</span>
          <span className="text-white font-semibold text-sm">{order.patient_name || `Patient #${order.patient}`}</span>
          <span className="text-xs text-gray-500">
            {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{done}/{total} done</span>
          <span className={`text-xs px-2 py-1 rounded border ${allDone ? "bg-green-400/10 text-green-400 border-green-400/30" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"}`}>
            {allDone ? "✓ Completed" : "Pending"}
          </span>
          {allDone && (
            <button
              type="button"
              onClick={() => onPrintReport(order)}
              className="text-xs px-3 py-1.5 rounded-lg border border-blue-400/40 text-blue-300 hover:text-blue-200 transition"
            >
              Print Report
            </button>
          )}
          {billingBlocked && (
            <span className="text-xs px-2 py-1 rounded border bg-orange-400/10 text-orange-400 border-orange-400/30">
              💳 Bill Pending
            </span>
          )}
        </div>
      </div>

      {/* ─── BILLING GATE BANNER ─── */}
      {billingBlocked && (
        <div className="mx-4 mt-4 flex items-start gap-3 px-4 py-3 rounded-xl bg-orange-500/10 border border-orange-400/30 text-orange-300">
          <span className="text-xl leading-none mt-0.5">🚫</span>
          <div>
            <p className="text-xs font-semibold">Results Blocked — Billing Not Paid</p>
            <p className="text-xs text-orange-400/80 mt-0.5">
              Lab results can only be entered after the patient's consultation bill has been paid. Please ask the receptionist to complete billing first.
            </p>
          </div>
        </div>
      )}

      <div className="h-1 bg-[#1e2d4a]">
        <div className="h-1 bg-cyan-400 transition-all duration-500" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <div className="p-4 space-y-2">
        {items.map((item) => {
          const result = resultMap[item.order_item_id];
          const labMeta = getItemLabMeta(item);
          const isOpen = openItemId === item.order_item_id;
          return (
            <div key={item.order_item_id} className="bg-[#060d1a] rounded-xl p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
                  <span className="text-xs text-purple-300 bg-purple-400/10 border border-purple-400/20 px-2.5 py-1 rounded-lg flex-shrink-0">
                    🧪 {item.lab_test_name || `Test #${item.lab_test}`}
                  </span>
                  {result ? (
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white font-semibold">{result.result_value}</span>
                      {result.is_critical && <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/30 px-2 py-0.5 rounded">⚠ Critical</span>}
                      {result.remarks && <span className="text-xs text-gray-400 italic">— {result.remarks}</span>}
                    </div>
                  ) : <span className="text-xs text-gray-500 italic">No result yet</span>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {result ? (
                    <>
                      <button
                        onClick={() => !billingBlocked && setOpenItemId(isOpen ? null : item.order_item_id)}
                        disabled={billingBlocked}
                        className={`text-xs border px-3 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-600" : "text-cyan-400 hover:text-cyan-300 border-cyan-400/30"}`}
                      >
                        {isOpen ? "Cancel" : "Edit"}
                      </button>
                      <button
                        onClick={() => !billingBlocked && handleDelete(result.result_id)}
                        disabled={billingBlocked}
                        className={`text-xs border px-3 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-600" : "text-red-400 hover:text-red-300 border-red-400/30"}`}
                      >
                        Del
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => !billingBlocked && setOpenItemId(isOpen ? null : item.order_item_id)}
                      disabled={billingBlocked}
                      className={`text-xs font-bold px-4 py-1.5 rounded-lg transition ${billingBlocked ? "opacity-40 cursor-not-allowed bg-gray-700 text-gray-500" : "text-black bg-cyan-400 hover:bg-cyan-300"}`}
                    >
                      {billingBlocked ? "🔒 Billing Pending" : isOpen ? "Cancel" : "+ Enter Result"}
                    </button>
                  )}
                </div>
              </div>
              {isOpen && !billingBlocked && (
                <ResultForm item={item} existingResult={result || null} labMeta={labMeta}
                  onSaved={() => { setOpenItemId(null); onRefresh(); }}
                  onCancel={() => setOpenItemId(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LabResultsPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [results, setResults] = useState([]);
  const [bills, setBills] = useState([]);
  const [labTestsById, setLabTestsById] = useState({});
  const [labTestsByName, setLabTestsByName] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("Pending");

  const fetchAll = () => {
    setLoading(true);
    setError("");
    Promise.all([getLabOrders(), getLabResults(), getLabRequests(), getLabBills(), getLabTests()])
      .then(([oRes, rRes, reqRes, bRes, tRes]) => {
        const rawOrders = oRes.data || [];
        const reqs = reqRes.data || [];
        const tests = tRes.data || [];

        const testsMapById = tests.reduce((acc, t) => {
          if (t?.lab_test_id != null) acc[t.lab_test_id] = t;
          return acc;
        }, {});

        const testsMapByName = tests.reduce((acc, t) => {
          const key = String(t?.test_name || "").trim().toLowerCase();
          if (key) acc[key] = t;
          return acc;
        }, {});

        setLabTestsById(testsMapById);
        setLabTestsByName(testsMapByName);

        const patientMap = buildPatientMap(reqs);
        const enriched = rawOrders.map((o) => ({
          ...o,
          patient_name: o.patient_name || patientMap[o.lab_request] || null,
        }));
        setOrders(enriched);
        setResults(rRes.data || []);
        setBills(bRes || []);
      })
      .catch(() => setError("Failed to load data."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAll(); }, []);

  const getItemLabMeta = (item) => {
    const byId = labTestsById[item?.lab_test];
    if (byId) return byId;

    const key = String(item?.lab_test_name || "").trim().toLowerCase();
    return key ? labTestsByName[key] : null;
  };

  const handlePrintReport = (order) => {
    const generatedBy = user?.first_name
      ? `${user.first_name} ${user.last_name || ""}`.trim()
      : user?.username || "Lab Technician";

    const items = order.items || [];
    const rows = items.map((item, index) => {
      const result = resultMap[item.order_item_id];
      const meta = getItemLabMeta(item);

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(item.lab_test_name || `Test #${item.lab_test}`)}</td>
          <td>${escapeHtml(result?.result_value || "--")}</td>
          <td>${escapeHtml(meta?.unit || "--")}</td>
          <td>${escapeHtml(meta?.normal_range || "--")}</td>
        </tr>
      `;
    }).join("");

    const reportDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Lab Report ${escapeHtml(order.order_number)}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { font-family: Arial, Helvetica, sans-serif; color: #0f172a; margin: 0; }
          .report { border: 1px solid #cbd5e1; border-radius: 10px; padding: 16px; }
          .top { display:flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
          .title { font-size: 24px; font-weight: 700; margin: 0; }
          .sub { margin-top: 4px; color: #64748b; font-size: 12px; }
          .meta { display:grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; margin: 12px 0; font-size: 13px; }
          table { width:100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #dbe3ef; padding: 7px; vertical-align: top; }
          th { background: #f1f5f9; text-align: left; }
          .footer { margin-top: 18px; display:flex; justify-content: space-between; font-size: 12px; }
          .line { border-top: 1px solid #94a3b8; width: 220px; margin-top: 28px; padding-top: 5px; text-align: center; }
          .note { margin-top: 10px; font-size: 11px; color:#64748b; }
        </style>
      </head>
      <body>
        <section class="report">
          <div class="top">
            <div>
              <h1 class="title">Lab Report</h1>
              <div class="sub">Hospital Management System</div>
            </div>
            <div style="text-align:right;font-size:12px;">
              <div><strong>Date:</strong> ${escapeHtml(reportDate)}</div>
              <div><strong>Order:</strong> ${escapeHtml(order.order_number || `#${order.order_id}`)}</div>
            </div>
          </div>

          <div class="meta">
            <div><strong>Patient:</strong> ${escapeHtml(order.patient_name || `Patient #${order.patient}`)}</div>
            <div><strong>Order Status:</strong> ${escapeHtml(order.status || "--")}</div>
            <div><strong>Reported By:</strong> ${escapeHtml(generatedBy)}</div>
            <div><strong>Collected Date:</strong> ${escapeHtml(order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN") : "--")}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:45px;">No.</th>
                <th style="width:210px;">Test</th>
                <th style="width:150px;">Result</th>
                <th style="width:110px;">Unit</th>
                <th>Reference Range</th>
              </tr>
            </thead>
            <tbody>
              ${rows || `<tr><td colspan="5" style="text-align:center; color:#64748b;">No results found</td></tr>`}
            </tbody>
          </table>

          <div class="footer">
            <div class="line">Lab Technician Signature</div>
            <div class="line">Doctor Verification</div>
          </div>

          <div class="note">This is a system-generated clinical report.</div>
        </section>
      </body>
      </html>
    `;

    const frame = document.createElement("iframe");
    const htmlBlob = new Blob([html], { type: "text/html" });
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
        if (!printWin) throw new Error("Print frame unavailable");

        setTimeout(() => {
          printWin.focus();
          printWin.print();
        }, 180);
      } catch {
        setError("Could not open print dialog for lab report.");
      }

      setTimeout(() => {
        URL.revokeObjectURL(htmlUrl);
        frame.remove();
      }, 1600);
    };

    document.body.appendChild(frame);
    frame.src = htmlUrl;
  };

  const resultMap = {};
  results.forEach((r) => { resultMap[r.lab_order_item] = r; });

  // Orders with a PAID lab bill
  const billedOrderIds = new Set(
    bills
      .filter((b) => b.payment_status === "Paid" || b.payment_status === "paid")
      .map((b) => b.lab_order)
  );

  const pendingCount = orders.filter((o) => o.status === "Pending").length;
  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <LabLayout title="Lab Results">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-1">
          {["Pending", "Completed", "All"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "text-gray-500 hover:text-gray-300"}`}>
              {f}
              {f === "Pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
              )}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500">{filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""} · {results.length} result{results.length !== 1 ? "s" : ""} entered</p>
      </div>

      {/* Billing gate notice */}
      <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/5 border border-blue-400/20 text-blue-300/70 text-xs">
        <span>💡</span>
        <span>Results can only be entered after the patient's <strong className="text-blue-300">consultation bill is paid</strong> by the receptionist.</span>
      </div>

      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 animate-pulse space-y-3">
              <div className="flex justify-between"><div className="h-4 bg-[#1e2d4a] rounded w-32" /><div className="h-4 bg-[#1e2d4a] rounded w-20" /></div>
              <div className="h-12 bg-[#1e2d4a] rounded" /><div className="h-12 bg-[#1e2d4a] rounded" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl py-16 text-center">
          <p className="text-4xl mb-3">🔬</p>
          <p className="text-gray-400 text-sm">{filter === "Pending" ? "No pending orders — all results entered! ✓" : "No orders found."}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.order_id}
              order={order}
              resultMap={resultMap}
              onRefresh={fetchAll}
              billedOrderIds={billedOrderIds}
              onPrintReport={handlePrintReport}
              getItemLabMeta={getItemLabMeta}
            />
          ))}
        </div>
      )}
    </LabLayout>
  );
};

export default LabResultsPage;