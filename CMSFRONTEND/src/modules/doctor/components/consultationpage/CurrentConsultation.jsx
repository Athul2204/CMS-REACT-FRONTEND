import React from "react";

const CurrentConsultation = ({ consultation }) => {
  return (
    <div className="h-full flex flex-col bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">
        Current Consultation
      </h2>

      {/* 🔥 CONTENT AREA (EXPANDS FULL HEIGHT) */}
      <div className="flex-1 flex flex-col">

        {/* If NO consultation */}
        {!consultation ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            No consultation added yet
          </div>
        ) : (
          <div className="flex flex-col gap-3 text-sm md:text-base">

            {/* Symptoms */}
            <div className="bg-white/10 rounded-md p-3">
              <span className="text-gray-400">Symptoms: </span>
              <span className="text-blue-300">
                {consultation.symptoms}
              </span>
            </div>

            {/* Diagnosis */}
            <div className="bg-white/10 rounded-md p-3">
              <span className="text-gray-400">Diagnosis: </span>
              <span className="text-blue-300">
                {consultation.diagnosis}
              </span>
            </div>

            {/* Vitals */}
            <div className="bg-white/10 rounded-md p-3">
              <span className="text-gray-400">Vitals: </span>
              <span className="text-blue-300">
                {consultation.vitals}
              </span>
            </div>

            {/* Advice */}
            <div className="bg-white/10 rounded-md p-3">
              <span className="text-gray-400">Advice: </span>
              <span className="text-blue-300">
                {consultation.advice || "N/A"}
              </span>
            </div>

            {/* Read Only Note */}
            <div className="text-center text-xs text-gray-500 mt-2">
              (Read Only)
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

export default CurrentConsultation;