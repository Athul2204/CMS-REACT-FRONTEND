// src/api/index.js
import axios from "axios";

const rawBaseURL = (import.meta.env.VITE_API_BASE_URL || "").trim();
const shouldUseDevProxy =
  import.meta.env.DEV &&
  (!rawBaseURL || /^(https?:\/\/)?localhost:8000\/?$/.test(rawBaseURL));
const apiBaseURL = shouldUseDevProxy ? "" : rawBaseURL;

const API = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true, // sends HttpOnly cookies on every request automatically
});

// ─── Refresh queue ────────────────────────────────────────────────
// Prevents multiple simultaneous 401s from each firing their own refresh.
// All queued requests share a single refresh attempt.
let isRefreshing = false;
let failedQueue = [];

function processQueue(error) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve();
    }
  });
  failedQueue = [];
}

// ─── URLs that must NEVER be retried ─────────────────────────────
// FIX 6: /api/auth/me/ is called on mount with no guarantee of a valid
// cookie (e.g. first visit, after logout). Without it in this list the
// interceptor tried to refresh → refresh also 401'd → infinite loop /
// stale isRefreshing lock. Adding it here lets the .catch() in
// AuthContext handle the unauthenticated state cleanly.
const NO_RETRY_URLS = [
  "/api/auth/refresh/",
  "/api/auth/login/",
  "/api/auth/logout/",
  "/api/auth/me/",   // FIX 6: do not attempt a refresh for the session-restore call
];

const isNoRetryUrl = (config) =>
  NO_RETRY_URLS.some((url) => config?.url?.includes(url));

// ─── Request interceptor ──────────────────────────────────────────
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ─── Response interceptor ─────────────────────────────────────────
API.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Not a 401, or already retried, or a protected URL — bail immediately.
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isNoRetryUrl(originalRequest)
    ) {
      return Promise.reject(error);
    }

    // Mark so this request is never retried a second time.
    originalRequest._retry = true;

    // If a refresh is already in-flight, queue this request behind it.
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => API(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const refreshUrl = apiBaseURL
        ? `${apiBaseURL}/api/auth/refresh/`
        : "/api/auth/refresh/";

      await axios.post(
        refreshUrl,
        {},
        { withCredentials: true }
      );

      // Refresh succeeded — wake up all waiting requests.
      processQueue(null);
      return API(originalRequest);
    } catch (refreshError) {
      // Refresh failed — reject every queued request and clear the user
      // session via a custom event. AuthContext listens for this and calls
      // logout(), which uses React Router navigate() — no hard reload.
      processQueue(refreshError);
      window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default API;