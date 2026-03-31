import React, { useState, useEffect } from "react";
import API from "../../../api";

const today = new Date().toISOString().split("T")[0];
const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

// ✨ GLASS INPUT STYLE
const inputCls =
  "w-full bg-white/70 backdrop-blur-md border border-white/40 rounded-lg px-3 py-2 text-sm text-[#1E293B] placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition";

// ✨ FIELD WRAPPER
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-semibold text-[#1B4360] mb-1">
      {label}
    </label>
    {children}
  </div>
);

const RoleModal = ({ record, onClose, onSaved, roleConfig }) => {
  const { role, endpoint, idKey, extraFields = [] } = roleConfig;
  const isEdit = !!record;

  const extraDefaults = {};
  extraFields.forEach((f) => {
    extraDefaults[f.name] = f.default ?? "";
  });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    salary: 10000,
    date_of_birth: "",
    joining_date: today,
    ...extraDefaults,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (record) {
      const s = record.staff || {};
      const extra = {};
      extraFields.forEach((f) => {
        extra[f.name] = record[f.name] ?? f.default ?? "";
      });

      setForm({
        first_name: s.user?.first_name || "",
        last_name: s.user?.last_name || "",
        email: s.user?.email || "",
        password: "",
        phone: s.phone || "",
        salary: s.salary || 10000,
        date_of_birth: formatDate(s.date_of_birth),
        joining_date: formatDate(s.joining_date) || today,
        ...extra,
      });
    }
  }, [record]);

  const set = (name, value) =>
    setForm((p) => ({ ...p, [name]: value }));

  const buildPayload = () => {
    const extra = {};
    extraFields.forEach((f) => {
      extra[f.name] = form[f.name];
    });

    return {
      staff: {
        user: {
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          ...(form.password ? { password: form.password } : {}),
        },
        role,
        phone: form.phone,
        salary: Number(form.salary),
        date_of_birth: form.date_of_birth || null,
        joining_date: form.joining_date || null,
      },
      ...extra,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      const payload = buildPayload();

      if (isEdit) {
        await API.put(`${endpoint}${record[idKey]}/`, payload);
      } else {
        await API.post(endpoint, payload);
      }

      onSaved();
      onClose();
    } catch (err) {
      const data = err.response?.data;
      setServerError(data?.detail || JSON.stringify(data) || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/40">
          <div>
            <h2 className="text-lg font-bold text-[#1B4360]">
              {isEdit ? `Edit ${role}` : `Add New ${role}`}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Role is fixed as {role}
            </p>
          </div>

          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* BODY */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {serverError && (
            <div className="bg-red-100 border border-red-300 text-red-600 text-sm px-4 py-3 rounded-lg">
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name *">
              <input className={inputCls} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
            </Field>
            <Field label="Last Name *">
              <input className={inputCls} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Email *">
              <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            </Field>
            <Field label={isEdit ? "New Password" : "Password *"}>
              <input className={inputCls} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} {...(!isEdit && { required: true })} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone *">
              <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
            </Field>
            <Field label="Salary (₹)">
              <input className={inputCls} type="number" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of Birth *">
              <input className={inputCls} type="date" value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} max={today} required />
            </Field>
            <Field label="Joining Date">
              <input className={inputCls} type="date" value={form.joining_date} onChange={(e) => set("joining_date", e.target.value)} max={today} />
            </Field>
          </div>

          {/* EXTRA FIELDS */}
          {extraFields.length > 0 && (
            <>
              <p className="text-xs text-[#1B4360] font-bold uppercase pt-2">
                {role} Details
              </p>

              {extraFields.map((f) => (
                <Field key={f.name} label={f.label}>
                  <input
                    className={inputCls}
                    type={f.type || "text"}
                    value={form[f.name]}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                </Field>
              ))}
            </>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
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
              {loading ? "Saving..." : isEdit ? `Update ${role}` : `Create ${role}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleModal;