import React from "react";

const LabRequestsPanel = ({ labRequests = [] }) => {

  // 🔥 Flatten all results
  const allResults = labRequests.flatMap((req) => req.results || []);

  // 🔥 Status checks
  const hasRequests = labRequests.length > 0;
  const hasPending = labRequests.some((req) => req.status === "Pending");
  const isCompleted = !hasPending && allResults.length > 0;
  const isEmpty = !hasPending && hasRequests && allResults.length === 0;

  return (
    <div className="h-full flex flex-col bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* Title + Status */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Lab Results
        </h2>

        <span
          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            hasPending
              ? "bg-yellow-500/20 text-yellow-300"
              : isCompleted
              ? "bg-green-500/20 text-green-300"
              : isEmpty
              ? "bg-gray-500/20 text-gray-300"
              : !hasRequests
              ? "bg-gray-500/20 text-gray-400"
              : ""
          }`}
        >
          {hasPending
            ? "Pending"
            : isCompleted
            ? "Completed"
            : isEmpty
            ? "No Results"
            : !hasRequests
            ? "Not Requested"
            : ""}
        </span>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto pr-1">

        {allResults.length > 0 ? (

          <div className="flex flex-col gap-3 text-sm md:text-base">
            {allResults.map((item, index) => (
              <div
                key={item.result_id || index}
                className="flex flex-col bg-white/10 p-3 rounded-lg hover:bg-white/15 transition"
              >

                <div className="flex justify-between items-center w-full">
                  <span className="text-gray-300">
                    {item.test_name || "Test"}
                  </span>

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
                
                {item.remarks && (
                  <div className="text-xs text-gray-400 mt-1">
                    <span className="font-medium text-gray-400/80">Remarks: </span>
                    {item.remarks}
                  </div>
                )}

              </div>
            ))}
          </div>

        ) : hasPending ? (

          <div className="text-yellow-400 text-sm animate-pulse">
            ⏳ Waiting for lab results... (auto updating)
          </div>

        ) : !hasRequests ? (

          <div className="text-gray-500 text-sm">
            No lab request created
          </div>

        ) : (

          <div className="text-gray-400 text-sm">
            No lab results for this consultation
          </div>

        )}

      </div>
    </div>
  );
};

export default LabRequestsPanel;