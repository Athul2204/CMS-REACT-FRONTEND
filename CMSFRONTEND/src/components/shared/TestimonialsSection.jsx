// const TestimonialsSection = () => {
//   const testimonials = [
//     { name: "Alice Johnson", feedback: "Excellent care and friendly staff!", img: "https://randomuser.me/api/portraits/women/1.jpg" },
//     { name: "Robert Smith", feedback: "State-of-the-art facilities and expert doctors.", img: "https://randomuser.me/api/portraits/men/2.jpg" },
//     { name: "Maria Garcia", feedback: "Highly recommend this hospital for all medical needs.", img: "https://randomuser.me/api/portraits/women/3.jpg" },
//     { name: "David Lee", feedback: "Professional staff and clean environment.", img: "https://randomuser.me/api/portraits/men/4.jpg" },
//     { name: "Sophia Brown", feedback: "Quick service and compassionate care.", img: "https://randomuser.me/api/portraits/women/5.jpg" },
//   ];

//   return (
//     <div className="py-16 bg-gray-50">
//       <h2 className="text-center text-3xl font-bold mb-10 text-blue-600">What Our Patients Say</h2>
//       <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 px-6">
//         {testimonials.map((t, i) => (
//           <div key={i} className="bg-white p-6 rounded-xl shadow hover:scale-105 transition flex flex-col items-center text-center">
//             <img src={t.img} alt={t.name} className="w-20 h-20 rounded-full mb-4" />
//             <p className="text-gray-600 mb-2">"{t.feedback}"</p>
//             <h3 className="font-bold">{t.name}</h3>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TestimonialsSection;

import { FaStar, FaQuoteLeft } from "react-icons/fa";

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Alice Johnson",
      feedback: "Excellent care and friendly staff!",
      img: "https://randomuser.me/api/portraits/women/1.jpg",
      rating: 5
    },
    {
      name: "Robert Smith",
      feedback: "State-of-the-art facilities and expert doctors.",
      img: "https://randomuser.me/api/portraits/men/2.jpg",
      rating: 5
    },
    {
      name: "Maria Garcia",
      feedback: "Highly recommend this hospital for all medical needs.",
      img: "https://randomuser.me/api/portraits/women/3.jpg",
      rating: 4
    },
    {
      name: "David Lee",
      feedback: "Professional staff and clean environment.",
      img: "https://randomuser.me/api/portraits/men/4.jpg",
      rating: 5
    },
    {
      name: "Sophia Brown",
      feedback: "Quick service and compassionate care.",
      img: "https://randomuser.me/api/portraits/women/5.jpg",
      rating: 4
    },
  ];

  return (
    <section
      id="testimonials"
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-[#1B4360]/60 to-[#D4AF37]/30 backdrop-blur-sm"></div>
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-4xl sm:text-5xl font-extrabold mb-14 text-white">
          What Our <span className="text-[#D4AF37]">Patients Say</span>
        </h2>

        {/* Slider */}
        <div className="overflow-hidden">
          <div className="flex gap-6 animate-scroll whitespace-nowrap hover:[animation-play-state:paused]">

            {[...testimonials, ...testimonials].map((t, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[320px] bg-white/95 backdrop-blur-md p-6 rounded-xl shadow-lg text-center flex-shrink-0"
              >
                <FaQuoteLeft className="text-[#D4AF37] mb-3 text-lg opacity-70" />

                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-4 border-[#D4AF37]"
                />

                <p className="text-gray-600 italic text-sm mb-3">
                  "{t.feedback}"
                </p>

                <div className="flex justify-center mb-2">
                  {[...Array(t.rating)].map((_, index) => (
                    <FaStar key={index} className="text-[#D4AF37] text-xs mx-0.5" />
                  ))}
                </div>

                <h3 className="font-bold text-[#1B4360] text-sm">
                  {t.name}
                </h3>
              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }

          .animate-scroll {
            animation: scroll 25s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default TestimonialsSection;