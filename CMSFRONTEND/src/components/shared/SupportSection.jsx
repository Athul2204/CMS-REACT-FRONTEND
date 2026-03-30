

import React from "react";

const supportData = [
  {
    title: "Support Services",
    desc: "We provide 24/7 support services to ensure patient comfort and safety.",
  },
  {
    title: "Blood Bank",
    desc: "Fully equipped blood bank with safe and reliable blood supply.",
  },
  {
    title: "Emergency ICU",
    desc: "Advanced ICU facilities with expert doctors and life-saving equipment.",
  },
];

const SupportSection = () => {
  return (
    <div className="w-full bg-white py-16 flex justify-center">

      <div className="w-[90%] text-center">

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-10">
          Support Services
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {supportData.map((item, index) => (
            <div
              key={index}
              className="bg-gray-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-3">
                {item.title}
              </h3>

              <p className="text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
};

export default SupportSection;

// 
