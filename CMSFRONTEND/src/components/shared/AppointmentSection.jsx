import { FaClock, FaUserMd, FaVideo, FaHospital } from "react-icons/fa";

const AppointmentSection = () => {
  return (
    <section
      id="contact"
      className="relative py-20 text-white text-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#1B4360]/70 to-[#D4AF37]/30"></div>

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6">
          Book Your <span className="text-[#D4AF37]">Appointment</span>
        </h2>

        {/* Subtitle */}
        <p className="mb-10 text-lg text-gray-200 max-w-2xl mx-auto">
          Schedule a consultation with our expert doctors online in just a few clicks.
        </p>

        {/* Button */}
        <button className="bg-[#D4AF37] text-[#1B4360] px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300">
          Book Now
        </button>

        {/* Features */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="flex flex-col items-center group">
            <FaClock className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition" />
            <p className="font-semibold">24/7 Booking</p>
          </div>

          <div className="flex flex-col items-center group">
            <FaUserMd className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition" />
            <p className="font-semibold">Specialists Available</p>
          </div>

          <div className="flex flex-col items-center group">
            <FaVideo className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition" />
            <p className="font-semibold">Online Consultation</p>
          </div>

          <div className="flex flex-col items-center group">
            <FaHospital className="text-4xl mb-3 text-[#D4AF37] group-hover:scale-110 transition" />
            <p className="font-semibold">Multiple Clinics</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AppointmentSection;

// #CMSFRONTEND\src\components\shared\AppointmentSection.jsx