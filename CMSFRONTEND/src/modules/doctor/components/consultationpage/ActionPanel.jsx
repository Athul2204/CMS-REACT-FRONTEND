import React from "react";

const ActionPanel = ({
hasConsultation,
labPending,
onAddConsultation,
onLabRequest,
onPrescription,
}) => {
return ( <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

  {/* Title */}
  <h2 className="text-lg font-semibold mb-4">
    Action Panel
  </h2>

  <div className="flex flex-col gap-3">

    {/* Add Consultation */}
    <button
      onClick={onAddConsultation}
      disabled={hasConsultation}
      className={`
        w-full py-2 rounded-md font-medium text-sm

        ${
          hasConsultation
            ? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }

        transition
      `}
    >
      ➕ Add Consultation
    </button>

    {/* Lab Request */}
    <button
      onClick={onLabRequest}
      disabled={!hasConsultation}
      className={`
        w-full py-2 rounded-md font-medium text-sm

        ${
          !hasConsultation
            ? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-600"
        }

        transition
      `}
    >
      🧪 Lab Request
    </button>

    {/* Prescription */}
    <button
      onClick={onPrescription}
      disabled={!hasConsultation || labPending}
      className={`
        w-full py-2 rounded-md font-medium text-sm

        ${
          !hasConsultation || labPending
            ? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }

        transition
      `}
    >
      💊 Prescription
    </button>

  </div>
</div>


);
};

export default ActionPanel;
