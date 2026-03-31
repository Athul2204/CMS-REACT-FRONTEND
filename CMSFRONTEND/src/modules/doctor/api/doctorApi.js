import API from "../../../api";

// ─── TODAY APPOINTMENTS ───────────────────────────────────────────
export const getTodayAppointments = async () => {
  const res = await API.get("/doctor/today-appointments/");
  return res.data; // { message, count, data: [...] }
};

// ─── CONSULTATION PAGE DATA ───────────────────────────────────────
export const getConsultationPage = async (appointmentId) => {
  const res = await API.get(`/doctor/consultation/${appointmentId}/`);
  return res.data; // { message, data: { appointment, patient, current_consultation, ... } }
};

// ─── CREATE CONSULTATION ──────────────────────────────────────────
export const createConsultation = async (payload) => {
  const res = await API.post("/doctor/consultations/", payload);
  return res.data;
};

// ─── CREATE LAB TEST REQUEST ──────────────────────────────────────
export const createLabTestRequest = async (payload) => {
  const res = await API.post("/doctor/lab-test-request/", payload);
  return res.data;
};

// ─── VIEW LAB RESULTS ─────────────────────────────────────────────
export const getLabResults = async (consultationId) => {
  const res = await API.get(`/doctor/lab-results/${consultationId}/`);
  return res.data;
};

// ─── CREATE PRESCRIPTION ─────────────────────────────────────────
export const createPrescription = async (payload) => {
  const res = await API.post("/doctor/prescriptions/", payload);
  return res.data;
};
