import API from "../../../api";

// ─── LAB TESTS ────────────────────────────────────────────────────
export const getLabTests = async () => {
  const res = await API.get("/api/labtechnician/lab-tests/");
  return res.data; // { message, count, data: [...] }
};

export const createLabTest = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-tests/", payload);
  return res.data;
};

export const updateLabTest = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-tests/${id}/`, payload);
  return res.data;
};

export const deleteLabTest = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-tests/${id}/`);
  return res.data;
};

// ─── LAB ORDERS ───────────────────────────────────────────────────
export const getLabOrders = async () => {
  const res = await API.get("/api/labtechnician/lab-orders/");
  return res.data; // { message, count, data: [...] }
};

export const createLabOrder = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-orders/", payload);
  return res.data;
};

export const updateLabOrder = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-orders/${id}/`, payload);
  return res.data;
};

export const deleteLabOrder = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-orders/${id}/`);
  return res.data;
};

// ─── LAB ORDER ITEMS ──────────────────────────────────────────────
export const getLabOrderItems = async () => {
  const res = await API.get("/api/labtechnician/lab-order-items/");
  return res.data;
};

export const createLabOrderItem = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-order-items/", payload);
  return res.data;
};

// ─── LAB RESULTS ──────────────────────────────────────────────────
export const getLabResults = async () => {
  const res = await API.get("/api/labtechnician/lab-results/");
  return res.data;
};

export const createLabResult = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-results/", payload);
  return res.data;
};

export const updateLabResult = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-results/${id}/`, payload);
  return res.data;
};

export const deleteLabResult = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-results/${id}/`);
  return res.data;
};

// ─── LAB BILLS ────────────────────────────────────────────────────
export const getLabBills = async () => {
  const res = await API.get("/api/labtechnician/lab-bills/");
  return res.data;
};

export const createLabBill = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-bills/", payload);
  return res.data;
};

export const updateLabBill = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-bills/${id}/`, payload);
  return res.data;
};

export const deleteLabBill = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-bills/${id}/`);
  return res.data;
};

// ─── LAB EQUIPMENT ────────────────────────────────────────────────
export const getLabEquipment = async () => {
  const res = await API.get("/api/labtechnician/lab-equipment/");
  return res.data;
};

export const createLabEquipment = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-equipment/", payload);
  return res.data;
};

export const updateLabEquipment = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-equipment/${id}/`, payload);
  return res.data;
};

export const deleteLabEquipment = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-equipment/${id}/`);
  return res.data;
};

// ─── LAB MAINTENANCE ──────────────────────────────────────────────
export const getLabMaintenance = async () => {
  const res = await API.get("/api/labtechnician/lab-maintenance/");
  return res.data;
};

export const createLabMaintenance = async (payload) => {
  const res = await API.post("/api/labtechnician/lab-maintenance/", payload);
  return res.data;
};

export const updateLabMaintenance = async (id, payload) => {
  const res = await API.put(`/api/labtechnician/lab-maintenance/${id}/`, payload);
  return res.data;
};

export const deleteLabMaintenance = async (id) => {
  const res = await API.delete(`/api/labtechnician/lab-maintenance/${id}/`);
  return res.data;
};