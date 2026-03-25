import React from "react";

const statsData = [
  { value: "25+", label: "Experienced Doctors" },
  { value: "10+", label: "Medical Departments" },
  { value: "5000+", label: "Happy Patients" },
  { value: "24/7", label: "Emergency Services" },
];

const StatsSection = () => {
  return (
    <div className="w-full bg-gray-100 py-16 flex justify-center">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-[90%]">
        
        {statsData.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl shadow-lg p-10 text-center hover:scale-105 transition"
          >
            <h1 className="text-4xl font-bold mb-2">
              {item.value}
            </h1>
            <p className="text-lg">
              {item.label}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default StatsSection;