// src/api/authApi.js
import API from "./index";

export const loginUser = async (data) => {
  try {
    const response = await API.post("/api/auth/login/", data);
    // Response body is { user: { id, username, role, ... } }
    // Tokens are in HttpOnly cookies — never exposed to JS
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      const errData = error.response.data;
      const message =
        errData.detail ||
        errData.message ||
        JSON.stringify(errData);
      throw message;
    }
    throw "Something went wrong. Please try again.";
  }
};