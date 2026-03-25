import React from "react";
import homeCareImage from "../../assets/homecare.png"; // add image

const HomeCareSection = () => {
  return (
    <div className="w-full bg-white py-16 flex justify-center">

      <div className="w-[90%] grid md:grid-cols-2 gap-10 items-center">

        {/* Left - Content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Home Care Services
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            We bring healthcare to your doorstep with our professional home care services. 
            From nursing support to post-surgical care, our team ensures you receive the 
            best treatment in the comfort of your home.
          </p>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            Learn More
          </button>
        </div>

        {/* Right - Image */}
        <div>
          <img
            src={homeCareImage}
            alt="Home Care"
            className="w-full rounded-2xl shadow-md"
          />
        </div>

      </div>

    </div>
  );
};

export default HomeCareSection;