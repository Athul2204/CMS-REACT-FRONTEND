import API from "../../../api";

// ─── PATIENTS ──────────────────────────────────────────────────────
export const getPatients = async () => {
  const res = await API.get("/api/reception/patients/");
  return res.data;
};

export const createPatient = async (payload) => {
  const res = await API.post("/api/reception/patients/create/", payload);
  return res.data;
};

// ─── APPOINTMENTS ─────────────────────────────────────────────────
export const getAppointmentsByDate = async (date) => {
  const res = await API.get(`/api/reception/appointments-by-date/?date=${date}`);
  return res.data;
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
// Backend uses StandardPagination → returns { count, next, previous, results: [] }
export const getDoctors = async () => {
  const res = await API.get("/api/administration/doctor/?page_size=100");
  // Normalise: always return { count, data: [] }
  const raw = res.data;
  return {
    count: raw.count ?? 0,
    data: raw.results ?? raw.data ?? (Array.isArray(raw) ? raw : []),
  };
};

// ─── DOCTOR AVAILABILITY ──────────────────────────────────────────
// Backend returns { count, data: [] }
export const getDoctorAvailability = async (date = null) => {
  const url = date
    ? `/api/reception/availability/?date=${date}`
    : "/api/reception/availability/";
  const res = await API.get(url);
  const raw = res.data;
  // Normalise to always return { count, data: [] }
  return {
    count: raw.count ?? 0,
    data: Array.isArray(raw) ? raw : raw.data ?? [],
  };
};

// ─── DOCTOR AVAILABILITY MANAGEMENT ──────────────────────────────
export const createDoctorAvailability = async (payload) => {
  const res = await API.post("/api/reception/availability/create/", payload);
  return res.data;
};

export const deleteDoctorAvailability = async (availabilityId) => {
  const res = await API.delete(`/api/reception/availability/${availabilityId}/delete/`);
  return res.data;
};