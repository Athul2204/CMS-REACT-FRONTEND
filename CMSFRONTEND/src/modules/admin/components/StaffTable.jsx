

// import React from "react";

// const StaffTable = ({ staff = [], onEdit, onToggleActive }) => {
//   if (!Array.isArray(staff)) staff = [];

//   const formatDate = (dateStr) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     return d.toLocaleDateString("en-GB");
//   };

//   return (
//     <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl overflow-hidden">
//       <table className="min-w-full">
//         {/* HEADER */}
//         <thead>
//           <tr className="bg-[#1B4360] text-white text-sm">
//             <th className="px-4 py-3 text-left">Staff Code</th>
//             <th className="px-4 py-3 text-left">Name</th>
//             <th className="px-4 py-3 text-left">Role</th>
//             <th className="px-4 py-3 text-left">Phone</th>
//             <th className="px-4 py-3 text-left">Salary</th>
//             <th className="px-4 py-3 text-left">Joining Date</th>
//             <th className="px-4 py-3 text-left">Status</th>
//             <th className="px-4 py-3 text-left">Actions</th>
//           </tr>
//         </thead>

//         {/* BODY */}
//         <tbody className="text-sm text-[#1E293B]">
//           {staff.length === 0 ? (
//             <tr>
//               <td colSpan={8} className="text-center py-6 text-gray-500">
//                 No staff found
//               </td>
//             </tr>
//           ) : (
//             staff.map((s) => (
//               <tr
//                 key={s.id}
//                 className="border-t border-gray-200 hover:bg-[#F1D279]/20 transition"
//               >
//                 <td className="px-4 py-3">{s.staff_code}</td>

//                 <td className="px-4 py-3 font-medium">
//                   {s.user?.first_name || ""} {s.user?.last_name || ""}
//                 </td>

//                 <td className="px-4 py-3">{s.role}</td>

//                 <td className="px-4 py-3">{s.phone || "-"}</td>

//                 <td className="px-4 py-3 font-semibold">
//                   ₹{s.salary?.toLocaleString("en-IN")}
//                 </td>

//                 <td className="px-4 py-3">
//                   {formatDate(s.joining_date)}
//                 </td>

//                 {/* STATUS */}
//                 <td className="px-4 py-3">
//                   <span
//                     className={`px-3 py-1 text-xs rounded-full font-semibold ${
//                       s.is_active
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-600"
//                     }`}
//                   >
//                     {s.is_active ? "Active" : "Inactive"}
//                   </span>
//                 </td>

//                 {/* ACTIONS */}
//                 <td className="px-4 py-3 space-x-2">
//                   <button
//                     className="px-3 py-1 text-sm rounded-lg bg-[#1B4360] text-white hover:opacity-90 transition"
//                     onClick={() => onEdit(s)}
//                   >
//                     Edit
//                   </button>

//                   <button
//                     className={`px-3 py-1 text-sm rounded-lg text-white transition ${
//                       s.is_active
//                         ? "bg-red-500 hover:bg-red-600"
//                         : "bg-[#D4AF37] hover:bg-[#F1D279] text-[#1E293B]"
//                     }`}
//                     onClick={() => onToggleActive(s)}
//                   >
//                     {s.is_active ? "Deactivate" : "Activate"}
//                   </button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
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
    <div className="bg-white/80 backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
      <table className="min-w-full">

        {/* HEADER */}
        <thead>
          <tr className="bg-[#0F172A] text-white/90 text-sm">
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
        <tbody className="text-sm text-[#0F172A]">

          {staff.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-8 text-gray-500">
                No staff found
              </td>
            </tr>
          ) : (
            staff.map((s) => (
              <tr
                key={s.id}
                className="border-t border-gray-100 hover:bg-slate-50 transition"
              >

                <td className="px-4 py-3 text-gray-600">
                  {s.staff_code}
                </td>

                <td className="px-4 py-3 font-medium">
                  {s.user?.first_name || ""} {s.user?.last_name || ""}
                </td>

                <td className="px-4 py-3 text-gray-700">
                  {s.role}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {s.phone || "-"}
                </td>

                <td className="px-4 py-3 font-semibold text-gray-800">
                  ₹{s.salary?.toLocaleString("en-IN") || "-"}
                </td>

                <td className="px-4 py-3 text-gray-600">
                  {formatDate(s.joining_date)}
                </td>

                {/* STATUS */}
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium border ${
                      s.is_active
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3 flex gap-2">

                  <button
                    className="px-3 py-1 text-sm rounded-lg bg-[#1E3A8A] text-white hover:bg-[#2563EB] transition"
                    onClick={() => onEdit(s)}
                  >
                    Edit
                  </button>

                  <button
                    className={`px-3 py-1 text-sm rounded-lg transition ${
                      s.is_active
                        ? "bg-rose-500 hover:bg-rose-600 text-white"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
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