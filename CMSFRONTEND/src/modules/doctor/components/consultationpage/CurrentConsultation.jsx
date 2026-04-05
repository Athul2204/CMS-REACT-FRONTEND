import React from "react";

const CurrentConsultation = ({ consultation }) => {

  // 🔥 FIXED: Smart vitals parser
  const formatVitals = (vitals) => {
    if (!vitals) return [];

    // If "|" exists → normal case
    if (vitals.includes("|")) {
      return vitals.split("|").map((v) => v.trim());
    }

    // Fallback: detect values from raw string
    const result = [];

    const bpMatch = vitals.match(/BP[:\-]?\s*([\d/]+)/i);
    if (bpMatch) {
      result.push(`BP: ${bpMatch[1]}`);
    }

    const pulseMatch = vitals.match(/Pulse[:\-]?\s*(\d+)?/i);
    if (pulseMatch) {
      result.push(`Pulse: ${pulseMatch[1] || "N/A"}`);
    }

    return result;
  };

  return (
    <div className="h-full flex flex-col bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4">
        Current Consultation
      </h2>

      <div className="flex-1 flex flex-col">

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

            {/* 🔥 Vitals */}
            <div className="bg-white/10 rounded-md p-3">
              <p className="text-gray-400 mb-2">Vitals:</p>

              <div className="grid grid-cols-2 gap-2 text-sm">

                {formatVitals(consultation.vitals).map((item, index) => {
                  const [label, value] = item
                    .split(":")
                    .map((s) => s.trim());

                  return (
                    <div
                      key={index}
                      className="bg-gray-800 px-2 py-1 rounded"
                    >
                      <span className="text-gray-400">{label}:</span>
                      <span className="text-blue-300 ml-1">
                        {value || "N/A"}
                      </span>
                    </div>
                  );
                })}

              </div>
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