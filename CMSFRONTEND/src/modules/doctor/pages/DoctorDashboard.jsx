import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import StatsCards from "../components/StatsCards";
import PatientsTable from "../components/PatientsTable";
import { getTodayAppointments } from "../api/doctorApi";

const DoctorDashboard = () => {

  // ✅ State
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔥 API Call
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTodayAppointments();

        const data = res.data || [];

        // ✅ Set appointments
        setAppointments(data);

        // ✅ Calculate stats
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

  // 🔄 Loading state
  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">

      {/* 🔥 Header */}
      <DashboardHeader />

      {/* 🔥 Welcome */}
      <h1 className="text-2xl font-bold text-gray-700">
        Welcome Doctor 👋
      </h1>

      {/* 🔥 Stats */}
      <StatsCards
        total={stats.total}
        completed={stats.completed}
        remaining={stats.remaining}
      />

      {/* 🔥 Patients */}
      <PatientsTable appointments={appointments} />

    </div>
  );
};

export default DoctorDashboard;