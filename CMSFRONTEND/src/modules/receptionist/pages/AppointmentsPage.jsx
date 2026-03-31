import React, { useEffect, useState } from "react";
import ReceptionLayout from "../components/ReceptionLayout";
import {
  getAppointmentsByDate,
  createAppointment,
  cancelAppointment,
  getPatients,
  getDoctors,
  getDoctorAvailability,
} from "../api/receptionApi";

// ─── HELPERS ──────────────────────────────────────────────────────
const fmt12 = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
};

// ─── BOOK APPOINTMENT MODAL ───────────────────────────────────────
const BookAppointmentModal = ({ onClose, onSaved }) => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [fetchError, setFetchError] = useState("");

  // Load patients + doctors once
  useEffect(() => {
    Promise.all([getPatients(), getDoctors()])
      .then(([p, d]) => {
        setPatients(p.data || []);
        setDoctors(d.data || []);
      })
      .catch(() => setFetchError("Failed to load patients/doctors."));
  }, []);

  // Whenever doctor OR date changes, fetch availability slots
  useEffect(() => {
    if (!form.doctor || !form.appointment_date) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    getDoctorAvailability(form.appointment_date)
      .then((res) => {
        const all = res.data || [];
        setSlots(all.filter((s) => String(s.doctor) === String(form.doctor)));
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
    setForm((prev) => ({ ...prev, appointment_time: "" }));
  }, [form.doctor, form.appointment_date]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const selectSlot = (slot) => {
    setForm((prev) => ({ ...prev, appointment_time: slot.start_time }));
    setErrors((prev) => ({ ...prev, appointment_time: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.patient)          e.patient = "Required";
    if (!form.doctor)           e.doctor = "Required";
    if (!form.appointment_date) e.appointment_date = "Required";
    if (!form.appointment_time) e.appointment_time = "Please select an available slot";
    if (!form.reason.trim())    e.reason = "Required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setLoading(true);
    try {
      await createAppointment({
        patient:          parseInt(form.patient),
        doctor:           parseInt(form.doctor),
        appointment_date: form.appointment_date,
        appointment_time: form.appointment_time,
        reason:           form.reason,
      });
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        if (data.non_field_errors) {
          const msg = Array.isArray(data.non_field_errors)
            ? data.non_field_errors.join(" ")
            : data.non_field_errors;
          setErrors({ general: msg });
        } else {
          const serverErrors = {};
          Object.entries(data).forEach(([key, val]) => {
            serverErrors[key] = Array.isArray(val) ? val[0] : String(val);
          });
          setErrors(serverErrors);
        }
      } else {
        setErrors({ general: "Failed to book appointment. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full bg-[#060d1a] border ${
      errors[field] ? "border-red-500" : "border-[#1e2d4a]"
    } rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition`;

  const today = new Date().toISOString().split("T")[0];
  const selectedDoctor = doctors.find((d) => String(d.doctor_id) === String(form.doctor));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-2xl w-full max-w-xl shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#1e2d4a] shrink-0">
          <h2 className="text-lg font-semibold text-white">Book Appointment</h2>
          {/* ✅ FIX: type="button" prevents page refresh */}
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-white transition text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">

          {fetchError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{fetchError}</div>
          )}
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{errors.general}</div>
          )}

          {/* Patient */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Patient *</label>
            <select name="patient" value={form.patient} onChange={handleChange} className={inputCls("patient")}>
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p.patient_id} value={p.patient_id}>
                  {p.first_name} {p.last_name} — {p.phone}
                </option>
              ))}
            </select>
            {errors.patient && <p className="text-red-400 text-xs mt-1">{errors.patient}</p>}
          </div>

          {/* Doctor */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Doctor *</label>
            <select name="doctor" value={form.doctor} onChange={handleChange} className={inputCls("doctor")}>
              <option value="">Select Doctor</option>
              {doctors.map((d) => {
                const name = d.staff?.user
                  ? `${d.staff.user.first_name} ${d.staff.user.last_name}`.trim()
                  : `Doctor #${d.doctor_id}`;
                return (
                  <option key={d.doctor_id} value={d.doctor_id}>
                    Dr. {name} — {d.specialization} (₹{d.consultation_fee})
                  </option>
                );
              })}
            </select>
            {errors.doctor && <p className="text-red-400 text-xs mt-1">{errors.doctor}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Appointment Date *</label>
            <input
              type="date"
              name="appointment_date"
              min={today}
              value={form.appointment_date}
              onChange={handleChange}
              className={inputCls("appointment_date")}
            />
            {errors.appointment_date && <p className="text-red-400 text-xs mt-1">{errors.appointment_date}</p>}
          </div>

          {/* Available Time Slots */}
          <div>
            <label className="text-xs text-gray-400 mb-2 block">
              Available Time Slots *
              {form.doctor && form.appointment_date && (
                <span className="ml-2 text-gray-600">
                  {slotsLoading ? "Loading…" : `(${slots.length} slot${slots.length !== 1 ? "s" : ""})`}
                </span>
              )}
            </label>

            {(!form.doctor || !form.appointment_date) && (
              <div className="bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-4 py-3 text-xs text-gray-600 italic">
                Select a doctor and date to see available slots
              </div>
            )}

            {form.doctor && form.appointment_date && slotsLoading && (
              <div className="flex gap-2 flex-wrap">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-9 w-28 bg-[#1e2d4a] rounded-lg animate-pulse" />
                ))}
              </div>
            )}

            {form.doctor && form.appointment_date && !slotsLoading && slots.length === 0 && (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-xs text-amber-400">
                ⚠️ No availability set for this doctor on this date.
              </div>
            )}

            {!slotsLoading && slots.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => {
                  const isSelected = form.appointment_time === slot.start_time;
                  return (
                    <button
                      key={slot.availability_id}
                      type="button" // ✅ FIX
                      onClick={() => selectSlot(slot)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all ${
                        isSelected
                          ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/20"
                          : "bg-[#060d1a] border-[#1e2d4a] text-gray-300 hover:border-blue-400/60 hover:text-blue-300"
                      }`}
                    >
                      {fmt12(slot.start_time)} – {fmt12(slot.end_time)}
                    </button>
                  );
                })}
              </div>
            )}

            {errors.appointment_time && (
              <p className="text-red-400 text-xs mt-1">{errors.appointment_time}</p>
            )}

            {form.appointment_time && (
              <p className="text-xs text-emerald-400 mt-2">
                ✓ Selected: {fmt12(form.appointment_time)}
              </p>
            )}
          </div>

          {/* Doctor info strip */}
          {selectedDoctor && (
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center gap-3">
              <span className="text-lg">🩺</span>
              <div>
                <p className="text-xs text-white font-medium">
                  Dr. {selectedDoctor.staff?.user
                    ? `${selectedDoctor.staff.user.first_name} ${selectedDoctor.staff.user.last_name}`.trim()
                    : `Doctor #${selectedDoctor.doctor_id}`}
                </p>
                <p className="text-xs text-gray-500">
                  {selectedDoctor.specialization} · ₹{selectedDoctor.consultation_fee} consultation fee
                </p>
              </div>
            </div>
          )}

          {/* Reason */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Reason *</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Reason for visit…"
              className={`${inputCls("reason")} resize-none`}
            />
            {errors.reason && <p className="text-red-400 text-xs mt-1">{errors.reason}</p>}
          </div>

          <p className="text-xs text-gray-600">
            ℹ️ Token number is auto-assigned by the system.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-[#1e2d4a] shrink-0">
          {/* ✅ FIX: type="button" on both footer buttons */}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || slotsLoading}
            className="px-5 py-2 text-sm font-semibold bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2"
          >
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── STATUS BADGE ─────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cls = {
    Scheduled: "bg-blue-400/10 text-blue-400 border-blue-400/30",
    Completed: "bg-green-400/10 text-green-400 border-green-400/30",
    Cancelled: "bg-red-400/10 text-red-400 border-red-400/30",
  }[status] || "bg-gray-400/10 text-gray-400 border-gray-400/30";
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded border ${cls}`}>
      {status}
    </span>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────
const AppointmentsPage = () => {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate]                 = useState(today);
  const [appointments, setAppointments] = useState([]);
  const [count, setCount]               = useState(0);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchAppointments = async (d) => {
    setLoading(true);
    setError("");
    try {
      const res = await getAppointmentsByDate(d);
      setAppointments(res.data || []);
      setCount(res.count || 0);
    } catch {
      setError("Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(date); }, [date]);

  const handleCancel = async (appointmentId) => {
    if (!window.confirm("Cancel this appointment?")) return;
    setCancellingId(appointmentId);
    try {
      await cancelAppointment(appointmentId);
      fetchAppointments(date);
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to cancel appointment.");
    } finally {
      setCancellingId(null);
    }
  };

  const stats = {
    total:     count,
    scheduled: appointments.filter((a) => a.status === "Scheduled").length,
    completed: appointments.filter((a) => a.status === "Completed").length,
    cancelled: appointments.filter((a) => a.status === "Cancelled").length,
  };

  return (
    <ReceptionLayout title="Appointments">

      {/* Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-400">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-[#0d1629] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400 transition"
          />
          {date !== today && (
            // ✅ FIX: type="button"
            <button type="button" onClick={() => setDate(today)} className="text-xs text-blue-400 hover:underline">
              Back to Today
            </button>
          )}
        </div>
        {/* ✅ FIX: type="button" — this was the main cause of page refresh */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-sm font-semibold rounded-lg transition"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Book Appointment
        </button>
      </div>

      {/* Day Stats */}
      {!loading && (
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total",     value: stats.total,     color: "text-white"     },
            { label: "Scheduled", value: stats.scheduled, color: "text-blue-400"  },
            { label: "Completed", value: stats.completed, color: "text-green-400" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red-400"   },
          ].map((s) => (
            <div key={s.label} className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      {/* Table */}
      <div className="bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e2d4a]">
          <h3 className="text-sm font-semibold text-white">
            Appointments —{" "}
            <span className="text-gray-400 font-normal">
              {new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </span>
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e2d4a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-4 py-3 text-left">Token</th>
                <th className="px-4 py-3 text-left">Patient</th>
                <th className="px-4 py-3 text-left">Doctor</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-left">Fee</th>
                <th className="px-4 py-3 text-left">Reason</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i} className="border-b border-[#1e2d4a]">
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#1e2d4a] rounded animate-pulse w-16" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-gray-500 py-12 text-sm">
                    No appointments for this date.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr key={appt.appointment_id} className="border-b border-[#1e2d4a] hover:bg-[#111d35] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-lg font-bold text-blue-400">#{appt.token_number}</span>
                    </td>
                    <td className="px-4 py-3 text-white font-medium">
                      {appt.patient_full_name || appt.patient_name || `Patient #${appt.patient}`}
                    </td>
                    <td className="px-4 py-3 text-gray-300">
                      {appt.doctor_name || `Doctor #${appt.doctor}`}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                      {fmt12(appt.appointment_time)}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-medium">
                      ₹{appt.consultation_fee ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{appt.reason}</td>
                    <td className="px-4 py-3"><StatusBadge status={appt.status} /></td>
                    <td className="px-4 py-3">
                      {appt.status === "Scheduled" && (
                        // ✅ FIX: type="button"
                        <button
                          type="button"
                          onClick={() => handleCancel(appt.appointment_id)}
                          disabled={cancellingId === appt.appointment_id}
                          className="text-xs text-red-400 hover:text-red-300 border border-red-400/30 px-3 py-1 rounded-lg transition disabled:opacity-50"
                        >
                          {cancellingId === appt.appointment_id ? "..." : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <BookAppointmentModal
          onClose={() => setModalOpen(false)}
          onSaved={() => { setModalOpen(false); fetchAppointments(date); }}
        />
      )}
    </ReceptionLayout>
  );
};

export default AppointmentsPage;