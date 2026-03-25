import React from "react";
import heroImage from "../../assets/hospital.png"; // add your image here

const HeroSection = () => {
  return (
    <div className="relative w-full h-[500px]">

      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hospital"
        className="w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
        
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Comprehensive Medical Services
        </h1>

        <p className="text-lg md:text-xl max-w-2xl">
          From preventive care to specialized treatments — everything under one roof.
        </p>

      </div>

      {/* Left Arrow (optional UI) */}
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer">
        ‹
      </div>

      {/* Right Arrow (optional UI) */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer">
        ›
      </div>

    </div>
  );
};

export default HeroSection;