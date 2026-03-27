import React from "react";

const StatCard = ({ title, value = 0, color = "blue", icon }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
    red: "bg-red-100 text-red-700",
  };

  return (
    <div
      className={`p-6 rounded-xl shadow border flex items-center justify-between 
      ${colorClasses[color] || colorClasses.blue}
      hover:scale-105 hover:shadow-md transition duration-300`}
    >
      {/* 🔹 Left */}
      <div>
        <h3 className="text-sm font-medium opacity-80">{title}</h3>
        <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
      </div>

      {/* 🔹 Right Icon */}
      <div className="text-4xl opacity-60">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;