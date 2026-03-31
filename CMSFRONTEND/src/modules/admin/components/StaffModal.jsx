import React, { useState, useEffect } from "react";
import API from "../../../api";
import { useNavigate } from "react-router-dom";

const ROLE_CHOICES = ["Doctor", "Receptionist", "Lab Technician", "Pharmacist", "Admin"];
const today = new Date().toISOString().split("T")[0];
const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

// ✨ NEW INPUT STYLE (GLASS + LIGHT THEME)
const inputCls =
  "w-full bg-white/70 backdrop-blur-md border border-white/40 rounded-lg px-3 py-2 text-sm text-[#1E293B] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition mb-3";

const StaffModal = ({ staff, onClose, onSaved }) => {
  const isEdit = !!staff;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    salary: 10000,
    date_of_birth: "",
    joining_date: today,
    qualification: "",
    address: "",
  });

  useEffect(() => {
    if (staff) {
      setForm({
        first_name: staff.user?.first_name || "",
        last_name: staff.user?.last_name || "",
        email: staff.user?.email || "",
        password: "",
        role: staff.role || "",
        phone: staff.phone || "",
        salary: staff.salary || 10000,
        date_of_birth: formatDate(staff.date_of_birth),
        joining_date: formatDate(staff.joining_date) || today,
        qualification: staff.qualification || "",
        address: staff.address || "",
      });
    }
  }, [staff]);

  const set = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildPayload = () => ({
    user: {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
    },
    role: form.role,
    phone: form.phone,
    salary: Number(form.salary),
    date_of_birth: form.date_of_birth || null,
    joining_date: form.joining_date,
    qualification: form.qualification,
    address: form.address,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = buildPayload();

      let res;
      if (isEdit) {
        res = await API.put(`/api/administration/staff/${staff.id}/`, payload);
      } else {
        res = await API.post("/api/administration/staff/", payload);
      }

      const role = res.data.role;

      onSaved();
      onClose();

      // 🔁 Redirect
      if (!isEdit) {
        if (role === "Doctor") navigate("/doctor");
        else if (role === "Pharmacist") navigate("/pharmacist");
        else if (role === "Receptionist") navigate("/reception");
        else if (role === "Lab Technician") navigate("/lab");
      }

    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save staff");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl p-6 rounded-2xl w-full max-w-xl"
      >
        {/* HEADER */}
        <h2 className="text-xl font-bold text-[#1B4360] mb-6">
          {isEdit ? "Edit Staff" : "Add New Staff"}
        </h2>

        {/* NAME */}
        <div className="grid grid-cols-2 gap-3">
          <input
            className={inputCls}
            placeholder="First Name"
            value={form.first_name}
            onChange={(e) => set("first_name", e.target.value)}
            required
          />
          <input
            className={inputCls}
            placeholder="Last Name"
            value={form.last_name}
            onChange={(e) => set("last_name", e.target.value)}
            required
          />
        </div>

        {/* EMAIL */}
        <input
          className={inputCls}
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          required
        />

        {/* PASSWORD */}
        {!isEdit && (
          <input
            className={inputCls}
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            required
          />
        )}

        {/* ROLE */}
        <select
          className={inputCls}
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          required
        >
          <option value="">Select Role</option>
          {ROLE_CHOICES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        {/* PHONE */}
        <input
          className={inputCls}
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          required
        />

        {/* SALARY */}
        <input
          className={inputCls}
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => set("salary", e.target.value)}
        />

        {/* QUALIFICATION */}
        <input
          className={inputCls}
          placeholder="Qualification (MBBS, BSc, Diploma...)"
          value={form.qualification}
          onChange={(e) => set("qualification", e.target.value)}
        />

        {/* DOB */}
        <input
          className={inputCls}
          type="date"
          value={form.date_of_birth}
          onChange={(e) => set("date_of_birth", e.target.value)}
          max={today}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-black"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#D4AF37] text-[#1E293B] font-semibold hover:bg-[#F1D279] transition"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffModal;