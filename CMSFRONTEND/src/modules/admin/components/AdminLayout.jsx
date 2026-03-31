// import React, { useState } from "react";
// import AdminSidebar from "./AdminSidebar";

// const AdminLayout = ({ children, title }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-[#060d1a] text-white">
//       <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

//       {/* Main content area */}
//       <main
//         className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}
//       >
//         {/* Top bar */}
//         <header className="sticky top-0 z-30 bg-[#060d1a]/80 backdrop-blur border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between">
//           <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
//           <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
//         </header>

//         {/* Page content */}
//         <div className="p-6">{children}</div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg')",
      }}
    >
      {/* DARK OVERLAY */}
      <div className="min-h-screen bg-[#020617]/90 flex">

        {/* FULL HEIGHT SIDEBAR */}
        <div className="fixed top-0 left-0 h-screen z-40">
          <AdminSidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((p) => !p)}
          />
        </div>

        {/* MAIN CONTENT */}
        <main
          className={`flex-1 transition-all duration-300 ${
            collapsed ? "ml-16" : "ml-64"
          }`}
        >

          {/* TOP BAR */}
          <header className="sticky top-0 z-30 bg-[#020617]/80 backdrop-blur-md border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between shadow-sm">

            <h1 className="text-xl md:text-2xl font-semibold text-gray-100">
              {title}
            </h1>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300 hidden sm:block">
                System Active
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
            </div>

          </header>

          {/* PAGE CONTENT */}
          <div className="p-6 text-[16px] leading-relaxed text-gray-100">
            {children}
          </div>

        </main>

      </div>
    </div>
  );
};

export default AdminLayout;