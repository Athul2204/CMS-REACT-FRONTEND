import React, { useEffect, useState } from "react";
import LabLayout from "../components/LabLayout";
import { getLabOrders, createLabOrder, deleteLabOrder, getLabRequests, createLabOrderItem } from "../api/labApi";

const TABS = ["Incoming Requests", "All Orders"];

const buildPatientMap = (reqs) => {
  const map = {};
  reqs.forEach((r) => {
    if (r.lab_request_id && r.patient_name) map[r.lab_request_id] = r.patient_name;
  });
  return map;
};

const enrichOrders = (rawOrders, reqs) => {
  const patientMap = buildPatientMap(reqs);
  return rawOrders.map((o) => ({
    ...o,
    patient_name: o.patient_name || patientMap[o.lab_request] || null,
  }));
};

const LabOrdersPage = () => {
  const [tab, setTab] = useState("Incoming Requests");
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [reqError, setReqError] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [success, setSuccess] = useState("");
  const [accepting, setAccepting] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchRequests = () => {
    setReqLoading(true);
    setReqError("");
    getLabRequests()
      .then((res) => setRequests(res.data || []))
      .catch(() => setReqError("Failed to load incoming lab requests."))
      .finally(() => setReqLoading(false));
  };

  const fetchOrders = () => {
    setOrdersLoading(true);
    setOrdersError("");
    Promise.all([getLabOrders(), getLabRequests()])
      .then(([oRes, reqRes]) => {
        setOrders(enrichOrders(oRes.data || [], reqRes.data || []));
      })
      .catch(() => setOrdersError("Failed to load lab orders."))
      .finally(() => setOrdersLoading(false));
  };

  useEffect(() => {
    fetchRequests();
    fetchOrders();
  }, []);

  const handleAccept = async (req) => {
    setAccepting(req.lab_request_id);
    setSuccess("");
    setReqError("");
    try {
      // Step 1: Create the lab order
      const orderRes = await createLabOrder({ lab_request: req.lab_request_id, patient: req.patient_id });
      // Try to get the new order's ID from the response (handle both response shapes)
      const createdOrder = orderRes.data || orderRes;
      const createdOrderId = createdOrder?.order_id;

      // Step 2: Create order items for each test in the request.
      // The backend should do this automatically, but if it doesn't (items come back empty),
      // we create them here on the frontend as a fallback.
      if (createdOrderId && req.tests?.length > 0) {
        await Promise.allSettled(
          req.tests.map((t) =>
            createLabOrderItem({ lab_order: createdOrderId, lab_test: t.test_id })
          )
        );
      }

      setSuccess(`Order created for ${req.patient_name} (${req.tests.map((t) => t.test_name).join(", ")})`);
      fetchRequests();
      fetchOrders();
    } catch (err) {
      const data = err?.response?.data;
      setReqError(
        data?.non_field_errors?.[0] || data?.patient?.[0] || data?.lab_request?.[0] ||
        data?.detail || JSON.stringify(data) || "Failed to create lab order."
      );
    } finally {
      setAccepting(null);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try { await deleteLabOrder(id); setSuccess("Order deleted."); fetchOrders(); }
    catch { setOrdersError("Failed to delete order."); }
  };

  const filteredOrders = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  return (
    <LabLayout title="Lab Orders">
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">✓ {success}</div>
      )}

      <div className="flex gap-1 mb-6 bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/40" : "text-gray-500 hover:text-gray-300"
            }`}>
            {t}
            {t === "Incoming Requests" && requests.filter((r) => !r.already_created).length > 0 && (
              <span className="ml-2 bg-yellow-400 text-black text-xs font-bold px-1.5 py-0.5 rounded-full">
                {requests.filter((r) => !r.already_created).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === "Incoming Requests" && (
        <div>
          {reqError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{reqError}</div>
          )}
          {reqLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-5 animate-pulse">
                  <div className="flex justify-between">
                    <div className="space-y-2"><div className="h-4 bg-[#1e2d4a] rounded w-40" /><div className="h-3 bg-[#1e2d4a] rounded w-60" /></div>
                    <div className="h-8 bg-[#1e2d4a] rounded-lg w-28" />
                  </div>
                </div>
              ))}
            </div>
          ) : requests.length === 0 ? (
            <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl py-16 text-center">
              <p className="text-4xl mb-3">🔬</p>
              <p className="text-gray-400 text-sm">No lab requests from doctors yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.lab_request_id}
                  className={`bg-[#0d1629] border rounded-xl p-5 transition-all ${
                    req.already_created ? "border-[#1e2d4a] opacity-60" : "border-yellow-400/30 hover:border-yellow-400/60"
                  }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">REQ-{req.lab_request_id}</span>
                        <span className={`text-xs px-2 py-1 rounded border ${
                          req.status === "Pending" ? "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" : "bg-green-400/10 text-green-400 border-green-400/30"
                        }`}>{req.status}</span>
                        {req.already_created && (
                          <span className="text-xs bg-blue-400/10 text-blue-400 border border-blue-400/30 px-2 py-1 rounded">✓ Order Created</span>
                        )}
                      </div>
                      <p className="text-white font-semibold text-sm mb-0.5">👤 {req.patient_name}</p>
                      <p className="text-gray-500 text-xs mb-2">
                        Doctor: {req.doctor_name} · {req.created_at ? new Date(req.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : ""}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(req.tests || []).map((t) => (
                          <span key={t.test_id} className="text-xs bg-purple-400/10 text-purple-300 border border-purple-400/30 px-2 py-1 rounded">
                            🧪 {t.test_name}{t.test_cost ? <span className="ml-1 text-cyan-400">₹{t.test_cost}</span> : null}
                          </span>
                        ))}
                      </div>
                      {req.notes && <p className="text-xs text-gray-400 mt-2 italic">Note: {req.notes}</p>}
                    </div>
                    {!req.already_created && (
                      <button onClick={() => handleAccept(req)} disabled={accepting === req.lab_request_id}
                        className="flex-shrink-0 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-black text-sm font-bold rounded-xl transition disabled:opacity-50 flex items-center gap-2">
                        {accepting === req.lab_request_id ? (
                          <><span className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />Creating…</>
                        ) : "Accept & Create Order"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "All Orders" && (
        <div>
          <div className="mb-4 flex gap-2">
            {["All", "Pending", "Completed"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-xs px-4 py-2 rounded-lg border transition ${
                  filter === f ? "bg-cyan-400/20 text-cyan-300 border-cyan-400/40" : "text-gray-400 border-[#1e2d4a] hover:border-cyan-400/30"
                }`}>{f}</button>
            ))}
          </div>
          {ordersError && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{ordersError}</div>
          )}
          <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Order No.</th>
                    <th className="px-4 py-3 text-left">Patient</th>
                    <th className="px-4 py-3 text-left">Tests</th>
                    <th className="px-4 py-3 text-left">Request</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    [...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-[#1e2d4a]">
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-4 py-3"><div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" /></td>
                        ))}
                      </tr>
                    ))
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={7} className="text-center text-gray-500 py-12 text-sm">No lab orders found.</td></tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.order_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded">{order.order_number}</span>
                        </td>
                        <td className="px-4 py-3 text-white font-medium">{order.patient_name || `Patient #${order.patient}`}</td>
                        <td className="px-4 py-3">
                          {order.items && order.items.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {order.items.map((it) => (
                                <span key={it.order_item_id} className="text-xs bg-purple-400/10 text-purple-300 border border-purple-400/20 px-2 py-0.5 rounded">
                                  🧪 {it.lab_test_name || `Test #${it.lab_test}`}
                                </span>
                              ))}
                            </div>
                          ) : <span className="text-xs text-gray-500 italic">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-400">REQ-{order.lab_request}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded border ${
                            order.status === "Completed" ? "bg-green-400/10 text-green-400 border-green-400/30" : "bg-yellow-400/10 text-yellow-400 border-yellow-400/30"
                          }`}>{order.status}</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString("en-IN")}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleDeleteOrder(order.order_id)}
                            className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1.5 rounded-lg transition">Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </LabLayout>
  );
};

export default LabOrdersPage;