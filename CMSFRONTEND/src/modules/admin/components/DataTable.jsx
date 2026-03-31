import React from "react";

const DataTable = ({ columns, data = [], onEdit, onToggleActive, loading, idKey = "id" }) => {

  // 🔄 LOADING STATE
  if (loading && data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-300">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
        <p className="text-sm tracking-wide">Loading data...</p>
      </div>
    );
  }

  // ❌ EMPTY STATE
  if (!loading && data.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-7 h-7 opacity-40">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
        <p className="text-sm">No records found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">

      <table className="min-w-full text-sm text-white">
        
        {/* 🔝 HEADER */}
        <thead>
          <tr className="border-b border-white/20 bg-white/5">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-5 py-3 text-left text-xs font-semibold text-[#F1D279] uppercase tracking-wider whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}

            {(onEdit || onToggleActive) && (
              <th className="px-5 py-3 text-right text-xs font-semibold text-[#F1D279] uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* 🔽 BODY */}
        <tbody className="divide-y divide-white/10">
          {data.map((row, i) => (
            <tr
              key={row[idKey] ?? i}
              className="hover:bg-white/5 transition-all duration-200"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3 text-gray-200 whitespace-nowrap">
                  {col.render ? col.render(row) : (row[col.key] ?? "—")}
                </td>
              ))}

              {(onEdit || onToggleActive) && (
                <td className="px-5 py-3 text-right space-x-2 whitespace-nowrap">

                  {/* ✏️ EDIT BUTTON */}
                  {onEdit && (
                    <button
                      onClick={() => onEdit(row)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-[#D4AF37]/10 text-[#F1D279] border border-[#D4AF37]/20 rounded-lg hover:bg-[#D4AF37]/20 transition"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Edit
                    </button>
                  )}

                  {/* 🔁 ACTIVE TOGGLE */}
                  {onToggleActive && (
                    <button
                      onClick={() => onToggleActive(row)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg border transition ${
                        row.is_active
                          ? "bg-red-500/10 text-red-300 border-red-500/20 hover:bg-red-500/20"
                          : "bg-green-500/10 text-green-300 border-green-500/20 hover:bg-green-500/20"
                      }`}
                    >
                      {row.is_active ? "Deactivate" : "Activate"}
                    </button>
                  )}

                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;