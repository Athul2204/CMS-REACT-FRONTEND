import React from "react";
import { FaUserMd, FaAmbulance, FaMicroscope, FaHospitalSymbol } from "react-icons/fa";

const HeroSection = () => {
  const bgImage = "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=2000&auto=format&fit=crop";

  return (
    <div
      className="h-screen bg-cover bg-center flex items-center relative font-poppins"
      style={{ backgroundImage: `url("${bgImage}")` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/60 w-full h-full flex items-center">
        <div className="container mx-auto px-6 z-10">
          <div className="max-w-4xl">
            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Advanced Care. <br />
              <span className="text-[#1B4360]">Compassionate Healing.</span>
            </h1>

            {/* Subheading */}
            <p className="mb-8 text-lg md:text-xl text-gray-200 max-w-2xl font-light">
              Delivering world-class healthcare with state-of-the-art technology, 
              highly trained specialists, and personalized patient care.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#1B4360] hover:bg-[#D4AF37] hover:text-[#1B4360] text-white px-10 py-4 rounded-full font-semibold shadow-xl transition-all duration-300">
                Book Appointment
              </button>
              <button className="backdrop-blur-md border-2 border-white/50 text-white px-10 py-4 rounded-full font-semibold hover:bg-[#D4AF37] hover:text-[#1B4360] transition-all duration-300">
                Emergency Services
              </button>
            </div>

            {/* Icon Cards */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* ICU */}
              <div className="flex flex-col items-center md:items-start group">
                <FaHospitalSymbol className="w-12 h-12 mb-2 text-[#D4AF37] group-hover:scale-125 transition-transform duration-300" />
                <p className="text-white font-medium text-xs uppercase tracking-widest">24/7 ICU</p>
              </div>

              {/* Doctors */}
              <div className="flex flex-col items-center md:items-start group">
                <FaUserMd className="w-12 h-12 mb-2 text-[#D4AF37] group-hover:scale-125 transition-transform duration-300" />
                <p className="text-white font-medium text-xs uppercase tracking-widest">Expert Doctors</p>
              </div>

              {/* Ambulance */}
              <div className="flex flex-col items-center md:items-start group">
                <FaAmbulance className="w-12 h-12 mb-2 text-[#D4AF37] group-hover:scale-125 transition-transform duration-300" />
                <p className="text-white font-medium text-xs uppercase tracking-widest">Emergency</p>
              </div>

              {/* Labs */}
              <div className="flex flex-col items-center md:items-start group">
                <FaMicroscope className="w-12 h-12 mb-2 text-[#D4AF37] group-hover:scale-125 transition-transform duration-300" />
                <p className="text-white font-medium text-xs uppercase tracking-widest">Advanced Labs</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;