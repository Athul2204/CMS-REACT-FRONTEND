import React from "react";
import { useAuth } from "../../../context/AuthContext";
import { FaUserMd } from "react-icons/fa";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  const doctorName = user?.first_name || user?.username || "Rajith";

  return (
    <div className="w-full sticky top-0 z-50">
      {/* 🔥 Header Container */}
      <div
        className="
        flex flex-col md:flex-row
        md:items-center justify-between

        gap-3 md:gap-0

        px-4 md:px-6 py-3

        bg-[#1e293b]   /* ✅ solid background */
        border-b border-white/10

        shadow-md
      "
      >
        {/* 🔹 LEFT */}
        <div className="flex items-center gap-3 md:gap-4">
          <div
            className="
            bg-gradient-to-br from-purple-500 to-pink-500
            text-white p-2 md:p-2.5 rounded-lg
          "
          >
            🏥
          </div>

          <h2 className="text-base md:text-xl font-semibold text-white tracking-wide">
            HMS | Doctor Dashboard
          </h2>
        </div>

        {/* 🔹 RIGHT */}
        <div className="flex flex-wrap items-center gap-3 md:gap-5">
          {/* 🟢 Active */}
          <div className="flex items-center gap-2 text-green-400 text-base md:text-lg font-medium whitespace-nowrap">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
            Active
          </div>

          {/* 👨‍⚕️ Doctor */}
          <div className="flex items-center gap-2 text-white whitespace-nowrap">
            <FaUserMd className="text-xl md:text-2xl text-gray-200" />{" "}
            {/* 🔥 bigger icon */}
            <span className="text-base md:text-lg font-semibold">
              {" "}
              {/* 🔥 bigger text */}
              Dr. {doctorName}
            </span>
          </div>

          {/* Divider */}
          <div className="hidden md:block h-5 w-px bg-white/20"></div>

          {/* 🔴 Logout */}
          <button
            onClick={logout}
            className="
              px-3 md:px-4 py-1.5 md:py-2
              rounded-full

              bg-gradient-to-r from-red-500 to-pink-500
              text-white font-semibold text-sm md:text-base

              hover:scale-105
              transition duration-200
              whitespace-nowrap
            "
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
