import React from "react";

const DoctorsSection = () => {
  const doctors = [
    { name: "Dr. John Smith", spec: "Cardiologist", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop" },
    { name: "Dr. Sarah Lee", spec: "Neurologist", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop" },
    { name: "Dr. Michael Brown", spec: "Orthopedic Surgeon", img: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop" },
    { name: "Dr. Emma Wilson", spec: "Oncologist", img: "https://images.unsplash.com/photo-1559839734-2b71f1e3c77e?w=400&h=400&fit=crop" },
    { name: "Dr. William Davis", spec: "Pediatrician", img: "https://images.unsplash.com/photo-1612349316228-5942a9b489c2?w=400&h=400&fit=crop" },
    { name: "Dr. Olivia Martinez", spec: "Dermatologist", img: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&h=400&fit=crop" },
    { name: "Dr. James Taylor", spec: "ENT Specialist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
    { name: "Dr. Sophia Anderson", spec: "Gastroenterologist", img: "https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=400&h=400&fit=crop" },
    { name: "Dr. Daniel Thomas", spec: "Nephrologist", img: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop" },
    { name: "Dr. Isabella Harris", spec: "Pulmonologist", img: "https://images.unsplash.com/photo-1550831107-1553da8c8464?w=400&h=400&fit=crop" },
    { name: "Dr. Benjamin Clark", spec: "Endocrinologist", img: "https://images.unsplash.com/photo-1625492922105-5914617fd869?w=400&h=400&fit=crop" },
    { name: "Dr. Mia Lewis", spec: "Urologist", img: "https://images.unsplash.com/photo-1643297654416-05795d62e39c?w=400&h=400&fit=crop" },
    { name: "Dr. Ethan Walker", spec: "Radiologist", img: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=400&h=400&fit=crop" },
    { name: "Dr. Charlotte Hall", spec: "Physiotherapist", img: "https://images.unsplash.com/photo-1594824476968-0b85b8cead8d?w=400&h=400&fit=crop" },
    { name: "Dr. Alexander Young", spec: "Emergency Care", img: "https://images.unsplash.com/photo-1622902046580-2b47f47f0871?w=400&h=400&fit=crop" },
  ];

  // Using a higher resolution medical background
  const treatmentBg = "https://images.pexels.com/photos/6612644/pexels-photo-6612644.jpeg?auto=compress&cs=tinysrgb&w=1600";

  return (
    <section 
      id="doctors" 
      className="relative py-20 font-poppins bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${treatmentBg})` }}
    >
      {/* --- REVISED VISIBILITY OVERLAY --- */}
      {/* Light white tint + blur so the photo is very clear */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]"></div>
      
      {/* Gradient to ensure text remains readable against the photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60"></div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-16">
          <span className="text-[#D4AF37] font-bold tracking-[0.4em] uppercase text-[10px] mb-2 block drop-shadow-md">Our Specialists</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#1B4360] font-montserrat tracking-tight text-center leading-none">
            Meet the <span className="text-[#D4AF37]">Medical Board.</span>
          </h2>
          <div className="w-16 h-1 bg-[#D4AF37] mt-5 rounded-full shadow-sm"></div>
        </div>

        {/* --- STABLE GRID SYSTEM --- */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {doctors.map((doc, i) => (
            <div
              key={i}
              className="group relative bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-4 flex flex-col items-center text-center transition-all duration-500 hover:shadow-2xl hover:border-[#D4AF37] hover:bg-white/95 hover:-translate-y-2 overflow-hidden"
            >
              {/* Profile Image */}
              <div className="relative mb-3.5 flex-shrink-0">
                <img
                  src={doc.img}
                  alt={doc.name}
                  className="rounded-full w-24 h-24 md:w-28 md:h-28 object-cover border-[3px] border-white shadow-lg transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { 
                    const gender = doc.name.includes('Sarah') || doc.name.includes('Emma') || doc.name.includes('Olivia') || doc.name.includes('Sophia') || doc.name.includes('Isabella') || doc.name.includes('Mia') || doc.name.includes('Charlotte') ? 'female' : 'male';
                    e.target.src = `https://xsgames.co/randomusers/avatar.php?g=${gender}`; 
                  }} 
                />
                <div className="absolute bottom-1 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              {/* Fixed Height Text Area - Prevents card size jumping */}
              <div className="h-14 flex flex-col justify-center">
                <h3 className="font-extrabold text-[11px] md:text-[13px] text-[#1B4360] group-hover:text-[#D4AF37] transition-colors duration-300 uppercase leading-tight">
                  {doc.name}
                </h3>
                <p className="text-[#B5A165] text-[9px] md:text-[10px] font-bold uppercase tracking-widest mt-1.5 leading-none">
                  {doc.spec}
                </p>
              </div>

              {/* Hover Button - Absolute positioned or in reserved space */}
              <div className="h-8 mt-2"> 
                <button className="px-4 py-1.5 bg-[#1B4360] text-white text-[8px] font-black uppercase tracking-widest rounded shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Contact Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DoctorsSection;


// #CMSFRONTEND\src\components\shared\DoctorsSection.jsx