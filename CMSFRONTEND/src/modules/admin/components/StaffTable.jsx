// // CMSFRONTEND/src/modules/admin/components/StaffTable.jsx
// import React from "react";

// const StaffTable = ({ staff = [], onEdit, onToggleActive }) => {
//   if (!Array.isArray(staff)) staff = [];

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
//   };

//   return (
//     <table className="min-w-full table-auto border-collapse border border-gray-300">
//       <thead>
//         <tr className="bg-gray-100">
//           <th className="border px-4 py-2">Staff Code</th>
//           <th className="border px-4 py-2">Name</th>
//           <th className="border px-4 py-2">Role</th>
//           <th className="border px-4 py-2">Phone</th>
//           <th className="border px-4 py-2">Salary</th>
//           <th className="border px-4 py-2">Joining Date</th>
//           <th className="border px-4 py-2">Status</th>
//           <th className="border px-4 py-2">Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {staff.length === 0 ? (
//           <tr>
//             <td colSpan={8} className="text-center py-4">
//               No staff found
//             </td>
//           </tr>
//         ) : (
//           staff.map((s) => (
//             <tr key={s.id} className="hover:bg-gray-50">
//               <td className="border px-4 py-2">{s.staff_code}</td>
//               <td className="border px-4 py-2">
//                 {s.user?.first_name || ""} {s.user?.last_name || ""}
//               </td>
//               <td className="border px-4 py-2">{s.role}</td>
//               <td className="border px-4 py-2">{s.phone || "-"}</td>
//               <td className="border px-4 py-2">{s.salary}</td>
//               <td className="border px-4 py-2">{formatDate(s.joining_date)}</td>
//               <td
//                 className={`border px-4 py-2 font-semibold ${
//                   s.is_active ? "text-green-500" : "text-red-500"
//                 }`}
//               >
//                 {s.is_active ? "Active" : "Inactive"}
//               </td>
//               <td className="border px-4 py-2 space-x-2">
//                 <button
//                   className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
//                   onClick={() => onEdit(s)}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   className={`px-2 py-1 rounded ${
//                     s.is_active
//                       ? "bg-red-500 text-white hover:bg-red-600"
//                       : "bg-green-500 text-white hover:bg-green-600"
//                   }`}
//                   onClick={() => onToggleActive(s)}
//                 >
//                   {s.is_active ? "Deactivate" : "Activate"}
//                 </button>
//               </td>
//             </tr>
//           ))
//         )}
//       </tbody>
//     </table>
//   );
// };

// export default StaffTable;


import React from "react";

const StaffTable = ({ staff = [], onEdit, onToggleActive }) => {
  if (!Array.isArray(staff)) staff = [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB");
  };

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl overflow-hidden">
      <table className="min-w-full">
        {/* HEADER */}
        <thead>
          <tr className="bg-[#1B4360] text-white text-sm">
            <th className="px-4 py-3 text-left">Staff Code</th>
            <th className="px-4 py-3 text-left">Name</th>
            <th className="px-4 py-3 text-left">Role</th>
            <th className="px-4 py-3 text-left">Phone</th>
            <th className="px-4 py-3 text-left">Salary</th>
            <th className="px-4 py-3 text-left">Joining Date</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody className="text-sm text-[#1E293B]">
          {staff.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-6 text-gray-500">
                No staff found
              </td>
            </tr>
          ) : (
            staff.map((s) => (
              <tr
                key={s.id}
                className="border-t border-gray-200 hover:bg-[#F1D279]/20 transition"
              >
                <td className="px-4 py-3">{s.staff_code}</td>

                <td className="px-4 py-3 font-medium">
                  {s.user?.first_name || ""} {s.user?.last_name || ""}
                </td>

                <td className="px-4 py-3">{s.role}</td>

                <td className="px-4 py-3">{s.phone || "-"}</td>

                <td className="px-4 py-3 font-semibold">
                  ₹{s.salary?.toLocaleString("en-IN")}
                </td>

                <td className="px-4 py-3">
                  {formatDate(s.joining_date)}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-semibold ${
                      s.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 space-x-2">
                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#1B4360] text-white hover:opacity-90 transition"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className={`px-3 py-1 text-sm rounded-lg text-white transition ${
                      s.is_active
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-[#D4AF37] hover:bg-[#F1D279] text-[#1E293B]"
                    }`}
                    onClick={() => onToggleActive(s)}
                  >
                    {s.is_active ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;