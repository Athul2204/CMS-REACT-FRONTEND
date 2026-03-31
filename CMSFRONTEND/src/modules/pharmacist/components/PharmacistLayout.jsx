import React, { useState } from "react";
import PharmacistSidebar from "./PharmacistSidebar";

const PharmacistLayout = ({ children, title }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#060d1a] text-white">
      <PharmacistSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((p) => !p)}
      />

      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <header className="sticky top-0 z-30 bg-[#060d1a]/80 backdrop-blur border-b border-[#1e2d4a] px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-white tracking-tight">
            {title}
          </h1>
          <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

export default PharmacistLayout;