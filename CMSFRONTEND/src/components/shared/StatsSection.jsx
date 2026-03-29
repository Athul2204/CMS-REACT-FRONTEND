


import { FaUserInjured, FaUserMd, FaBed, FaAward, FaProcedures, FaMicroscope, FaHospital, FaAmbulance } from "react-icons/fa";
import useCounter from "../../hooks/useCounter";

const StatsSection = () => {
  const patients = useCounter(50000);
  const doctors = useCounter(200);
  const beds = useCounter(500);
  const years = useCounter(25);

  const stats = [
    { title: "Patients Treated", value: patients + "+", icon: <FaUserInjured /> },
    { title: "Specialists", value: doctors + "+", icon: <FaUserMd /> },
    { title: "Beds Available", value: beds + "+", icon: <FaBed /> },
    { title: "Years Excellence", value: years + "+", icon: <FaAward /> },
    { title: "Surgery Rooms", value: "20+", icon: <FaProcedures /> },
    { title: "Labs", value: "15+", icon: <FaMicroscope /> },
    { title: "ICU Beds", value: "50+", icon: <FaHospital /> },
    { title: "Ambulances", value: "10+", icon: <FaAmbulance /> },
  ];

  // Professional Medical Architecture Background
  const bgImage = "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <section className="relative py-20 font-poppins overflow-hidden">
      
      {/* Background Image with Fixed Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-1000 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      
      {/* Deep Blue Overlay (Matching RHIMS logo Blue) */}
      <div className="absolute inset-0 bg-[#1B4360]/80 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16">
           <span className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-xs mb-3">Our Footprint</span>
           <h2 className="text-4xl md:text-5xl font-extrabold text-center text-white mb-2 font-montserrat tracking-tighter">
             Numbers that Define <span className="text-[#D4AF37]">Excellence</span>
           </h2>
           <div className="w-20 h-1 bg-[#D4AF37] mt-3"></div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
          {stats.map((s, i) => (
            <div
              key={i}
              className="group relative bg-white/5 border border-white/10 backdrop-blur-xl rounded-sm p-8 flex flex-col items-center justify-center text-center transition-all duration-700 ease-in-out hover:border-[#D4AF37] overflow-hidden group"
            >
              {/* THE NEW HOVER MECHANISM: Golden Fill from bottom */}
              <div className="absolute bottom-0 left-0 w-full h-0 bg-gradient-to-t from-[#D4AF37] to-[#F1D279] transition-all duration-700 ease-in-out group-hover:h-full z-[-1]"></div>

              {/* Icon - Sizes & Alignment Fixed */}
              <div className="mb-6 text-5xl text-[#D4AF37] group-hover:text-[#1B4360] transition-colors duration-500 transform group-hover:rotate-12">
                {s.icon}
              </div>
              
              {/* Counter Value - Montserrat font for authority */}
              <h3 className="text-4xl md:text-6xl font-black text-white group-hover:text-[#1B4360] tracking-tighter font-montserrat transition-colors duration-500">
                {s.value}
              </h3>
              
              {/* Label - Light Gold becomes Deep Blue on hover */}
              <p className="mt-3 text-[#F1D279] group-hover:text-[#1B4360] font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-colors duration-500">
                {s.title}
              </p>
              
              {/* Subtle Golden Corner Glow */}
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[1px]"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;