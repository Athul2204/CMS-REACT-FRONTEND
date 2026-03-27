import { FaProcedures, FaAmbulance, FaMicroscope, FaXRay, FaPrescriptionBottleAlt, FaHeartbeat, FaBed, FaCoffee } from "react-icons/fa";
import { GiHealthNormal, GiStethoscope, GiHospital } from "react-icons/gi";

const FacilitiesSection = () => {
  const facilities = [
    { name: "ICU", icon: <FaProcedures size={40} className="text-red-500" /> },
    { name: "24/7 Emergency", icon: <FaAmbulance size={40} className="text-yellow-500" /> },
    { name: "Surgery Rooms", icon: <GiStethoscope size={40} className="text-purple-500" /> },
    { name: "Laboratories", icon: <FaMicroscope size={40} className="text-blue-500" /> },
    { name: "Radiology", icon: <FaXRay size={40} className="text-green-500" /> },
    { name: "Pharmacy", icon: <FaPrescriptionBottleAlt size={40} className="text-orange-500" /> },
    { name: "Diagnostics", icon: <GiHealthNormal size={40} className="text-indigo-500" /> },
    { name: "Telemedicine", icon: <GiHospital size={40} className="text-pink-500" /> },
    { name: "Cardiology Lab", icon: <FaHeartbeat size={40} className="text-red-600" /> },
    { name: "Physiotherapy", icon: <FaProcedures size={40} className="text-teal-500" /> },
    { name: "Blood Bank", icon: <FaHeartbeat size={40} className="text-red-700" /> },
    { name: "Wellness Center", icon: <GiHealthNormal size={40} className="text-green-600" /> },
    { name: "Ambulance Service", icon: <FaAmbulance size={40} className="text-yellow-600" /> },
    { name: "Inpatient Wards", icon: <FaBed size={40} className="text-blue-600" /> },
    { name: "Cafeteria", icon: <FaCoffee size={40} className="text-orange-600" /> },
  ];

  return (
    <section
      id="facilities"
      className="relative py-20 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1580281657527-47cdd6d2e6f4?auto=format&fit=crop&w=1600&q=80')"
      }}
    >
      {/* Gradient Overlay (more premium than plain black) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1B4360]/90 via-[#1B4360]/70 to-black/70"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold mb-14 text-white tracking-tight">
          Our <span className="text-[#D4AF37]">Facilities</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <div className="mb-3 p-3 rounded-full bg-gray-100 shadow-inner">
                {facility.icon}
              </div>
              <p className="text-center font-semibold text-sm sm:text-base">
                {facility.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;