import API from "../../../api";

// 🔥 GET TODAY APPOINTMENTS + STATS
export const getTodayAppointments = async () => {
  try {
    const response = await API.get("/doctor/today-appointments/");
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



export const getConsultationPage = async (appointmentId) => {
try {
const response = await API.get(
`/doctor/consultation/${appointmentId}/`
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
      "/doctor/consultations/",
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