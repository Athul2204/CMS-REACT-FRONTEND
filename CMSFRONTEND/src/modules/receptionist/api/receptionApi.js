import API from "../../../api";

// ─── PATIENTS ──────────────────────────────────────────────────────
export const getPatients = async () => {
  const res = await API.get("/api/reception/patients/");
  return res.data; // { count, data: [...] }
};

export const createPatient = async (payload) => {
  const res = await API.post("/api/reception/patients/create/", payload);
  return res.data;
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────
export const getAppointmentsByDate = async (date) => {
  const res = await API.get(`/api/reception/appointments-by-date/?date=${date}`);
  return res.data; // { count, data: [...] }
};

export const createAppointment = async (payload) => {
  const res = await API.post("/api/reception/appointments/create/", payload);
  return res.data;
};

export const cancelAppointment = async (appointmentId) => {
  const res = await API.patch(`/api/reception/appointments/${appointmentId}/cancel/`);
  return res.data;
};

// ─── BILLS ────────────────────────────────────────────────────────
export const createBill = async (payload) => {
  const res = await API.post("/api/reception/bills/create/", payload);
  return res.data;
};

export const payBill = async (billId) => {
  const res = await API.patch(`/api/reception/bills/${billId}/pay/`);
  return res.data;
};

// ─── DOCTORS (for appointment booking dropdown) ───────────────────
export const getDoctors = async () => {
  const res = await API.get("/api/administration/doctor/");
  return res.data;
};

// ─── DOCTOR AVAILABILITY ──────────────────────────────────────────
export const getDoctorAvailability = async (date = null) => {
  const url = date
    ? `/api/reception/availability/?date=${date}`
    : "/api/reception/availability/";
  const res = await API.get(url);
  return res.data; // { count, data: [...] }
};