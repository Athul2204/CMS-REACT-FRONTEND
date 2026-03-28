import API from "./api";

// ✅ GET patients
export const getPatients = () => API.get("/patients/");

// ✅ ADD patient
export const addPatient = (data) => API.post("/patients/", data);

// ✅ GET doctor availability
export const getAvailability = () => API.get("/availability/");