import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/doctor/dashboard",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
];

const DoctorSidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="h-full backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-blue-400 font-bold text-lg tracking-widest">
                DOCTOR
              </span>
            </div>
          )}
          <button
            onClick={onToggle}
            className="text-white/60 hover:text-blue-400 transition"
          >
            ☰
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-blue-400/20 text-blue-300 border border-blue-400/40"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* USER + LOGOUT */}
        <div className="border-t border-white/10 p-4">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-white font-semibold text-sm">
                {user?.first_name
                  ? `Dr. ${user.first_name} ${user.last_name || ""}`.trim()
                  : user?.username || "Doctor"}
              </p>
              <p className="text-xs text-blue-400/80">Doctor</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full text-left text-red-400 hover:text-red-300 text-sm transition"
          >
            {collapsed ? "⏏" : "Logout"}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
