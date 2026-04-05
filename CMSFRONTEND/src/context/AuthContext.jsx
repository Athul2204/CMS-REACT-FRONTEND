// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import API from "../api/index";

const AuthContext = createContext();

const ROLE_DASHBOARDS = {
  admin:         "/admin/dashboard",
  doctor:        "/doctor/dashboard",
  receptionist:  "/reception/dashboard",
  pharmacist:    "/pharmacist/dashboard",
  labtechnician: "/labtechnician/dashboard",
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Shared logout logic ────────────────────────────────────────
  // useCallback so we can safely reference it in an event listener.
  const logout = useCallback(async () => {
    try {
      await API.post("/api/auth/logout/");
    } catch {
      // Server-side cookie deletion failed — clear client state anyway.
    } finally {
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  // ─── Listen for the session-expired event from the API interceptor ──
  // When the refresh token is also dead, the interceptor fires this event
  // instead of doing a hard window.location.href redirect.
  useEffect(() => {
    const handleExpired = () => {
      setUser(null);
      navigate("/login");
    };

    window.addEventListener("auth:sessionExpired", handleExpired);
    return () => window.removeEventListener("auth:sessionExpired", handleExpired);
  }, [navigate]);

  // ─── Restore session on mount ────────────────────────────────────
  // /api/auth/me/ is in NO_RETRY_URLS so the interceptor will NOT attempt
  // a refresh here — a 401 just means "not logged in yet", handled below.
  useEffect(() => {
    API.get("/api/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))  // not logged in — show login page
      .finally(() => setLoading(false));
  }, []);

  // ─── Login ───────────────────────────────────────────────────────
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials); // { user: {...} }
      const profile = data.user;
      setUser(profile);

      const destination = ROLE_DASHBOARDS[profile.role];
      if (!destination) {
        // FIX 7: throw instead of silently logging so the Login page can
        // display an actionable error rather than appearing to hang.
        throw `Unknown role "${profile.role}". Contact your administrator.`;
      }
      navigate(destination);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // re-throw so Login page can display the message
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);