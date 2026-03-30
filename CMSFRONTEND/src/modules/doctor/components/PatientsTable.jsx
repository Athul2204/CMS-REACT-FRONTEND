import React from "react";
import { FaUser, FaClock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PatientsTable = ({ appointments = [] }) => {
const navigate = useNavigate();

return ( <div className="
   mt-2 h-full flex flex-col
   rounded-xl
   bg-[#1e293b]
   border border-white/10
 ">
  {/* 🔹 Title */}
  <h2 className="text-white text-lg md:text-xl font-semibold px-4 md:px-5 py-3 flex items-center gap-2">
    📅 TODAY APPOINTMENTS
  </h2>

  {/* 🔥 TABLE AREA */}
  <div className="flex-1 min-h-0 px-4 md:px-5 pb-6">

    <div className="h-full overflow-x-auto overflow-y-auto rounded-lg">

      <table className="min-w-[700px] w-full">

        {/* 🔥 HEADER */}
        <thead className="sticky top-0 z-20">
          <tr className="
            bg-blue-200
            text-gray-800 text-sm md:text-base
            border-b border-gray-300
            shadow-sm
          ">
            <th className="p-3 w-[10%]">Token</th>
            <th className="p-3 w-[25%]">Patient Name</th>
            <th className="p-3 w-[15%]">Time</th>
            <th className="p-3 w-[20%]">Reason</th>
            <th className="p-3 w-[15%]">Status</th>
            <th className="p-3 w-[15%] text-center">Action</th>
          </tr>
        </thead>

        {/* 🔥 BODY */}
        <tbody className="text-white text-sm md:text-base">

          {appointments.length > 0 ? (
            appointments.map((item, index) => {

              const rowStyle =
                index % 2 === 0
                  ? "bg-blue-500/10"
                  : "bg-green-500/10";

              return (
                <tr
                  key={item.appointment_id}
                  className={`
                    ${rowStyle}
                    border-b border-white/5
                    hover:bg-blue-500/10
                    transition-all duration-200
                  `}
                >

                  {/* Token */}
                  <td className="p-3 font-medium">
                    {item.token_number}
                  </td>

                  {/* Patient */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                        <FaUser className="text-xs" />
                      </span>
                      {item.patient?.first_name} {item.patient?.last_name}
                    </div>
                  </td>

                  {/* Time */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FaClock className="text-xs opacity-80" />
                      {item.appointment_time}
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="p-3 truncate">
                    {item.reason}
                  </td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`
                        px-2 py-0.5 rounded-full
                        text-xs md:text-sm font-medium

                        ${
                          item.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : item.status === "Pending" || item.status === "Scheduled"
                            ? "bg-red-500/20 text-red-300"
                            : "bg-red-500/20 text-red-300"
                        }
                      `}
                    >
                      {item.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/doctor/consultation/${item.appointment_id}`)
                      }
                      disabled={item.status === "Completed"}
                      className={`
                        px-3 py-1 md:px-4 md:py-1.5
                        rounded-full

                        bg-gradient-to-r from-blue-200 to-cyan-200
                        text-gray-800 font-medium text-xs md:text-sm

                        hover:scale-105 hover:shadow-lg
                        active:scale-95

                        transition duration-200
                        whitespace-nowrap

                        ${
                          item.status === "Completed"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    >
                      Consult
                    </button>
                  </td>

                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-5 text-white/60 text-sm">
                No patients today
              </td>
            </tr>
          )}

        </tbody>
      </table>

    </div>
  </div>
</div>


);
};

export default PatientsTable;
