

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { MdPhoneInTalk, MdLogin } from "react-icons/md";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="fixed w-full bg-white shadow-lg z-50 border-b-[3px] border-[#D4AF37]/30 font-poppins">

      {/* Top Contact Bar */}
      <div className="hidden lg:flex justify-end bg-[#1B4360] text-white py-2 px-4 lg:px-6 text-[12px] font-bold uppercase tracking-wide space-x-6">
        <div className="flex items-center space-x-1 transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
          <MdPhoneInTalk className="text-[#D4AF37] text-lg" />
          <span>Emergency: +91 000 000 0000</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="relative max-w-7xl mx-auto flex items-center py-2 lg:py-5 px-4 md:px-6">

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center space-x-3 md:space-x-4 cursor-pointer transform hover:scale-105 transition-transform duration-300 ease-in-out flex-[0_0_30%]"
        >
          <img
            src="https://img.icons8.com/ios-filled/80/1B4360/hospital-room.png"
            alt="Hospital Logo"
            className="h-12 md:h-14 w-12 md:w-14 rounded-full border-2 border-[#D4AF37] object-contain shadow-md"
          />
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-[#1B4360]">
              MediCare+
            </h1>
            <p
              className="text-[9px] sm:text-[10px] md:text-[12px] font-bold uppercase tracking-[0.25em]"
              style={{ color: "#D4AF37" }}
            >
              Hospital & Research
            </p>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex justify-center flex-[1] space-x-7 lg:space-x-7.5 font-semibold text-sm md:text-base lg:text-lg uppercase tracking-wide text-[#1B4360] pr-10">
          {["About", "Specialities", "Doctors", "Facilities", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="relative group transform hover:-translate-y-1 hover:text-[#D4AF37] transition-all duration-300 ease-in-out"
            >
              {item}
              <span className="absolute -bottom-1 left-0 w-0 h-1.5 bg-[#D4AF37] rounded-full transition-all duration-500 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Login Button (Desktop) */}
        <div className="hidden md:flex flex-[0_0_30%] justify-end">
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center px-6 py-2 rounded-md font-bold text-sm uppercase tracking-wide shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out"
            style={{ backgroundColor: "#1B4360", color: "#D4AF37", minWidth: "150px" }}
          >
            <MdLogin className="mr-2 text-lg" /> Login
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="p-2 text-[#1B4360] hover:text-[#D4AF37] transition-colors duration-300 ease-in-out"
          >
            {menuOpen ? <HiX size={28} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-2xl animate-slide-down flex flex-col gap-2">
          {["About", "Specialities", "Doctors", "Facilities", "Testimonials", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={toggleMenu}
              className="block px-6 py-5 border-b border-gray-50 text-[#1B4360] font-bold uppercase tracking-wide text-base sm:text-lg hover:bg-[#F1D279]/20 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              {item}
            </a>
          ))}

          {/* Mobile Login */}
          <button
            onClick={() => {
              toggleMenu();
              navigate("/login");
            }}
            className="w-full flex justify-center items-center py-3 font-bold uppercase tracking-wide text-base sm:text-lg transform hover:scale-105 transition-all duration-300 ease-in-out"
            style={{ backgroundColor: "#1B4360", color: "#D4AF37" }}
          >
            <MdLogin className="mr-2 text-base sm:text-lg" /> Login
          </button>
        </div>
      )}
    </nav>
  );
};
// 
export default Navbar;


