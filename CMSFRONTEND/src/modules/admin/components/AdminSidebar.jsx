import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Staff", path: "/admin/staff" },
  { label: "Doctors", path: "/admin/doctors" },
  { label: "Receptionists", path: "/admin/receptionists" },
  { label: "Lab Technicians", path: "/admin/lab-technicians" },
  { label: "Pharmacists", path: "/admin/pharmacists" },
  { label: "Audit Logs", path: "/admin/audit-logs" },
];

const AdminSidebar = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-50 transition-all duration-300
      ${collapsed ? "w-16" : "w-64"}`}
    >
      {/* GLASS BACKGROUND */}
      <div className="h-full backdrop-blur-xl bg-white/10 border-r border-white/20 shadow-xl flex flex-col">

        {/* HEADER */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!collapsed && (
            <span className="text-[#D4AF37] font-bold text-lg tracking-widest">
              CMS
            </span>
          )}
          <button
            onClick={onToggle}
            className="text-[#1E293B] hover:text-[#D4AF37] transition"
          >
            ☰
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 mx-2 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-[#D4AF37]/20 text-[#1B4360] border border-[#D4AF37]/40"
                    : "text-[#1E293B] hover:bg-white/20"
                }`
              }
            >
              {!collapsed && item.label}
            </NavLink>
          ))}
        </nav>

        {/* USER + LOGOUT */}
        <div className="border-t border-white/10 p-4">
          {!collapsed && (
            <div className="mb-3">
              <p className="text-[#1E293B] font-semibold">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}

          <button
            onClick={logout}
            className="w-full text-left text-red-500 hover:text-red-400 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;