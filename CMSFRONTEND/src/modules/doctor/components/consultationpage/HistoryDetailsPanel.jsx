import React from "react";

const HistoryDetailsPanel = ({
  activeTab,
  consultations = [],
  prescriptions = [],
  previousLabResults = [], // 🔥 FIXED: separate from current labRequests
}) => {

  // 🔥 Use the passed results directly
  const labResults = previousLabResults;

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white h-full flex flex-col">

      {/* 🔥 Dynamic Title */}
      <h2 className="text-lg font-semibold mb-4">
        {activeTab === "consultations" && "Previous Consultations"}
        {activeTab === "prescriptions" && "Previous Prescriptions"}
        {activeTab === "lab" && "Previous Lab Results"}
      </h2>

      {/* 🔥 SCROLL AREA */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-sm md:text-base">

        {/* 🩺 CONSULTATIONS */}
        {activeTab === "consultations" &&
          (consultations.length === 0 ? (
            <p className="text-gray-400">No previous consultations</p>
          ) : (
            consultations.map((item) => (
              <div
                key={item.consultation_code}
                className="bg-white/10 hover:bg-white/15 transition p-4 rounded-lg"
              >
                <p className="mb-1">
                  <span className="text-gray-300">Diagnosis: </span>
                  <span className="text-blue-400 font-semibold">
                    {item.diagnosis}
                  </span>
                </p>

                <p className="mb-1">
                  <span className="text-gray-300">Symptoms: </span>
                  <span className="text-blue-400">{item.symptoms}</span>
                </p>

                <p className="mb-1">
                  <span className="text-gray-300">Vitals: </span>
                  <span className="text-blue-400">{item.vitals}</span>
                </p>

                <p className="mb-1">
                  <span className="text-gray-300">Advice: </span>
                  <span className="text-blue-400">{item.advice || "N/A"}</span>
                </p>

                <p className="text-xs text-gray-300 mt-2">
                  {new Date(item.created_at).toLocaleDateString("en-GB")}
                </p>
              </div>
            ))
          ))}

        {/* 💊 PRESCRIPTIONS */}
        {activeTab === "prescriptions" &&
          (prescriptions.length === 0 ? (
            <p className="text-gray-400">No prescriptions found</p>
          ) : (
            prescriptions.map((pres) => (
              <div
                key={pres.prescription_code}
                className="bg-[#2a3648] p-3 rounded-md border border-white/10 hover:bg-white/5 transition p-4 rounded-lg"
              >

                <div className="flex justify-between items-center mb-2">
                  <p className="text-gray-200 font-semibold">
                    {pres.prescription_code}
                  </p>

                  <p className="text-xs text-gray-300">
                    {pres.created_at
                      ? new Date(pres.created_at).toLocaleDateString("en-GB")
                      : "No Date"}
                  </p>
                </div>

                <div className="space-y-2">
                  {pres.items.map((item, idx) => (
                    <div key={idx} className="bg-white/5 p-2 rounded-md">
                      <p className="text-blue-300 font-medium text-sm">
                        {item.medicine_display}
                      </p>

                      <p className="text-xs text-gray-300">
                        {item.dosage} • {item.frequency} • {item.duration} days
                      </p>

                      {item.instructions && (
                        <p className="text-xs text-gray-400 italic">
                          {item.instructions}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

              </div>
            ))
          ))}

        {/* 🧪 LAB RESULTS */}
        {activeTab === "lab" &&
          (labResults.length === 0 ? (
            <p className="text-gray-400">No lab history</p>
          ) : (
            labResults.map((item) => (
              <div
                key={item.result_id}
                className="bg-[#2a3648] p-3 rounded-md border border-white/10 flex justify-between items-start"
              >
                <div className="flex flex-col">
                  <p className="text-blue-300 font-medium text-sm">
                    {item.test_name}
                  </p>

                  <p className="text-white text-sm">
                    {item.result_value}

                    <span
                      className={`ml-2 text-xs font-medium ${
                        item.is_critical
                          ? "text-red-400"
                          : "text-green-400"
                      }`}
                    >
                      ({item.is_critical ? "Critical" : "Normal"})
                    </span>
                  </p>

                  {item.remarks && (
                    <p className="text-xs text-gray-400 mt-1 italic">
                      {item.remarks}
                    </p>
                  )}
                </div>

                <span className="text-xs text-gray-300 whitespace-nowrap">
                  {new Date(item.created_at).toLocaleDateString("en-GB")}
                </span>
              </div>
            ))
          ))}

      </div>
    </div>
  );
};

export default HistoryDetailsPanel;