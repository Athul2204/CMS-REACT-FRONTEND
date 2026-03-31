// import React, { useState } from "react";
// import LabSidebar from "./LabSidebar";

// const LabLayout = ({ children, title }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#060d1a] text-white">
//       <LabSidebar
//         collapsed={collapsed}
//         onToggle={() => setCollapsed((p) => !p)}
//       />

//       <main
//         className={`flex-1 transition-all duration-300 ${
//           collapsed ? "ml-16" : "ml-64"
//         }`}
//       >
//         <header className="sticky top-0 z-30 bg-[#060d1a]/80 backdrop-blur border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between">
//           <h1 className="text-xl font-semibold text-white tracking-tight">
//             {title}
//           </h1>
//           <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
//         </header>

//         <div className="p-6">{children}</div>
//       </main>
//     </div>
//   );
// };

// export default LabLayout;

import React, { useState } from "react";
import LabSidebar from "./LabSidebar";

const LabLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B1220] text-gray-100">
      <LabSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* HEADER */}
        <header className="sticky top-0 z-30 bg-[#0B1220]/70 backdrop-blur-xl border-b border-[#1E293B] px-6 py-4 flex items-center justify-between">
          
          <h1 className="text-lg font-semibold text-gray-100 tracking-tight">
            {title}
          </h1>

          {/* STATUS DOT */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>

        </header>

        {/* CONTENT */}
        <div className="p-6 text-gray-200">{children}</div>
      </main>
    </div>
  );
};

export default LabLayout;