import API from "../../../api";

// ─── DASHBOARD ────────────────────────────────────────────────────
export const getDashboardStats = async () => {
  const res = await API.get("/api/administration/dashboard/");
  return res.data;
};

// ─── STAFF ────────────────────────────────────────────────────────
export const getStaffList = async (url = "/api/administration/staff/") => {
  const res = await API.get(url);
  return res.data; // { count, next, previous, results: [...] }
};

export const createStaff = async (payload) => {
  const res = await API.post("/api/administration/staff/", payload);
  return res.data;
};

export const updateStaff = async (id, payload) => {
  const res = await API.put(`/api/administration/staff/${id}/`, payload);
  return res.data;
};

export const patchStaff = async (id, payload) => {
  const res = await API.patch(`/api/administration/staff/${id}/`, payload);
  return res.data;
};

// ─── DOCTORS ──────────────────────────────────────────────────────
export const getDoctorList = async (url = "/api/administration/doctor/") => {
  const res = await API.get(url);
  return res.data;
};

export const createDoctor = async (payload) => {
  const res = await API.post("/api/administration/doctor/", payload);
  return res.data;
};

export const updateDoctor = async (id, payload) => {
  const res = await API.put(`/api/administration/doctor/${id}/`, payload);
  return res.data;
};

export const patchDoctor = async (id, payload) => {
  const res = await API.patch(`/api/administration/doctor/${id}/`, payload);
  return res.data;
};

// ─── RECEPTIONISTS ────────────────────────────────────────────────
export const getReceptionistList = async (url = "/api/administration/receptionist/") => {
  const res = await API.get(url);
  return res.data;
};

export const createReceptionist = async (payload) => {
  const res = await API.post("/api/administration/receptionist/", payload);
  return res.data;
};

export const updateReceptionist = async (id, payload) => {
  const res = await API.put(`/api/administration/receptionist/${id}/`, payload);
  return res.data;
};

export const patchReceptionist = async (id, payload) => {
  const res = await API.patch(`/api/administration/receptionist/${id}/`, payload);
  return res.data;
};

// ─── LAB TECHNICIANS ──────────────────────────────────────────────
export const getLabTechnicianList = async (url = "/api/administration/labtechnician/") => {
  const res = await API.get(url);
  return res.data;
};

export const createLabTechnician = async (payload) => {
  const res = await API.post("/api/administration/labtechnician/", payload);
  return res.data;
};

export const updateLabTechnician = async (id, payload) => {
  const res = await API.put(`/api/administration/labtechnician/${id}/`, payload);
  return res.data;
};

export const patchLabTechnician = async (id, payload) => {
  const res = await API.patch(`/api/administration/labtechnician/${id}/`, payload);
  return res.data;
};

// ─── PHARMACISTS ──────────────────────────────────────────────────
export const getPharmacistList = async (url = "/api/administration/pharmacist/") => {
  const res = await API.get(url);
  return res.data;
};

export const createPharmacist = async (payload) => {
  const res = await API.post("/api/administration/pharmacist/", payload);
  return res.data;
};

export const updatePharmacist = async (id, payload) => {
  const res = await API.put(`/api/administration/pharmacist/${id}/`, payload);
  return res.data;
};

export const patchPharmacist = async (id, payload) => {
  const res = await API.patch(`/api/administration/pharmacist/${id}/`, payload);
  return res.data;
};

// ─── AUDIT LOGS ───────────────────────────────────────────────────
export const getAuditLogs = async (url = "/api/administration/audit/") => {
  const res = await API.get(url);
  return res.data;
};


