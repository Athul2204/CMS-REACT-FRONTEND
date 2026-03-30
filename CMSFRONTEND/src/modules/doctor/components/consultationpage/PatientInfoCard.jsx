import React from "react";
import { FaUser, FaPhone, FaClock } from "react-icons/fa";

const PatientInfoCard = ({ patient, appointment }) => {
  if (!patient || !appointment) return null;

  return (
    <div className="h-full flex flex-col bg-[#1e293b] border border-white/10 rounded-xl p-4 md:p-5 text-white">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FaUser className="text-blue-400" />
        Patient Info
      </h2>

      {/* 🔥 Content */}
      <div className="flex-1 flex flex-col text-sm md:text-base">

        {/* All fields */}
        <div className="flex flex-col gap-3">

          <div className="flex justify-between">
            <span className="text-gray-400">Name</span>
            <span className="font-medium text-right">
              {patient.first_name} {patient.last_name}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Gender / Age</span>
            <span>
              {patient.gender} / {patient.age}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1">
              <FaPhone className="text-xs opacity-70" />
              Phone
            </span>
            <span>{patient.phone}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Blood</span>
            <span>{patient.blood_group || "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-400">Token</span>
            <span>{appointment.token_number}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1">
              <FaClock className="text-xs opacity-70" />
              Time
            </span>
            <span>{appointment.appointment_time}</span>
          </div>

          {/* ✅ STATUS NOW JUST BELOW */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-gray-400">Status</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                appointment.status === "Completed"
                  ? "bg-green-500/20 text-green-300"
                  : "bg-yellow-500/20 text-yellow-300"
              }`}
            >
              {appointment.status}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default PatientInfoCard;