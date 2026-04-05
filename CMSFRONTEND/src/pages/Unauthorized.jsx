// src/pages/Unauthorized.jsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ROLE_DASHBOARDS = {
  admin:         "/admin/dashboard",
  doctor:        "/doctor/dashboard",
  receptionist:  "/reception/dashboard",
  pharmacist:    "/pharmacist/dashboard",
  labtechnician: "/labtechnician/dashboard",
};

export default function Unauthorized() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user ? ROLE_DASHBOARDS[user.role] : "/login";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        gap: "1rem",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <div style={{ fontSize: "2.5rem" }}>🔒</div>
      <h1 style={{ fontSize: "1.4rem", fontWeight: 600, margin: 0 }}>
        Access Denied
      </h1>
      <p style={{ color: "#6b7280", maxWidth: 360, margin: 0, fontSize: "14px" }}>
        {user
          ? `You are logged in as ${user.role}. This section is not accessible to your role.`
          : "You are not logged in."}
      </p>

      <button
        onClick={() => navigate(dashboardPath)}
        style={{
          marginTop: "0.5rem",
          padding: "0.6rem 1.5rem",
          background: "#1d4ed8",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        {user ? "Go to my dashboard" : "Go to login"}
      </button>

      {user && (
        <button
          onClick={logout}
          style={{
            padding: "0.4rem 1rem",
            background: "transparent",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#6b7280",
          }}
        >
          Logout
        </button>
      )}
    </div>
  );
}