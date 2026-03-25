import React from "react";

const EmergencySection = () => {
  return (
    <div className="w-full flex flex-col md:flex-row">

      {/* Left Side - Ambulance Info */}
      <div className="md:w-1/2 bg-blue-700 text-white p-12 flex flex-col justify-center">
        
        <h2 className="text-3xl font-bold mb-4">
          24/7 Ambulance Service
        </h2>

        <p className="mb-6 text-lg">
          Our emergency medical services are available round the clock. 
          Quick response, expert care, and safe transportation when you need it the most.
        </p>

        <button className="bg-white text-blue-700 px-6 py-2 rounded-full font-semibold w-fit">
          Call Now
        </button>

      </div>

      {/* Right Side - Emergency Numbers */}
      <div className="md:w-1/2 bg-green-500 text-white p-12 flex flex-col justify-center">
        
        <h2 className="text-3xl font-bold mb-6">
          Emergency Contact
        </h2>

        <p className="text-lg mb-2">+91 98765 43210</p>
        <p className="text-lg mb-2">+91 91234 56789</p>
        <p className="text-lg">+91 99887 66554</p>

      </div>

    </div>
  );
};

export default EmergencySection;