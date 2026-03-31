// import React from "react";

// const Pagination = ({ next, previous, onNext, onPrevious, loading }) => {
//   if (!next && !previous) return null;

//   return (
//     <div className="flex items-center justify-end gap-3 mt-6">
      
//       {/* PREVIOUS */}
//       <button
//         onClick={onPrevious}
//         disabled={!previous || loading}
//         className={`px-4 py-2 text-sm rounded-lg transition ${
//           previous && !loading
//             ? "bg-white/70 backdrop-blur-md border border-white/40 text-[#1E293B] hover:border-[#D4AF37]"
//             : "bg-gray-200 text-gray-400 cursor-not-allowed"
//         }`}
//       >
//         ← Previous
//       </button>

//       {/* NEXT */}
//       <button
//         onClick={onNext}
//         disabled={!next || loading}
//         className={`px-4 py-2 text-sm rounded-lg font-semibold transition ${
//           next && !loading
//             ? "bg-[#D4AF37] text-[#1E293B] hover:bg-[#F1D279]"
//             : "bg-gray-200 text-gray-400 cursor-not-allowed"
//         }`}
//       >
//         {loading ? "Loading..." : "Next →"}
//       </button>

//     </div>
//   );
// };

// export default Pagination;


import React from "react";

const Pagination = ({ next, previous, onNext, onPrevious, loading }) => {
  if (!next && !previous) return null;

  return (
    <div className="flex items-center justify-end gap-4 mt-6">

      {/* PREVIOUS */}
      <button
        onClick={onPrevious}
        disabled={!previous || loading}
        className={`px-5 py-2.5 text-base font-medium rounded-lg transition border ${
          previous && !loading
            ? "bg-white text-[#1E293B] border-gray-300 hover:border-[#D4AF37] hover:shadow-md"
            : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-200"
        }`}
      >
        ← Previous
      </button>

      {/* NEXT */}
      <button
        onClick={onNext}
        disabled={!next || loading}
        className={`px-5 py-2.5 text-base font-semibold rounded-lg transition ${
          next && !loading
            ? "bg-[#1B4360] text-white hover:bg-[#16324a] shadow-md"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {loading ? "Loading..." : "Next →"}
      </button>

    </div>
  );
};

export default Pagination;