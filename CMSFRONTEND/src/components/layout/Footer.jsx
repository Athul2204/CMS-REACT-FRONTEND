import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1B4360] text-white font-poppins">

      {/* Main Row */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4 text-sm md:text-base">

        {/* Left */}
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-[#D4AF37] text-lg">MediCare+</h2>
          <span className="hidden sm:block text-white">
            Compassionate Healthcare
          </span>
        </div>

        {/* Center */}
        <div className="flex flex-wrap justify-center gap-5 font-medium">
          {["Home", "About", "Specialities", "Doctors", "Facilities", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-white hover:text-[#D4AF37] transition"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <span className="hidden md:block text-white">📍 Kochi</span>
          <span className="hidden md:block text-white">📞 +91 98765 43210</span>

          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="text-white hover:text-[#D4AF37] transition text-lg"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>

      {/* Thin Copyright Row */}
      <div className="border-t border-white/10 text-center text-xs text-gray-300 py-1">
        © 2026 MediCare+. All rights reserved.
      </div>

    </footer>
  );
};

export default Footer;

// #CMSFRONTEND\src\components\layout\Footer.jsx