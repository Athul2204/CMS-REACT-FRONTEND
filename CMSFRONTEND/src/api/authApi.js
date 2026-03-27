import API from "./index";

// 🔐 LOGIN API
export const loginUser = async (data) => {
  try {
    const response = await API.post("/api/auth/login/", data);
    return response.data;
  } catch (error) {
    // 🔥 clean error handling
    if (error.response && error.response.data) {
      const errData = error.response.data;

      // handle different backend formats
      const message =
        errData.detail ||
        errData.message ||
        JSON.stringify(errData);

      throw message;
    }

    throw "Something went wrong. Please try again.";
  }
};