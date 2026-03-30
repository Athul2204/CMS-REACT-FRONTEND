


import React from "react";
// Reverting to the standard /fa folder for maximum stability
import { 
  FaHeartbeat, FaBrain, FaBone, FaLungs, FaBaby, 
  FaStethoscope, FaSyringe, FaBiohazard, FaMicroscope, 
  FaRadiation, FaWalking, FaAmbulance 
} from "react-icons/fa";
import { MdOutlineFace, MdOutlineBloodtype, MdEarbuds } from "react-icons/md";

const SpecialitiesSection = () => {
  const specialities = [
    { name: "Cardiology", icon: <FaHeartbeat /> },
    { name: "Neurology", icon: <FaBrain /> },
    { name: "Orthopedics", icon: <FaBone /> },
    { name: "Pulmonology", icon: <FaLungs /> },
    { name: "Pediatrics", icon: <FaBaby /> },
    { name: "ENT", icon: <MdEarbuds /> },
    { name: "Oncology", icon: <FaBiohazard /> },
    { name: "Gastro", icon: <FaStethoscope /> },
    { name: "Nephrology", icon: <FaSyringe /> },
    { name: "Dermatology", icon: <MdOutlineFace /> },
    { name: "Urology", icon: <MdOutlineBloodtype /> },
    { name: "Radiology", icon: <FaRadiation /> },
    { name: "Physio", icon: <FaWalking /> },
    { name: "Emergency", icon: <FaAmbulance /> },
    { name: "Diagnostics", icon: <FaMicroscope /> }
  ];

  const bgImage = "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <section 
      id="specialities" 
      className="relative py-14 font-poppins overflow-hidden bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* RICH CHARCOAL OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#1a1c1e]/98 via-[#2c3e50]/90 to-[#1a1c1e]/98 backdrop-blur-[2px]"></div>

      <div className="relative max-w-6xl mx-auto px-6 z-10">
        
        {/* Compact Header */}
        <div className="mb-10 text-center md:text-left">
           <span className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-[9px] mb-1 block">Expert Care</span>
           <h2 className="text-3xl md:text-5xl font-black text-white font-montserrat tracking-tight">
             Specialized <span className="text-[#D4AF37]">Services.</span>
           </h2>
        </div>

        {/* --- TIGHT GRID WITH SPECIFIC FONT SIZES --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {specialities.map((item, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center p-3 text-center transition-all duration-300 hover:border-[#D4AF37]/60 overflow-hidden"
            >
              {/* PEARL WHITE HOVER FILL */}
              <div className="absolute inset-0 w-full h-full bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

              {/* ICON SIZE: 24px - 28px */}
              <div className="relative z-10 text-[24px] md:text-[28px] mb-1.5 text-[#D4AF37] group-hover:text-[#2c3e50] transition-colors duration-300">
                {item.icon}
              </div>

              {/* FONT SIZE: 9px (Mobile) | 11px (Desktop) */}
              <h3 className="relative z-10 font-bold text-[9px] md:text-[11px] text-white group-hover:text-[#2c3e50] uppercase tracking-tighter md:tracking-normal transition-colors duration-300 leading-none px-1">
                {item.name}
              </h3>

              {/* LABEL FONT SIZE: 7px */}
              <div className="relative z-10 mt-1.5 opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[7px] font-black text-gray-400 group-hover:text-[#2c3e50]/60 tracking-widest uppercase">
                  RHIMS
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialitiesSection;

