import React from "react";
import { useNavigate } from "react-router-dom";

const ActionPanel = ({
  hasConsultation,
  hasLabRequests,     // ✅ NEW
  hasPendingLabs,     // ✅ NEW
  hasPrescription,
  onAddConsultation,
  onLabRequest,
  onPrescription,
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* 🔥 TITLE + BACK BUTTON SAME LINE */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Action Panel
        </h2>

        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition"
        >
          ← Back
        </button>
      </div>

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
          disabled={!hasConsultation || hasPendingLabs || hasPrescription}
          className={`
            w-full py-2 rounded-md font-medium text-sm

            ${
              !hasConsultation || hasPendingLabs || hasPrescription
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
          disabled={!hasConsultation || hasPendingLabs || hasPrescription}
          className={`
            w-full py-2 rounded-md font-medium text-sm

            ${
              !hasConsultation || hasPendingLabs || hasPrescription
                ? "bg-gray-500/30 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }

            transition
          `}
          title={
            hasPrescription
              ? "Prescription already created"
              : hasPendingLabs
              ? "Complete all lab requests first"
              : ""
          }
        >
          💊 Prescription
        </button>

        {/* Status Messages */}
        {hasPendingLabs && (
          <p className="text-yellow-400 text-xs mt-1">
            ⏳ Complete all lab requests to enable prescription
          </p>
        )}

      </div>
    </div>
  );
};

export default ActionPanel;