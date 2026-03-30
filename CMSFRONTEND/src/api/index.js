import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔹 REQUEST INTERCEPTOR (attach access token)
API.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR (refresh token logic)
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // 🔴 If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = sessionStorage.getItem("refresh");

        // ❗ If no refresh token → logout
        if (!refresh) {
          sessionStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // 🔄 CALL REFRESH API
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // ✅ STORE NEW ACCESS TOKEN
        sessionStorage.setItem("access", newAccess);

        // 🔁 UPDATE HEADER + RETRY ORIGINAL REQUEST
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return API(originalRequest);

      } catch (err) {
        // 🔴 Refresh token expired → force logout
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;