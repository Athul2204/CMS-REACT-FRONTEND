// src/modules/admin/pages/PatientsManagement.jsx
import React, { useEffect, useState } from "react";
import DashboardHeader from "../components/DashboardHeader";

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch patients from API
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/patients"); // placeholder API
        const data = await res.json();
        setPatients(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchPatients();
  }, []);

  return (
    <div className="p-4 text-white min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">
      <DashboardHeader userType="Admin" />
      <h1 className="text-xl font-semibold mb-4">Patients Management</h1>

      <table className="min-w-full bg-gray-900 text-white">
        <thead>
          <tr>
            <th className="p-2">ID</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr key={p.id}>
              <td className="p-2">{p.id}</td>
              <td className="p-2">{p.name}</td>
              <td className="p-2">{p.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientsManagement;