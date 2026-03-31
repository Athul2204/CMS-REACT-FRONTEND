import React from "react";
import { useAuth } from "../../../context/AuthContext";

const DashboardHeader = ({ title }) => {
  const { user } = useAuth();

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      {/* 🧭 TITLE SECTION */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#F1D279] tracking-wide">
          {title}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Welcome back 👋
        </p>
      </div>

      {/* 👤 USER CARD */}
      {user && (
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl px-4 py-3 shadow-md">

          {/* 🟡 AVATAR */}
          <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-[#1B4360] flex items-center justify-center font-bold text-sm">
            {user.username?.charAt(0).toUpperCase()}
          </div>

          {/* 🧾 USER INFO */}
          <div className="text-sm">
            <p className="text-white font-medium leading-tight">
              {user.username}
            </p>
            <p className="text-gray-400 text-xs">
              {user.role}
            </p>
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardHeader;