import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatsCards from "../components/StatsCards";
import PatientsTable from "../components/PatientsTable";
import { getTodayAppointments } from "../api/doctorApi";
import { useAuth } from "../../../context/AuthContext";
import { FaUserMd } from "react-icons/fa";

const DoctorDashboard = () => {

  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTodayAppointments();

        const data = res.data || [];

        setAppointments(data);

        const total = res.count || 0;

        const completed = data.filter(
          (item) => item.status === "Completed"
        ).length;

        const remaining = total - completed;

        setStats({
          total,
          completed,
          remaining,
        });

      } catch (error) {
        console.error("Dashboard API error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔄 Loading UI
  if (loading) {
    return (
      <div className="
        min-h-screen flex items-center justify-center
        bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]
        text-white/80 text-lg
      ">
        Loading dashboard...
      </div>
    );
  }

  const doctorName = user?.first_name || user?.username || "Doctor";

  return (
    <div className="
      min-h-screen md:h-screen
      overflow-auto md:overflow-hidden
      bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#1e293b]
      p-2 md:p-3
    ">

      {/* 🌈 MAIN CONTAINER */}
      <div className="
        h-full flex flex-col
        rounded-xl
        border border-white/10
        bg-[#1e293b]
        p-2 md:p-3   /* 🔥 reduced padding */
      ">

        {/* 🔝 TOP SECTION */}
        <div className="flex flex-col gap-2 flex-shrink-0">  {/* 🔥 reduced gap */}

          {/* Header */}
          <DashboardHeader />

          {/* Welcome */}
          <h1 className="
            flex items-center gap-2
            text-md md:text-lg font-semibold   /* 🔥 reduced size */
            text-white tracking-wide
          ">
            Welcome Dr. {doctorName}
            <FaUserMd className="text-blue-400 text-2xl md:text-3xl" />
          </h1>

          {/* Stats */}
          <StatsCards
            total={stats.total}
            completed={stats.completed}
            remaining={stats.remaining}
          />

        </div>

        {/* 📊 TABLE SECTION */}
        <div className="flex-1 min-h-0 mt-1">  {/* 🔥 reduced margin */}
          <PatientsTable appointments={appointments} />
        </div>

      </div>

    </div>
  );
};

export default DoctorDashboard;