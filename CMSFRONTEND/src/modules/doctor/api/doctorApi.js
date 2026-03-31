import API from "../../../api";

// ─── TODAY APPOINTMENTS ───────────────────────────────────────────
export const getTodayAppointments = async () => {
  const res = await API.get("/api/doctor/today-appointments/");
  return res.data; // { message, count, data: [...] }
};

// ─── CONSULTATION PAGE DATA ───────────────────────────────────────
export const getConsultationPage = async (appointmentId) => {
  const res = await API.get(`/api/doctor/consultation/${appointmentId}/`);
  return res.data; // { message, data: { appointment, patient, current_consultation, ... } }
};

// ─── CREATE CONSULTATION ──────────────────────────────────────────
export const createConsultation = async (payload) => {
  const res = await API.post("/api/doctor/consultations/", payload);
  return res.data;
};

// ─── CREATE LAB TEST REQUEST ──────────────────────────────────────
export const createLabTestRequest = async (payload) => {
  const res = await API.post("/api/doctor/lab-test-request/", payload);
  return res.data;
};

// ─── VIEW LAB RESULTS (for current consultation) ──────────────────
// Returns { message, results: [{ result_id, test_name, result_value, remarks, is_critical, created_at }] }
export const getLabResults = async (consultationId) => {
  const res = await API.get(`/api/doctor/lab-results/${consultationId}/`);
  return res.data;
};

// ─── CREATE PRESCRIPTION ──────────────────────────────────────────
export const createPrescription = async (payload) => {
  const res = await API.post("/api/doctor/prescriptions/", payload);
  return res.data;
};

// ─── LIST MEDICINES (for prescription dropdown) ───────────────────
export const getMedicines = async () => {
  const res = await API.get("/api/pharmacist/medicines/?page_size=200");
  const raw = res.data;
  // DRF router returns paginated { count, results: [] } or plain array
  return raw.results ?? raw.data ?? (Array.isArray(raw) ? raw : []);
};

// ─── LIST LAB TESTS (for lab request dropdown) ────────────────────
export const getLabTests = async () => {
  const res = await API.get("/api/labtechnician/lab-tests/?page_size=200");
  const raw = res.data;
  return raw.results ?? raw.data ?? (Array.isArray(raw) ? raw : []);
};