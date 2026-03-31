import API from "../../../api";

// ─── INCOMING PRESCRIPTIONS ──────────────────────────────────────
export const getIncomingPrescriptions = async () => {
  const res = await API.get("/api/pharmacist/incoming-prescriptions/");
  return res.data; // { message, count, data: [...] }
};

export const getPrescriptionDetail = async (prescriptionCode) => {
  const res = await API.get(`/api/pharmacist/incoming-prescriptions/${prescriptionCode}/`);
  return res.data; // { message, data: { ... } }
};

// ─── MEDICINES ────────────────────────────────────────────────────
export const getMedicines = async (search = "") => {
  const params = search ? `?search=${search}` : "";
  const res = await API.get(`/api/pharmacist/medicines/${params}`);
  return res.data;
};

export const createMedicine = async (payload) => {
  const res = await API.post("/api/pharmacist/medicines/", payload);
  return res.data;
};

export const updateMedicine = async (id, payload) => {
  const res = await API.put(`/api/pharmacist/medicines/${id}/`, payload);
  return res.data;
};

export const deleteMedicine = async (id) => {
  const res = await API.delete(`/api/pharmacist/medicines/${id}/`);
  return res.data;
};

// ─── MEDICINE BATCHES ─────────────────────────────────────────────
export const getBatches = async (medicineId = "") => {
  const params = medicineId ? `?medicine=${medicineId}` : "";
  const res = await API.get(`/api/pharmacist/batches/${params}`);
  return res.data;
};

export const createBatch = async (payload) => {
  const res = await API.post("/api/pharmacist/batches/", payload);
  return res.data;
};

export const updateBatch = async (id, payload) => {
  const res = await API.put(`/api/pharmacist/batches/${id}/`, payload);
  return res.data;
};

export const deleteBatch = async (id) => {
  const res = await API.delete(`/api/pharmacist/batches/${id}/`);
  return res.data;
};

// ─── DISPENSES (FIXED - SINGLE API CALL WITH NESTED ITEMS) ────────
/**
 * Create dispense with nested items in a single API call
 * @param {Object} payload - { prescription: id, items: [{batch: id, quantity: number}, ...] }
 * @returns {Promise} Response with created dispense
 */
export const createDispense = async (payload) => {
  const res = await API.post("/api/pharmacist/dispenses/", payload);
  return res.data;
};

export const getDispenses = async () => {
  const res = await API.get("/api/pharmacist/dispenses/");
  return res.data;
};

export const getDispenseDetail = async (id) => {
  const res = await API.get(`/api/pharmacist/dispenses/${id}/`);
  return res.data;
};

export const updateDispense = async (id, payload) => {
  const res = await API.put(`/api/pharmacist/dispenses/${id}/`, payload);
  return res.data;
};

export const deleteDispense = async (id) => {
  const res = await API.delete(`/api/pharmacist/dispenses/${id}/`);
  return res.data;
};

// ─── DISPENSE ITEMS (READ-ONLY - NOT USED FOR CREATION) ───────────
export const getDispenseItems = async (dispenseId = "") => {
  const params = dispenseId ? `?dispense=${dispenseId}` : "";
  const res = await API.get(`/api/pharmacist/dispense-items/${params}`);
  return res.data;
};

// ─── MEDICINE BILLS ───────────────────────────────────────────────
export const getMedicineBills = async () => {
  const res = await API.get("/api/pharmacist/bills/");
  return res.data;
};

export const createMedicineBill = async (payload) => {
  const res = await API.post("/api/pharmacist/bills/", payload);
  return res.data;
};

export const getMedicineBillDetail = async (id) => {
  const res = await API.get(`/api/pharmacist/bills/${id}/`);
  return res.data;
};

export const updateMedicineBill = async (id, payload) => {
  const res = await API.put(`/api/pharmacist/bills/${id}/`, payload);
  return res.data;
};

export const deleteMedicineBill = async (id) => {
  const res = await API.delete(`/api/pharmacist/bills/${id}/`);
  return res.data;
};

// ─── STOCK LOGS (READ-ONLY) ───────────────────────────────────────
export const getStockLogs = async () => {
  const res = await API.get("/api/pharmacist/stock-logs/");
  return res.data;
};