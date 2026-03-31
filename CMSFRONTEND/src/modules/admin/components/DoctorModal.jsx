// import React, { useState, useEffect } from "react";
// import API from "../../../api";

// const today = new Date().toISOString().split("T")[0];
// const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

// // 🌟 GLASS INPUT STYLE
// const inputCls =
//   "w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-300 focus:outline-none focus:border-[#D4AF37] transition";

// // 🌟 FIELD COMPONENT
// const Field = ({ label, children }) => (
//   <div>
//     <label className="block text-xs font-medium text-gray-300 mb-1">{label}</label>
//     {children}
//   </div>
// );

// const SPECIALIZATIONS = [
//   "General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
//   "Dermatology", "Gynecology", "Ophthalmology", "ENT", "Psychiatry",
//   "Radiology", "Oncology", "Nephrology", "Gastroenterology", "Endocrinology"
// ];

// const DoctorModal = ({ doctor, onClose, onSaved }) => {
//   const isEdit = !!doctor;

//   const [form, setForm] = useState({
//     first_name: "",
//     last_name: "",
//     email: "",
//     password: "",
//     phone: "",
//     salary: 10000,
//     date_of_birth: "",
//     joining_date: today,

//     // Doctor specific
//     specialization: "General",
//     consultation_fee: 500,
//     experience_years: 1,
//   });

//   const [loading, setLoading] = useState(false);
//   const [serverError, setServerError] = useState("");

//   useEffect(() => {
//     if (doctor) {
//       const s = doctor.staff || {};
//       setForm({
//         first_name: s.user?.first_name || "",
//         last_name: s.user?.last_name || "",
//         email: s.user?.email || "",
//         password: "",
//         phone: s.phone || "",
//         salary: s.salary || 10000,
//         date_of_birth: formatDate(s.date_of_birth),
//         joining_date: formatDate(s.joining_date) || today,

//         specialization: doctor.specialization || "General",
//         consultation_fee: doctor.consultation_fee || 500,
//         experience_years: doctor.experience_years || 1,
//       });
//     }
//   }, [doctor]);

//   const set = (name, value) => {
//     setForm((p) => ({ ...p, [name]: value }));
//   };

//   const buildPayload = () => ({
//     staff: {
//       user: {
//         first_name: form.first_name,
//         last_name: form.last_name,
//         email: form.email,
//         ...(form.password ? { password: form.password } : {}),
//       },
//       role: "Doctor",
//       phone: form.phone,
//       salary: Number(form.salary),
//       date_of_birth: form.date_of_birth || null,
//       joining_date: form.joining_date || null,
//     },
//     specialization: form.specialization,
//     consultation_fee: Number(form.consultation_fee),
//     experience_years: Number(form.experience_years),
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setServerError("");

//     try {
//       const payload = buildPayload();

//       if (isEdit) {
//         await API.put(`/api/administration/doctor/${doctor.doctor_id}/`, payload);
//       } else {
//         await API.post("/api/administration/doctor/", payload);
//       }

//       onSaved();
//       onClose();
//     } catch (err) {
//       const data = err.response?.data;
//       setServerError(data?.detail || JSON.stringify(data) || "Failed to save");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-lg flex items-center justify-center p-4">
//       <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">

//         {/* HEADER */}
//         <div className="flex items-center justify-between px-6 py-5 border-b border-white/20">
//           <div>
//             <h2 className="text-lg font-semibold text-[#F1D279]">
//               {isEdit ? "Edit Doctor" : "Add New Doctor"}
//             </h2>
//             <p className="text-xs text-gray-300 mt-0.5">Role is fixed as Doctor</p>
//           </div>

//           <button onClick={onClose} className="text-gray-400 hover:text-white transition">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
//               <path d="M18 6 6 18M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* FORM */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-5">

//           {serverError && (
//             <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
//               {serverError}
//             </div>
//           )}

//           {/* PERSONAL */}
//           <p className="text-xs text-[#F1D279] uppercase tracking-wider font-semibold">
//             Personal Info
//           </p>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="First Name *">
//               <input className={inputCls} value={form.first_name} onChange={(e) => set("first_name", e.target.value)} required />
//             </Field>

//             <Field label="Last Name *">
//               <input className={inputCls} value={form.last_name} onChange={(e) => set("last_name", e.target.value)} required />
//             </Field>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Email *">
//               <input className={inputCls} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
//             </Field>

//             <Field label={isEdit ? "New Password" : "Password *"}>
//               <input className={inputCls} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} {...(!isEdit && { required: true })} />
//             </Field>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Phone *">
//               <input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
//             </Field>

//             <Field label="Salary (₹)">
//               <input className={inputCls} type="number" value={form.salary} onChange={(e) => set("salary", e.target.value)} />
//             </Field>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Date of Birth">
//               <input className={inputCls} type="date" max={today} value={form.date_of_birth} onChange={(e) => set("date_of_birth", e.target.value)} />
//             </Field>

//             <Field label="Joining Date">
//               <input className={inputCls} type="date" value={form.joining_date} onChange={(e) => set("joining_date", e.target.value)} />
//             </Field>
//           </div>

//           {/* DOCTOR */}
//           <p className="text-xs text-[#F1D279] uppercase tracking-wider font-semibold pt-2">
//             Doctor Details
//           </p>

//           <div className="grid grid-cols-2 gap-4">
//             <Field label="Specialization">
//               <select className={inputCls} value={form.specialization} onChange={(e) => set("specialization", e.target.value)}>
//                 {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
//               </select>
//             </Field>

//             <Field label="Consultation Fee (₹)">
//               <input className={inputCls} type="number" value={form.consultation_fee} onChange={(e) => set("consultation_fee", e.target.value)} />
//             </Field>
//           </div>

//           <Field label="Experience (Years)">
//             <input className={inputCls} type="number" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} />
//           </Field>

//           {/* BUTTONS */}
//           <div className="flex justify-end gap-3 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2.5 text-sm rounded-lg border border-white/20 text-gray-300 hover:text-white transition"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-5 py-2.5 text-sm rounded-lg bg-[#D4AF37] text-[#1B4360] font-semibold hover:bg-[#F1D279] transition"
//             >
//               {loading ? "Saving..." : isEdit ? "Update Doctor" : "Create Doctor"}
//             </button>
//           </div>

//         </form>
//       </div>
//     </div>
//   );
// };

// export default DoctorModal;


import React, { useState, useEffect } from "react";
import API from "../../../api";

const today = new Date().toISOString().split("T")[0];
const formatDate = (d) => (d ? new Date(d).toISOString().split("T")[0] : "");

const inputCls =
  "w-full bg-[#020617] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition";

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-medium text-gray-300 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const SPECIALIZATIONS = [
  "General", "Cardiology", "Neurology", "Orthopedics", "Pediatrics",
  "Dermatology", "Gynecology", "Ophthalmology", "ENT", "Psychiatry",
  "Radiology", "Oncology", "Nephrology", "Gastroenterology", "Endocrinology"
];

const DoctorModal = ({ doctor, onClose, onSaved }) => {
  const isEdit = !!doctor;

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
    salary: 10000,
    date_of_birth: "",
    joining_date: today,
    specialization: "General",
    consultation_fee: 500,
    experience_years: 1,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (doctor) {
      const s = doctor.staff || {};
      setForm({
        first_name: s.user?.first_name || "",
        last_name: s.user?.last_name || "",
        email: s.user?.email || "",
        password: "",
        phone: s.phone || "",
        salary: s.salary || 10000,
        date_of_birth: formatDate(s.date_of_birth),
        joining_date: formatDate(s.joining_date) || today,
        specialization: doctor.specialization || "General",
        consultation_fee: doctor.consultation_fee || 500,
        experience_years: doctor.experience_years || 1,
      });
    }
  }, [doctor]);

  const set = (name, value) => {
    setForm((p) => ({ ...p, [name]: value }));
  };

  const buildPayload = () => ({
    staff: {
      user: {
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
      },
      role: "Doctor",
      phone: form.phone,
      salary: Number(form.salary),
      date_of_birth: form.date_of_birth || null,
      joining_date: form.joining_date || null,
    },
    specialization: form.specialization,
    consultation_fee: Number(form.consultation_fee),
    experience_years: Number(form.experience_years),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");

    try {
      const payload = buildPayload();

      if (isEdit) {
        await API.put(`/api/administration/doctor/${doctor.doctor_id}/`, payload);
      } else {
        await API.post("/api/administration/doctor/", payload);
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">

      <div className="bg-[#020617] border border-[#1e2d4a] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2d4a]">
          <div>
            <h2 className="text-lg font-semibold text-[#F1D279]">
              {isEdit ? "Edit Doctor" : "Add New Doctor"}
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Role: Doctor
            </p>
          </div>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {serverError}
            </div>
          )}

          {/* PERSONAL */}
          <p className="text-xs text-[#F1D279] font-semibold uppercase tracking-wider">
            Personal Info
          </p>

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

          {/* DOCTOR */}
          <p className="text-xs text-[#F1D279] font-semibold uppercase tracking-wider pt-2">
            Doctor Details
          </p>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Specialization">
              <select className={inputCls} value={form.specialization} onChange={(e) => set("specialization", e.target.value)}>
                {SPECIALIZATIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>

            <Field label="Consultation Fee (₹)">
              <input className={inputCls} type="number" value={form.consultation_fee} onChange={(e) => set("consultation_fee", e.target.value)} />
            </Field>
          </div>

          <Field label="Experience (Years)">
            <input className={inputCls} type="number" value={form.experience_years} onChange={(e) => set("experience_years", e.target.value)} />
          </Field>

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm rounded-lg border border-[#1e2d4a] text-gray-300 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm rounded-lg bg-[#D4AF37] text-[#020617] font-semibold hover:bg-[#F1D279] transition"
            >
              {loading ? "Saving..." : isEdit ? "Update Doctor" : "Create Doctor"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default DoctorModal;