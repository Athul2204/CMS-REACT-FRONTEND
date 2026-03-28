import React from "react";
import aboutImage from "../../assets/hospital.png"; // use same or different image

const AboutSection = () => {
  return (
    <div className="w-full bg-white py-16 flex justify-center">
      
      <div className="w-[90%] grid md:grid-cols-2 gap-10 items-center">

        {/* Left Image */}
        <div>
          <img
            src={aboutImage}
            alt="Hospital"
            className="rounded-2xl shadow-md w-full"
          />
        </div>

        {/* Right Content */}
        <div>
          <h2 className="text-3xl font-bold mb-4">
            About Sheeps Hospital
          </h2>

          <p className="text-gray-600 mb-4 leading-relaxed">
            Sheeps Hospital stands as a symbol of trust, innovation, and excellence in modern healthcare. 
            We combine advanced medical technology with compassionate care to ensure every patient 
            receives world-class treatment in a comfortable and safe environment.
          </p>

          <p className="text-gray-600 mb-6 leading-relaxed">
            Our multidisciplinary team of highly qualified doctors, nurses, and healthcare professionals 
            work collaboratively to deliver personalized care tailored to each patient’s needs.
          </p>

          {/* Mission & Vision */}
          <div className="grid sm:grid-cols-2 gap-6">

            {/* Mission */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To provide accessible, affordable, and high-quality healthcare services with compassion.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-gray-600">
                To become a leading healthcare institution recognized for medical excellence.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AboutSection;