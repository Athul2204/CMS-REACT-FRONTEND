import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#060d1a] text-white">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />

      {/* Main content area */}
      <main
        className={`flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#060d1a]/80 backdrop-blur border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
          <div className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
        </header>

        {/* Page content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
