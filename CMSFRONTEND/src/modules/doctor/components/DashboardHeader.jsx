import React from "react";
import { useAuth } from "../../../context/AuthContext";

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-white px-6 py-4 rounded-xl shadow mb-6">

      {/* 🔹 Left: Logo + Title */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-500 text-white p-2 rounded-lg">
          🏥
        </div>
        <h2 className="text-xl font-semibold">
          HMS | Doctor Dashboard
        </h2>
      </div>

      {/* 🔹 Right */}
      <div className="flex items-center gap-4">

        <span className="text-green-600 font-medium">● Active</span>

        <span className="text-gray-700 font-medium">
          {user?.name || user?.username || "Doctor"}
        </span>

        <button
          onClick={logout}
          className="text-red-500 hover:underline"
        >
          Logout
        </button>

      </div>
    </div>
  );
};

export default DashboardHeader;