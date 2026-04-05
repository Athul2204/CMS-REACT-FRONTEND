import React, { useState, useEffect } from "react";
import API from "../../../api";

// FIX: Removed `useNavigate` import entirely.
// The old code called navigate("/doctor"), navigate("/pharmacist") etc. after
// creating a staff member — this sent the ADMIN's browser to the new staff
// member's role dashboard, which is a protected route for that role only.
// The ProtectedRoute then couldn't match the admin's role → redirected to /login.
// The admin was not logged out; their session was fine. They just got navigated
// to the wrong place. Fix: stay on the Staff Management page after create/edit.

// ─── Constants ────────────────────────────────────────────────────
const ROLE_CHOICES = ["Doctor", "Receptionist", "Lab Technician", "Pharmacist", "Admin"];
const today = new Date().toISOString().split("T")[0];
const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

// ─── Role-Based Qualification Rules ───────────────────────────────
const QUALIFICATION_RULES = {
  Doctor: {
    validate: (q) => /\bMBBS\b/i.test(q),
    hint: "e.g. MBBS, MBBS MD, MBBS MS",
    error: "Doctor must have MBBS as a compulsory qualification.",
  },
  Pharmacist: {
    validate: (q) => /\bB\.?\s?Pharm\b/i.test(q),
    hint: "e.g. BPharm, B.Pharm, BPharm MD",
    error: "Pharmacist must have B.Pharm as a compulsory qualification.",
  },
  "Lab Technician": {
    validate: (q) =>
      /\b(MIT|BMLT|DMLT|BSc\s?MLT|B\.Sc\s?MLT|MLT)\b/i.test(q),
    hint: "Minimum: MIT, DMLT, BMLT, BSc MLT",
    error:
      "Lab Technician must have a minimum qualification of MIT (or equivalent: DMLT, BMLT, BSc MLT).",
  },
  Receptionist: {
    validate: (q) =>
      /\b(BA|B\.A|BBA|B\.B\.A|BCom|B\.Com|BCOM|BCA|B\.C\.A|BSc|B\.Sc|BHM|B\.H\.M)\b/i.test(
        q
      ),
    hint: "Minimum 3-year degree: BA, BBA, BCom, BCA, BSc, etc.",
    error:
      "Receptionist must have a minimum 3-year degree (BA, BBA, BCom, BCA, or equivalent).",
  },
};

// ─── Styles ───────────────────────────────────────────────────────
const inputBase =
  "w-full bg-white/70 backdrop-blur-md border rounded-lg px-3 py-2 text-sm text-[#1E293B] placeholder-gray-400 focus:outline-none transition";

const inputCls = (hasError) =>
  `${inputBase} ${
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400"
      : "border-white/40 focus:border-[#D4AF37]"
  }`;

const labelCls = "block text-xs font-semibold text-[#1B4360] mb-1 select-none";
const errorCls = "text-xs text-red-500 mt-1 flex items-start gap-1";
const fieldWrap = "mb-3";

// ─── Helper: flatten backend error object into { fieldName: message } ──
function parseBackendErrors(errData) {
  const flat = {};

  const flatten = (obj, prefix = "") => {
    if (!obj || typeof obj !== "object") return;

    if (Array.isArray(obj)) {
      flat[prefix] = obj.join(" ");
      return;
    }

    Object.entries(obj).forEach(([key, value]) => {
      const path = prefix ? `${prefix}.${key}` : key;
      if (Array.isArray(value)) {
        flat[path] = value.join(" ");
      } else if (typeof value === "object") {
        flatten(value, path);
      } else {
        flat[path] = String(value);
      }
    });
  };

  // Backend wraps errors in { errors: {...} } or { detail: "..." }
  const source = errData?.errors ?? errData;
  flatten(source);
  return flat;
}

// Map backend flat keys → our form field names
function mapBackendKey(key) {
  const map = {
    "user.first_name": "first_name",
    "user.last_name": "last_name",
    "user.email": "email",
    "user.password": "password",
    "user.username": "email", // username errors shown under email
    phone: "phone",
    salary: "salary",
    date_of_birth: "date_of_birth",
    joining_date: "joining_date",
    qualification: "qualification",
    address: "address",
    role: "role",
    non_field_errors: "_form",
    detail: "_form",
  };
  return map[key] ?? key;
}

// ─── Component ────────────────────────────────────────────────────
const StaffModal = ({ staff, onClose, onSaved }) => {
  const isEdit = !!staff;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
    // Clear field error on change
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  // ─── Frontend Validation ────────────────────────────────────────
  const validateForm = () => {
    const errs = {};

    if (!form.first_name.trim()) errs.first_name = "First name is required.";
    if (!form.last_name.trim()) errs.last_name = "Last name is required.";

    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (!isEdit && !form.password) {
      errs.password = "Password is required.";
    } else if (!isEdit && form.password.length < 8) {
      errs.password = "Password must be at least 8 characters.";
    }

    if (!form.role) errs.role = "Please select a role.";

    if (!form.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (!/^\+?\d{9,15}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Enter a valid phone number (9–15 digits).";
    }

    if (!form.salary || Number(form.salary) <= 0) {
      errs.salary = "Salary must be a positive number.";
    } else if (Number(form.salary) > 1_000_000) {
      errs.salary = "Salary cannot exceed ₹10,00,000.";
    }

    if (!form.joining_date) {
      errs.joining_date = "Joining date is required.";
    } else if (form.joining_date > today) {
      errs.joining_date = "Joining date cannot be in the future.";
    }

    if (form.date_of_birth && form.date_of_birth > today) {
      errs.date_of_birth = "Date of birth cannot be in the future.";
    }

    // Role-based minimum age validation (mirrors backend)
    const roleMinAge = {
      Doctor: 25,
      Receptionist: 21,
      "Lab Technician": 22,
      Pharmacist: 23,
      Admin: 21,
    };
    if (form.date_of_birth && form.role) {
      const dob = new Date(form.date_of_birth);
      const ageYears = Math.floor((new Date() - dob) / (365.25 * 24 * 60 * 60 * 1000));
      const minAge = roleMinAge[form.role] ?? 21;
      if (ageYears < minAge) {
        errs.date_of_birth = `${form.role} must be at least ${minAge} years old.`;
      }
    }

    // ─── Qualification validation per role ───────────────────────
    const rule = QUALIFICATION_RULES[form.role];
    if (rule) {
      if (!form.qualification.trim()) {
        errs.qualification = `Qualification is required for ${form.role}.`;
      } else if (!rule.validate(form.qualification)) {
        errs.qualification = rule.error;
      }
    }

    return errs;
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

    // Run frontend validations first
    const frontendErrors = validateForm();
    if (Object.keys(frontendErrors).length > 0) {
      setErrors(frontendErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const payload = buildPayload();
      if (isEdit) {
        await API.put(`/api/administration/staff/${staff.id}/`, payload);
      } else {
        await API.post("/api/administration/staff/", payload);
      }

      // FIX: Call onSaved() (which refreshes the staff list) then onClose().
      // Do NOT navigate away — the admin created/edited a staff member and
      // should stay on the Staff Management page.
      // The old code did navigate("/doctor") etc., sending the admin's own
      // browser to the new staff member's role dashboard → ProtectedRoute
      // rejected the admin → redirect to /login (looked like a logout).
      onSaved();
      onClose();
    } catch (err) {
      const errData = err.response?.data;

      if (errData && typeof errData === "object") {
        const flat = parseBackendErrors(errData);
        const mapped = {};
        Object.entries(flat).forEach(([k, v]) => {
          mapped[mapBackendKey(k)] = v;
        });
        setErrors(mapped);
      } else {
        setErrors({ _form: err.response?.data?.detail || "Failed to save staff. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Helper: render an error message ────────────────────────────
  const ErrMsg = ({ field }) =>
    errors[field] ? (
      <p className={errorCls}>
        <span className="mt-0.5">⚠</span>
        <span>{errors[field]}</span>
      </p>
    ) : null;

  const qualHint = form.role && QUALIFICATION_RULES[form.role]
    ? QUALIFICATION_RULES[form.role].hint
    : "e.g. MBBS, BPharm, MIT, BCA…";

  // ─── Render ─────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex justify-center items-center p-4">
      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl p-6 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        {/* ── Header ── */}
        <h2 className="text-xl font-bold text-[#1B4360] mb-5">
          {isEdit ? "Edit Staff Member" : "Add New Staff Member"}
        </h2>

        {/* ── Form-level error banner ── */}
        {errors._form && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
            {errors._form}
          </div>
        )}

        {/* ── Name Row ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className={fieldWrap}>
            <label className={labelCls}>First Name <span className="text-red-500">*</span></label>
            <input
              className={inputCls(!!errors.first_name)}
              placeholder="e.g. Rahul"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
            />
            <ErrMsg field="first_name" />
          </div>

          <div className={fieldWrap}>
            <label className={labelCls}>Last Name <span className="text-red-500">*</span></label>
            <input
              className={inputCls(!!errors.last_name)}
              placeholder="e.g. Sharma"
              value={form.last_name}
              onChange={(e) => set("last_name", e.target.value)}
            />
            <ErrMsg field="last_name" />
          </div>
        </div>

        {/* ── Email ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
          <input
            className={inputCls(!!errors.email)}
            type="email"
            placeholder="e.g. rahul@hospital.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
          <ErrMsg field="email" />
        </div>

        {/* ── Password (create only) ── */}
        {!isEdit && (
          <div className={fieldWrap}>
            <label className={labelCls}>Password <span className="text-red-500">*</span></label>
            <input
              className={inputCls(!!errors.password)}
              type="password"
              placeholder="Minimum 8 characters"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
            />
            <ErrMsg field="password" />
          </div>
        )}

        {/* ── Role ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Role / Designation <span className="text-red-500">*</span></label>
          <select
            className={inputCls(!!errors.role)}
            value={form.role}
            onChange={(e) => {
              set("role", e.target.value);
              // Clear qualification error when role changes
              setErrors((prev) => {
                const next = { ...prev };
                delete next.qualification;
                return next;
              });
            }}
          >
            <option value="">— Select Role —</option>
            {ROLE_CHOICES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <ErrMsg field="role" />
        </div>

        {/* ── Phone ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
          <input
            className={inputCls(!!errors.phone)}
            type="tel"
            placeholder="e.g. +919876543210"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
          />
          <ErrMsg field="phone" />
        </div>

        {/* ── Salary ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Monthly Salary (₹)</label>
          <input
            className={inputCls(!!errors.salary)}
            type="number"
            placeholder="e.g. 35000"
            min={1}
            max={1000000}
            value={form.salary}
            onChange={(e) => set("salary", e.target.value)}
          />
          <ErrMsg field="salary" />
        </div>

        {/* ── Qualification ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>
            Qualification
            {form.role && QUALIFICATION_RULES[form.role] && (
              <span className="text-red-500"> *</span>
            )}
          </label>
          <input
            className={inputCls(!!errors.qualification)}
            placeholder={qualHint}
            value={form.qualification}
            onChange={(e) => set("qualification", e.target.value)}
          />
          {/* Dynamic hint based on selected role */}
          {form.role && QUALIFICATION_RULES[form.role] && !errors.qualification && (
            <p className="text-xs text-[#1B4360]/60 mt-1 pl-0.5">
              {form.role === "Doctor" && "⚕ MBBS is mandatory for Doctors."}
              {form.role === "Pharmacist" && "⚕ B.Pharm is mandatory for Pharmacists."}
              {form.role === "Lab Technician" && "🔬 Minimum qualification: MIT or equivalent (DMLT, BMLT, BSc MLT)."}
              {form.role === "Receptionist" && "🎓 Minimum 3-year degree required (BA, BBA, BCom, BCA, etc.)."}
            </p>
          )}
          <ErrMsg field="qualification" />
        </div>

        {/* ── Date of Birth ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Date of Birth</label>
          <input
            className={inputCls(!!errors.date_of_birth)}
            type="date"
            value={form.date_of_birth}
            max={today}
            onChange={(e) => set("date_of_birth", e.target.value)}
          />
          {form.role && !errors.date_of_birth && (
            <p className="text-xs text-[#1B4360]/60 mt-1 pl-0.5">
              Min age — Doctor: 25 yrs · Pharmacist: 23 yrs · Lab Technician: 22 yrs · Receptionist/Admin: 21 yrs
            </p>
          )}
          <ErrMsg field="date_of_birth" />
        </div>

        {/* ── Joining Date ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Joining Date <span className="text-red-500">*</span></label>
          <input
            className={inputCls(!!errors.joining_date)}
            type="date"
            value={form.joining_date}
            max={today}
            onChange={(e) => set("joining_date", e.target.value)}
          />
          <ErrMsg field="joining_date" />
        </div>

        {/* ── Address ── */}
        <div className={fieldWrap}>
          <label className={labelCls}>Address</label>
          <textarea
            className={`${inputCls(!!errors.address)} resize-none`}
            rows={2}
            placeholder="Residential address (optional)"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
          <ErrMsg field="address" />
        </div>

        {/* ── Actions ── */}
        <div className="flex justify-end gap-3 mt-5 pt-3 border-t border-white/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-[#1B4360] font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-[#D4AF37] text-[#1E293B] font-semibold hover:bg-[#F1D279] disabled:opacity-60 transition"
          >
            {loading ? "Saving…" : isEdit ? "Update Staff" : "Create Staff"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffModal;