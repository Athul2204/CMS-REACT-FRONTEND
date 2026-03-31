import React, { useEffect, useState } from "react";
import ReceptionLayout from "../components/ReceptionLayout";
import { getPatients, createPatient } from "../api/receptionApi";

// ─── ADD PATIENT MODAL ────────────────────────────────────────────
const AddPatientModal = ({ onClose, onSaved }) => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    blood_group: "",
    address: "",
    membership_status: "Regular",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.first_name.trim()) newErrors.first_name = "Required";
    if (!form.last_name.trim()) newErrors.last_name = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    if (!form.phone.trim()) newErrors.phone = "Required";
    if (!form.date_of_birth) newErrors.date_of_birth = "Required";
    if (!form.gender) newErrors.gender = "Required";
    if (!form.address.trim()) newErrors.address = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createPatient(form);
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const serverErrors = {};
        Object.entries(data).forEach(([key, val]) => {
          serverErrors[key] = Array.isArray(val) ? val[0] : val;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: "Failed to register patient." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full bg-[#060d1a] border ${
      errors[field] ? "border-red-500" : "border-[#1e2d4a]"
    } rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 transition`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2d4a]">
          <h2 className="text-lg font-semibold text-white">Register New Patient</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">✕</button>
        </div>

        <div className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">First Name *</label>
              <input name="first_name" value={form.first_name} onChange={handleChange}
                placeholder="John" className={inputCls("first_name")} />
              {errors.first_name && <p className="text-red-400 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Last Name *</label>
              <input name="last_name" value={form.last_name} onChange={handleChange}
                placeholder="Doe" className={inputCls("last_name")} />
              {errors.last_name && <p className="text-red-400 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Email *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="john@email.com" className={inputCls("email")} />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Phone *</label>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="10-digit number" className={inputCls("phone")} />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Date of Birth *</label>
              <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                className={inputCls("date_of_birth")} />
              {errors.date_of_birth && <p className="text-red-400 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Gender *</label>
              <select name="gender" value={form.gender} onChange={handleChange} className={inputCls("gender")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-400 text-xs mt-1">{errors.gender}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Blood Group</label>
              <select name="blood_group" value={form.blood_group} onChange={handleChange} className={inputCls("blood_group")}>
                <option value="">Select (optional)</option>
                {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Membership</label>
              <select name="membership_status" value={form.membership_status} onChange={handleChange} className={inputCls("membership_status")}>
                <option value="Regular">Regular</option>
                <option value="Premium">Premium</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Address *</label>
            <textarea name="address" value={form.address} onChange={handleChange}
              placeholder="Full address" rows={2}
              className={`${inputCls("address")} resize-none`} />
            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-5 border-t border-[#1e2d4a]">
          <button onClick={onClose}
            className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Registering..." : "Register Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────
const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getPatients();
      setPatients(res.data || []);
    } catch {
      setError("Failed to load patients.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      (p.email || "").toLowerCase().includes(q) ||
      (p.phone || "").includes(q)
    );
  });

  const memberBadge = (status) =>
    status === "Premium"
      ? "bg-yellow-400/10 text-yellow-400 border border-yellow-400/30"
      : "bg-gray-500/10 text-gray-400 border border-gray-500/30";

  return (
    <ReceptionLayout title="Patients">
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email, or phone…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-400 w-72 transition"
        />
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Register Patient
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">ID</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Phone</th>
                <th className="px-4 py-3 text-left">Age</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Blood</th>
                <th className="px-4 py-3 text-left">Membership</th>
                <th className="px-4 py-3 text-left">Registered</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(9)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center text-gray-500 py-12 text-sm">
                    {search ? "No patients match your search." : "No patients registered yet."}
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.patient_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">#{p.patient_id}</td>
                    <td className="px-4 py-3 text-white font-medium">
                      {p.first_name} {p.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-400">{p.email}</td>
                    <td className="px-4 py-3 text-gray-300">{p.phone}</td>
                    <td className="px-4 py-3 text-gray-300">{p.age ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-300">{p.gender}</td>
                    <td className="px-4 py-3">
                      {p.blood_group ? (
                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded">
                          {p.blood_group}
                        </span>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-md font-medium ${memberBadge(p.membership_status)}`}>
                        {p.membership_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {p.created_at ? new Date(p.created_at).toLocaleDateString("en-IN") : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-[#1e2d4a] text-xs text-gray-500">
          {!loading && `${filtered.length} of ${patients.length} patients`}
        </div>
      </div>

      {modalOpen && (
        <AddPatientModal
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchPatients(); }}
        />
      )}
    </ReceptionLayout>
  );
};

export default PatientsPage;
