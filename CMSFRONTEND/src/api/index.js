import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 🔥 REQUEST INTERCEPTOR (attach token)
API.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("access");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// 🔥 RESPONSE INTERCEPTOR (handle expiry + refresh)
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🔴 If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = sessionStorage.getItem("refresh");

        // 🔄 call refresh API
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;

        // ✅ update only access token
        sessionStorage.setItem("access", newAccess);

        // 🔁 retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return API(originalRequest);

      } catch (err) {
        // 🔴 refresh token also expired → logout
        sessionStorage.clear();

        // redirect to login
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;