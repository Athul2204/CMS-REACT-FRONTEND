// src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // sends HttpOnly cookies on every request automatically
});

// REQUEST INTERCEPTOR — no token reading needed, cookie is sent by browser
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — cookie-based refresh
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token is in HttpOnly cookie — just call the endpoint,
        // no token body needed. Django reads cookie and sets new access cookie.
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        // Retry the original request — new access cookie is now set
        return API(originalRequest);
      } catch {
        // Refresh failed — redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;