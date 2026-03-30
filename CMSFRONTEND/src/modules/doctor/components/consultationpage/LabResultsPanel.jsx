import React from "react";

const LabResultsPanel = ({ labResults = [], labPending }) => {
  return (
    <div className="h-full flex flex-col bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* Title + Status */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Lab Results
        </h2>

        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            labPending
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-green-500/20 text-green-300"
          }`}
        >
          {labPending ? "Pending" : "Completed"}
        </span>
      </div>

      {/* 🔥 CONTENT AREA (SCROLLABLE + EXPANDS) */}
      <div className="flex-1 overflow-y-auto pr-1">

        {/* Pending State */}
        {labPending ? (
          <div className="text-gray-400 text-sm">
            Waiting for lab results...
          </div>
        ) : labResults.length === 0 ? (
          <div className="text-gray-400 text-sm">
            No lab results available
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-sm md:text-base">

            {labResults.map((item) => (
              <div
                key={item.result_id}
                className="flex justify-between items-center bg-white/10 p-3 rounded-lg hover:bg-white/15 transition"
              >

                {/* Test Name */}
                <span className="text-gray-300">
                  {item.test_name || "Test"}
                </span>

                {/* Result */}
                <span
                  className={`font-semibold ${
                    item.is_critical
                      ? "text-red-400"
                      : "text-green-300"
                  }`}
                >
                  {item.result_value}
                </span>

              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default LabResultsPanel;