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

// ─── DISPENSES ────────────────────────────────────────────────────
export const getDispenses = async () => {
  const res = await API.get("/api/pharmacist/dispenses/");
  return res.data;
};

export const createDispense = async (payload) => {
  const res = await API.post("/api/pharmacist/dispenses/", payload);
  return res.data;
};

// ─── DISPENSE ITEMS ───────────────────────────────────────────────
export const createDispenseItem = async (payload) => {
  const res = await API.post("/api/pharmacist/dispense-items/", payload);
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

// ─── STOCK LOGS ───────────────────────────────────────────────────
export const getStockLogs = async () => {
  const res = await API.get("/api/pharmacist/stock-logs/");
  return res.data;
};