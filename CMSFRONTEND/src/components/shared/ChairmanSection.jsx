// import React from "react";
// import chairmanImage from "../../assets/chairman.png"; // add image

// const ChairmanSection = () => {
//   return (
//     <div className="w-full bg-[#eaf3f1] py-16 flex justify-center">

//       <div className="w-[90%] grid md:grid-cols-2 gap-10 items-center">

//         {/* Left - Image */}
//         <div>
//           <img
//             src={chairmanImage}
//             alt="Chairman"
//             className="w-full rounded-2xl shadow-md"
//           />
//         </div>

//         {/* Right - Content */}
//         <div>
//           <h2 className="text-3xl font-bold mb-4">
//             Chairman’s Message
//           </h2>

//           <p className="text-gray-600 mb-6 leading-relaxed">
//             At Sheeps Hospital, our vision is to redefine healthcare by combining 
//             innovation, compassion, and excellence. We are committed to providing 
//             world-class medical services while ensuring patient comfort and trust.
//           </p>

//           <p className="text-gray-600 mb-6 leading-relaxed">
//             Our dedicated team continues to work tirelessly to improve healthcare 
//             standards and bring advanced treatments within reach of everyone.
//           </p>

//           <button className="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
//             Read More
//           </button>
//         </div>

//       </div>

//     </div>
//   );
// };

// export default ChairmanSection;


const ChairmanSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="grid md:grid-cols-2 max-w-6xl mx-auto gap-10 items-center px-6">
        <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a4?auto=format&fit=crop&w=500&q=80" className="rounded-xl shadow" />
        <div>
          <h2 className="text-3xl font-bold text-blue-600 mb-4">Chairman's Message</h2>
          <p className="text-gray-600 mb-4">
            Welcome to our hospital. Our mission is to deliver high-quality healthcare with compassion, innovation, and global standards. We continuously strive to make healthcare accessible and effective for every patient.
          </p>
          <ul className="list-disc ml-6 text-gray-600 space-y-2">
            <li>Patient-first approach</li>
            <li>Advanced medical technology</li>
            <li>World-class specialists</li>
            <li>Comprehensive care programs</li>
            <li>Research and development</li>
            <li>Medical education initiatives</li>
            <li>Community outreach</li>
            <li>Global collaborations</li>
            <li>Quality and safety standards</li>
            <li>24/7 emergency services</li>
            <li>Modern infrastructure</li>
            <li>Continuous improvement programs</li>
            <li>Telemedicine and digital care</li>
            <li>Wellness and preventive care</li>
            <li>International patient services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChairmanSection;

// #CMSFRONTEND\src\components\shared\ChairmanSection.jsx