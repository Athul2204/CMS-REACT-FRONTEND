import React, { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import StaffModal from "../components/StaffModal";
import { getStaffList, patchStaff } from "../api/adminApi";

const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "—");

const COLUMNS = [
  { key: "staff_code", label: "Staff Code" },
  {
    key: "name",
    label: "Name",
    render: (row) => `${row.user?.first_name || ""} ${row.user?.last_name || ""}`.trim() || "—",
  },
  { key: "role", label: "Role" },
  { key: "phone", label: "Phone", render: (row) => row.phone || "—" },
  { key: "salary", label: "Salary (₹)", render: (row) => row.salary?.toLocaleString("en-IN") || "—" },
  { key: "joining_date", label: "Joined", render: (row) => formatDate(row.joining_date) },
  {
    key: "is_active",
    label: "Status",
    render: (row) => (
      <span className={`text-xs font-semibold px-2 py-1 rounded-md ${row.is_active ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
        {row.is_active ? "Active" : "Inactive"}
      </span>
    ),
  },
];

const StaffManagement = () => {
  const [data, setData] = useState([]);
  const [next, setNext] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("/api/administration/staff/");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchData = async (url) => {
    setLoading(true);
    setError("");
    try {
      const res = await getStaffList(url);
      // Backend returns: { count, next, previous, results: [...] }
      setData(res.results || []);
      setNext(res.next);
      setPrevious(res.previous);
    } catch (e) {
      setError("Failed to load staff list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(currentUrl); }, [currentUrl]);

  const handleToggleActive = async (row) => {
    try {
      await patchStaff(row.id, { is_active: !row.is_active });
      fetchData(currentUrl);
    } catch (e) {
      alert(e?.response?.data?.detail || "Failed to update status.");
    }
  };

  const handleEdit = (row) => { setSelected(row); setModalOpen(true); };
  const handleAdd = () => { setSelected(null); setModalOpen(true); };

  const filtered = data.filter((s) => {
    const name = `${s.user?.first_name || ""} ${s.user?.last_name || ""}`.toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || (s.role || "").toLowerCase().includes(q) || (s.staff_code || "").toLowerCase().includes(q);
  });

  return (
    <AdminLayout title="Staff Management">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, role, code…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#38bdf8] w-72 transition"
        />
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[#38bdf8] text-[#060d1a] text-sm font-semibold rounded-lg hover:bg-[#7dd3fc] transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Staff
        </button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={filtered}
        loading={loading}
        onEdit={handleEdit}
        onToggleActive={handleToggleActive}
        idKey="id"
      />

      <Pagination
        next={next}
        previous={previous}
        loading={loading}
        onNext={() => setCurrentUrl(next)}
        onPrevious={() => setCurrentUrl(previous)}
      />

      {modalOpen && (
        <StaffModal
          staff={selected}
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchData("/api/administration/staff/"); }}
        />
      )}
    </AdminLayout>
  );
};

export default StaffManagement;


