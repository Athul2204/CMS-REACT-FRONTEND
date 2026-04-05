// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
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

  // User profile lives ONLY in React memory — never sessionStorage/localStorage
  const [user, setUser] = useState(null);

  // true while the /me/ call is in-flight on mount.
  // ProtectedRoute waits on this before deciding to redirect.
  const [loading, setLoading] = useState(true);

  // On mount: restore session from HttpOnly cookie via GET /api/auth/me/
  // If the cookie is gone/expired -> user stays null -> ProtectedRoute -> /login
  useEffect(() => {
    API.get("/api/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // LOGIN
  // Django sets tokens as HttpOnly cookies in the response.
  // We only store the user profile object in React state.
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);     // { user: {...} }
      const profile = data.user;
      setUser(profile);

      const destination = ROLE_DASHBOARDS[profile.role];
      if (!destination) {
        console.error("Unknown role:", profile.role);
        return;
      }
      navigate(destination);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // re-throw so Login page can display the message
    }
  };

  // LOGOUT
  // Calls /api/auth/logout/ which deletes the HttpOnly cookies server-side.
  const logout = async () => {
    try {
      await API.post("/api/auth/logout/");
    } catch {
      // Even if the server call fails, clear local state
    } finally {
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);