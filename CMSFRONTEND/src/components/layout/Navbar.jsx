import React from "react";

const Navbar = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white px-12 py-4 flex items-center justify-between">

      {/* Left - Logo + Name */}
      <div className="flex items-center gap-3">
        <div className="bg-white text-blue-600 font-bold px-3 py-2 rounded">
          SH
        </div>
        <h1 className="text-2xl font-semibold">Sheeps Hospital</h1>
      </div>

      {/* Center - Menu */}
      <div className="hidden md:flex gap-8 text-lg">
        <p className="cursor-pointer hover:text-gray-200">Home</p>
        <p className="cursor-pointer hover:text-gray-200">About</p>
        <p className="cursor-pointer hover:text-gray-200">Specialities</p>
        <p className="cursor-pointer hover:text-gray-200">Doctors</p>
        <p className="cursor-pointer hover:text-gray-200">Appointment</p>
        <p className="cursor-pointer hover:text-gray-200">FAQ</p>
      </div>

      {/* Right - Login Button */}
      <button className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition">
        Login
      </button>

    </div>
  );
};

export default Navbar;