import React from "react";
import { FaChevronRight } from "react-icons/fa";

const HistoryNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "consultations", label: "🩺 Previous Consultations" },
    { key: "prescriptions", label: "💊 Previous Prescriptions" },
    { key: "lab", label: "🧪 Previous Lab Results" },
  ];

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 text-white h-full">

      <div className="flex flex-col gap-3">

        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-3 w-full text-left px-4 py-4 rounded-lg text-base font-semibold

                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg"
                    : "bg-white/5 hover:bg-white/10 text-gray-300"
                }

                transition-all duration-200
              `}
            >

              {/* 🔥 Arrow */}
              {isActive && (
                <FaChevronRight className="text-white text-sm" />
              )}

              {/* Label */}
              <span>{tab.label}</span>

            </button>
          );
        })}

      </div>
    </div>
  );
};

export default HistoryNavigation;