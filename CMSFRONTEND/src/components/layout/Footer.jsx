import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-700 to-blue-500 text-white py-12 flex justify-center">

      <div className="w-[90%] grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* About */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Sheeps Hospital</h2>
          <p className="text-gray-200">
            Providing world-class healthcare services with compassion and care.
            Your health is our priority.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
          <ul className="space-y-2 text-gray-200">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Doctors</li>
            <li className="hover:text-white cursor-pointer">Services</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
          <p className="text-gray-200 mb-2">📍 Kochi, Kerala</p>
          <p className="text-gray-200 mb-2">📞 +91 98765 43210</p>
          <p className="text-gray-200">✉️ info@sheepshospital.com</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div className="absolute bottom-0 w-full text-center text-gray-300 text-sm pb-4">
        © 2026 Sheeps Hospital. All rights reserved.
      </div>

    </div>
  );
};

export default Footer;