import React from "react";

const specialities = [
  "Neuro Surgery",
  "Neurology",
  "Cardiology",
  "Cardio Thoracic",
  "Nephrology",
  "Gastroenterology",
  "Paediatrics",
  "Pulmonology",
  "Critical Care",
  "Gynaecology",
  "Orthopaedics",
  "Urology",
];

const SpecialitiesSection = () => {
  return (
    <div className="w-full bg-[#eaf3f1] py-16 flex justify-center">

      <div className="w-[90%] text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4">
          Centers of Excellence
        </h2>

        <p className="text-gray-600 mb-12">
          Behind the word mountains, far from the countries Vokalia and Consonantia.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">

          {specialities.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col items-center gap-3 cursor-pointer"
            >
              {/* Icon Circle */}
              <div className="w-14 h-14 bg-purple-700 text-white flex items-center justify-center rounded-full text-xl">
                +
              </div>

              {/* Title */}
              <p className="font-semibold text-gray-700">
                {item}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default SpecialitiesSection;