import React from "react";
import { FaUsers, FaCheckCircle, FaClock } from "react-icons/fa";

const StatCard = ({ title, value = 0, color = "blue" }) => {

  const styles = {
    blue: {
      bg: "from-blue-500/15 to-blue-400/10",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.35)]",
      icon: <FaUsers />
    },
    green: {
      bg: "from-green-500/15 to-emerald-400/10",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.35)]",
      icon: <FaCheckCircle />
    },
    red: {
      bg: "from-red-500/15 to-pink-500/10",
      glow: "shadow-[0_0_15px_rgba(239,68,68,0.35)]",
      icon: <FaClock />
    }
  };

  const current = styles[color];

  return (
    <div className={`
      flex items-center justify-between

      px-4 py-3   /* 🔥 reduced */

      rounded-xl
      bg-gradient-to-br ${current.bg}
      border border-white/20

      ${current.glow}

      transition duration-300 hover:scale-[1.02]
    `}>

      {/* LEFT */}
      <div>
        <h3 className="text-white text-xs md:text-sm font-medium">
          {title}
        </h3>

        <p className="text-white text-xl md:text-2xl font-bold mt-1">
          {value ?? 0}
        </p>
      </div>

      {/* RIGHT ICON */}
      <div className="
        text-white text-2xl md:text-3xl
        p-2 rounded-full
        bg-white/10
      ">
        {current.icon}
      </div>

    </div>
  );
};

export default StatCard;