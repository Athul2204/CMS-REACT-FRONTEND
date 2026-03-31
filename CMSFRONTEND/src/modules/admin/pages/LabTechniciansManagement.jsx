import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import RoleModal from "../components/RoleModal";
import { getLabTechnicianList, patchStaff } from "../api/adminApi";

const ROLE_CONFIG = {
  role: "Lab Technician",
  endpoint: "/api/administration/labtechnician/",
  idKey: "profile_id",
  extraFields: [
    { name: "certification_details", label: "Certification Details (optional)", type: "text", placeholder: "e.g. DMLT, BMLT", default: "" },
  ],
  accentColor: "#f472b6",
};

const COLUMNS = [
  { key: "profile_id", label: "ID" },
  { key: "staff_code", label: "Code", render: (row) => row.staff?.staff_code || "—" },
  {
    key: "name", label: "Name",
    render: (row) => {
      const u = row.staff?.user;
      return u ? `${u.first_name || ""} ${u.last_name || ""}`.trim() : "—";
    },
  },
  { key: "certification_details", label: "Certification", render: (row) => row.certification_details || "—" },
  { key: "phone", label: "Phone", render: (row) => row.staff?.phone || "—" },
  { key: "salary", label: "Salary", render: (row) => row.staff?.salary ? `₹${row.staff.salary.toLocaleString("en-IN")}` : "—" },
  {
    key: "is_active", label: "Status",
    render: (row) => (
      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${row.staff?.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
        {row.staff?.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const LabTechniciansManagement = () => {
  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/administration/labtechnician/");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchData = async (url) => {
    setLoading(true);
    setError("");
    try {
      const res = await getLabTechnicianList(url);
      setData(res.results || []);
      setNext(res.next);
      setPrevious(res.previous);
    } catch {
      setError("Failed to load lab technicians.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(currentUrl); }, [currentUrl]);

  const handleToggleActive = async (row) => {
    if (!row.staff?.id) return;
    try {
      await patchStaff(row.staff.id, { is_active: !row.staff.is_active });
      fetchData(currentUrl);
    } catch (e) {
      alert(e?.response?.data?.detail || "Failed to update status.");
    }
  };

  const filtered = data.filter((r) => {
    const name = `${r.staff?.user?.first_name || ""} ${r.staff?.user?.last_name || ""}`.toLowerCase();
    return name.includes(search.toLowerCase()) || (r.certification_details || "").toLowerCase().includes(search.toLowerCase());
  });

  const withActive = filtered.map((row) => ({ ...row, is_active: row.staff?.is_active ?? true }));

  return (
    <AdminLayout title="Lab Technicians">
      {error && <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <input type="text" placeholder="Search by name or certification…" value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#f472b6] w-72 transition" />
        <button onClick={() => { setSelected(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-[#f472b6] text-[#060d1a] text-sm font-semibold rounded-lg hover:bg-[#f9a8d4] transition">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
          Add Lab Technician
        </button>
      </div>

      <DataTable columns={COLUMNS} data={withActive} loading={loading}
        onEdit={(row) => { setSelected(row); setModalOpen(true); }}
        onToggleActive={handleToggleActive} idKey="profile_id" />

      <Pagination next={next} previous={previous} loading={loading}
        onNext={() => setCurrentUrl(next)} onPrevious={() => setCurrentUrl(previous)} />

      {modalOpen && (
        <RoleModal record={selected} onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchData("/api/administration/labtechnician/"); }}
          roleConfig={ROLE_CONFIG} />
      )}
    </AdminLayout>
  );
};

export default LabTechniciansManagement;
