import API from "../../../api";

// 🔥 GET TODAY APPOINTMENTS + STATS
export const getTodayAppointments = async () => {
  try {
    const response = await API.get("/api/doctor/today-appointments/");
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to fetch today's appointments";
  }
};

// 🔥 GET CONSULTATION PAGE
export const getConsultationPage = async (appointmentId) => {
  try {
    const response = await API.get(
      `/api/doctor/consultation/${appointmentId}/`
    );

    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to fetch consultation data";
  }
};

// 🔥 CREATE CONSULTATION
export const createConsultation = async (data) => {
  try {
    const response = await API.post(
      "/api/doctor/consultations/",
      data
    );

    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to create consultation";
  }
};

// 🔥 CREATE LAB REQUEST (MULTIPLE SUPPORTED)
export const createLabRequest = async (data) => {
  try {
    const response = await API.post(
      "/api/doctor/lab-test-request/",
      data
    );

    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to create lab request";
  }
};

// 🔥 GET LAB TESTS
export const getLabTests = async () => {
  try {
    const response = await API.get("/api/doctor/lab-tests/");
    return response.data;

  } catch (error) {
    throw "Failed to fetch lab tests";
  }
};

// 🔥 CREATE PRESCRIPTION
export const createPrescription = async (data) => {
  try {
    const response = await API.post(
      "/api/doctor/prescriptions/",
      data
    );

    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to create prescription";
  }
};

// 🔥 GET MEDICINES
export const getMedicines = async () => {
  try {
    const response = await API.get("/api/doctor/medicines/");
    return response.data;

  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;

      const message =
        errData.message ||
        errData.detail ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Failed to fetch medicines";
  }
};

// 🔥 GET LAB RESULTS BY CONSULTATION
export const getLabResultsByConsultation = async (consultationId) => {
  try {
    const response = await API.get(`/api/doctor/lab-results/${consultationId}/`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      const errData = error.response.data;
      const message = errData.message || errData.detail || JSON.stringify(errData);
      throw message;
    }
    throw "Failed to fetch previous lab results";
  }
};