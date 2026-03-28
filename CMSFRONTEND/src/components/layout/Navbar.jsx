import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // ✅ get login state
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white px-12 py-4 flex items-center justify-between">

      {/* Left - Logo + Name */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <div className="bg-white text-blue-600 font-bold px-3 py-2 rounded">
          SH
        </div>
        <h1 className="text-2xl font-semibold">Sheeps Hospital</h1>
      </div>

      {/* Center - Menu */}
      <div className="hidden md:flex gap-8 text-lg">
        <p onClick={() => navigate("/")} className="cursor-pointer hover:text-gray-200">Home</p>
        <p className="cursor-pointer hover:text-gray-200">About</p>
        <p className="cursor-pointer hover:text-gray-200">Specialities</p>
        <p className="cursor-pointer hover:text-gray-200">Doctors</p>
        <p className="cursor-pointer hover:text-gray-200">Appointment</p>
        <p className="cursor-pointer hover:text-gray-200">FAQ</p>
      </div>

      {/* Right - Auth Buttons */}
      <div>
        {!token ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition"
          >
            Login
          </button>
        ) : (
          <div className="flex items-center gap-4">
            
            {/* Role display */}
            <span className="text-sm capitalize">{role}</span>

            {/* Dashboard button */}
            <button
              onClick={() => navigate(`/${role}`)}
              className="bg-white text-blue-600 px-4 py-2 rounded"
            >
              Dashboard
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>
        )}
      </div>

    </div>
  );
};

export default Navbar;