// import React from "react";

// const CARD_CONFIG = [
//   {
//     key: "total_staff",
//     label: "Total Staff",
//     color: "#38bdf8",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
//         <circle cx="9" cy="7" r="4" />
//         <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
//       </svg>
//     ),
//   },
//   {
//     key: "active_staff",
//     label: "Active Staff",
//     color: "#34d399",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <polyline points="20 6 9 17 4 12" />
//       </svg>
//     ),
//   },
//   {
//     key: "total_doctors",
//     label: "Doctors",
//     color: "#a78bfa",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
//       </svg>
//     ),
//   },
//   {
//     key: "total_receptionists",
//     label: "Receptionists",
//     color: "#fb923c",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <rect x="2" y="7" width="20" height="14" rx="2" />
//         <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
//       </svg>
//     ),
//   },
//   {
//     key: "total_lab_technicians",
//     label: "Lab Technicians",
//     color: "#f472b6",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
//       </svg>
//     ),
//   },
//   {
//     key: "total_pharmacists",
//     label: "Pharmacists",
//     color: "#fbbf24",
//     icon: (
//       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
//         <path d="M12 2v20M2 12h20" />
//       </svg>
//     ),
//   },
// ];

// const StatsCards = ({ stats = {} }) => {
//   return (
//     <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
//       {CARD_CONFIG.map((card) => (
//         <div
//           key={card.key}
//           className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-4 hover:border-opacity-60 transition-all group"
//           style={{ "--accent": card.color }}
//         >
//           <div
//             className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
//             style={{ background: `${card.color}18`, color: card.color }}
//           >
//             {card.icon}
//           </div>
//           <p className="text-2xl font-bold text-white">{stats[card.key] ?? 0}</p>
//           <p className="text-xs text-gray-500 mt-1">{card.label}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default StatsCards;

import React from "react";

const CARD_CONFIG = [
  {
    key: "total_staff",
    label: "Total Staff",
    color: "#1B4360", // Primary
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    key: "active_staff",
    label: "Active Staff",
    color: "#D4AF37", // Gold
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
  },
  {
    key: "total_doctors",
    label: "Doctors",
    color: "#1B4360",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    key: "total_receptionists",
    label: "Receptionists",
    color: "#D4AF37",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
  },
  {
    key: "total_lab_technicians",
    label: "Lab Technicians",
    color: "#1B4360",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    key: "total_pharmacists",
    label: "Pharmacists",
    color: "#D4AF37",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-6 h-6">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
];

const StatsCards = ({ stats = {} }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
      {CARD_CONFIG.map((card) => (
        <div
          key={card.key}
          className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg rounded-2xl p-5 transition-all hover:shadow-xl hover:-translate-y-1"
        >
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-3"
            style={{
              background: `${card.color}20`,
              color: card.color,
            }}
          >
            {card.icon}
          </div>

          {/* Number */}
          <p className="text-2xl font-bold text-[#1E293B]">
            {stats[card.key] ?? 0}
          </p>

          {/* Label */}
          <p className="text-xs text-gray-500 mt-1 tracking-wide">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;