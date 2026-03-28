import React from "react";
import chairmanImage from "../../assets/chairman.png"; // add image

const ChairmanSection = () => {
  return (
    <div className="w-full bg-[#eaf3f1] py-16 flex justify-center">

      <div className="w-[90%] grid md:grid-cols-2 gap-10 items-center">

        {/* Left - Image */}
        <div>
          <img
            src={chairmanImage}
            alt="Chairman"
            className="w-full rounded-2xl shadow-md"
          />
        </div>

        {/* Right - Content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Chairman’s Message
          </h2>

          <p className="text-gray-600 mb-6 leading-relaxed">
            At Sheeps Hospital, our vision is to redefine healthcare by combining 
            innovation, compassion, and excellence. We are committed to providing 
            world-class medical services while ensuring patient comfort and trust.
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Our dedicated team continues to work tirelessly to improve healthcare 
            standards and bring advanced treatments within reach of everyone.
          </p>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            Read More
          </button>
        </div>

      </div>

    </div>
  );
};

export default ChairmanSection;