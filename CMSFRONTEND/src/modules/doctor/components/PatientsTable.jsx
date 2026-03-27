import React from "react";

const PatientsTable = ({ appointments = [] }) => {
  return (
    <div className="bg-white rounded-xl shadow p-4">

      <h2 className="text-xl font-semibold mb-4">
        Today’s Patients
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">

          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-3">Token</th>
              <th className="p-3">Patient Name</th>
              <th className="p-3">Time</th>
              <th className="p-3">Reason</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {appointments.length > 0 ? (
              appointments.map((item) => (
                <tr
                  key={item.appointment_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">{item.token_number}</td>

                  <td className="p-3">
                    {item.patient?.first_name}{" "}
                    {item.patient?.last_name}
                  </td>

                  <td className="p-3">{item.appointment_time}</td>

                  <td className="p-3">{item.reason}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>

                  <td className="p-3">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded">
                      Consult
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No patients today
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default PatientsTable;