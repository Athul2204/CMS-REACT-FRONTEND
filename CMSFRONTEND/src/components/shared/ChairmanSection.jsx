import chairmanImg from "../../assets/chairman.jpeg";

const ChairmanSection = () => {
  return (
    <div
      className="py-20 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/8460157/pexels-photo-8460159.jpeg')",
      }}
    >
      {/* Softer Premium Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-[#1B4360]/60 to-black/70"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">

          {/* Chairman Image */}
          <img
            src={chairmanImg}
            alt="Chairman Dr. Binu Christin"
            className="rounded-xl shadow-lg w-full max-w-md mx-auto border-4 border-[#D4AF37]"
          />

          {/* Content */}
          <div>
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-4">
              Chairman's Message
            </h2>

            <h3 className="text-xl font-semibold text-white mb-3">
              Dr. Binu Christin MBBS, MD
            </h3>

            <p className="text-gray-200 mb-4 leading-relaxed">
              At our hospital, we are committed to delivering exceptional healthcare 
              services with compassion, integrity, and excellence. Our vision is to 
              create a patient-centered environment where every individual receives 
              personalized care supported by advanced medical technology and a highly 
              skilled team of professionals.
            </p>

            <p className="text-gray-300 mb-4 leading-relaxed">
              We believe that healthcare goes beyond treatment — it is about building 
              trust, ensuring comfort, and improving the quality of life for our 
              patients and their families. Through continuous innovation and a strong 
              commitment to quality, we strive to set new benchmarks in modern healthcare.
            </p>

            
          </div>

        </div>
      </div>
    </div>
  );
};

export default ChairmanSection;