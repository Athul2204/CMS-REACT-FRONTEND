import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConsultationPage,
  createConsultation,
  createLabTestRequest,
  createPrescription,
} from "../api/doctorApi";

// ─── RAINBOW CARD WRAPPER ─────────────────────────────────────────
const Card = ({ children, className = "" }) => (
  <div className={`bg-[#0d1629] border border-[#1e2d4a] rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ title, subtitle }) => (
  <div className="px-5 py-4 border-b border-[#1e2d4a]">
    <h3 className="text-sm font-semibold text-white">{title}</h3>
    {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
  </div>
);

// ─── PATIENT INFO CARD ────────────────────────────────────────────
const PatientInfoCard = ({ patient, appointment }) => (
  <Card className="h-full">
    <CardHeader title="Patient Info" subtitle={`Token #${appointment?.token_number}`} />
    <div className="p-5 space-y-3">
      <div>
        <p className="text-2xl font-bold text-white">
          {patient?.first_name} {patient?.last_name}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {patient?.gender} · {patient?.age ? `${patient.age} yrs` : "—"}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Email", value: patient?.email },
          { label: "Phone", value: patient?.phone },
          { label: "Blood Group", value: patient?.blood_group || "—" },
          { label: "Membership", value: patient?.membership_status },
          { label: "Date of Birth", value: patient?.date_of_birth },
          { label: "Address", value: patient?.address },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm text-gray-300 truncate">{value || "—"}</p>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-[#1e2d4a]">
        <p className="text-xs text-gray-500 mb-1">Reason for Visit</p>
        <p className="text-sm text-gray-200">{appointment?.reason}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Appointment Time</p>
        <p className="text-sm text-blue-400 font-mono">{appointment?.appointment_time}</p>
      </div>
    </div>
  </Card>
);

// ─── CURRENT CONSULTATION ─────────────────────────────────────────
const CurrentConsultationCard = ({ consultation }) => (
  <Card className="h-full">
    <CardHeader title="Current Consultation" />
    <div className="p-5">
      {!consultation ? (
        <div className="flex flex-col items-center justify-center h-40 text-gray-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 mb-2 opacity-30">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
          <p className="text-sm">No consultation recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="inline-block bg-blue-400/10 text-blue-400 border border-blue-400/30 text-xs px-2 py-1 rounded font-mono">
            {consultation.consultation_code}
          </div>
          {[
            { label: "Vitals", value: consultation.vitals },
            { label: "Symptoms", value: consultation.symptoms },
            { label: "Diagnosis", value: consultation.diagnosis },
            { label: "Advice", value: consultation.advice },
          ].map(({ label, value }) =>
            value ? (
              <div key={label}>
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-gray-200 bg-[#060d1a] rounded-lg px-3 py-2">{value}</p>
              </div>
            ) : null
          )}
        </div>
      )}
    </div>
  </Card>
);

// ─── CONSULTATION FORM ────────────────────────────────────────────
const ConsultationForm = ({ appointmentId, onSaved, onClose }) => {
  const [form, setForm] = useState({ symptoms: "", diagnosis: "", vitals: "", advice: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async () => {
    const e = {};
    if (!form.symptoms.trim()) e.symptoms = "Required";
    if (!form.diagnosis.trim()) e.diagnosis = "Required";
    if (!form.vitals.trim()) e.vitals = "Required";
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    try {
      await createConsultation({ appointment: appointmentId, ...form });
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      if (data && typeof data === "object") {
        const se = {};
        Object.entries(data).forEach(([k, v]) => { se[k] = Array.isArray(v) ? v[0] : v; });
        setErrors(se);
      } else {
        setErrors({ general: "Failed to save consultation." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full bg-[#060d1a] border ${errors[field] ? "border-red-500" : "border-[#1e2d4a]"} rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition resize-none`;

  return (
    <Card>
      <CardHeader title="Add Consultation" subtitle="Fill vitals, symptoms, diagnosis" />
      <div className="p-5 space-y-4">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{errors.general}</div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Vitals *</label>
            <textarea name="vitals" rows={2} value={form.vitals} onChange={handleChange}
              placeholder="BP: 120/80, Temp: 98.6°F, Pulse: 72 bpm…"
              className={inputCls("vitals")} />
            {errors.vitals && <p className="text-red-400 text-xs mt-1">{errors.vitals}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Symptoms *</label>
            <textarea name="symptoms" rows={2} value={form.symptoms} onChange={handleChange}
              placeholder="Chief complaints…"
              className={inputCls("symptoms")} />
            {errors.symptoms && <p className="text-red-400 text-xs mt-1">{errors.symptoms}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Diagnosis *</label>
            <textarea name="diagnosis" rows={2} value={form.diagnosis} onChange={handleChange}
              placeholder="Clinical diagnosis…"
              className={inputCls("diagnosis")} />
            {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis}</p>}
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Advice</label>
            <textarea name="advice" rows={2} value={form.advice} onChange={handleChange}
              placeholder="Rest, diet, follow-up instructions…"
              className={inputCls("advice")} />
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving…" : "Save Consultation"}
          </button>
        </div>
      </div>
    </Card>
  );
};

// ─── LAB TEST REQUEST FORM ────────────────────────────────────────
const LabTestForm = ({ consultationId, onSaved, onClose }) => {
  const [items, setItems] = useState([{ test_name: "", notes: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = () => setItems([...items, { test_name: "", notes: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
  };

  const handleSubmit = async () => {
    if (items.some((it) => !it.test_name.trim())) {
      setError("All test names are required.");
      return;
    }
    setLoading(true);
    try {
      await createLabTestRequest({ consultation: consultationId, items });
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.detail || JSON.stringify(err?.response?.data) || "Failed to submit lab request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Request Lab Tests" />
      <div className="p-5 space-y-3">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <input
                value={item.test_name}
                onChange={(e) => updateItem(i, "test_name", e.target.value)}
                placeholder={`Test name (e.g. CBC, Blood Sugar)`}
                className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div className="flex-1">
              <input
                value={item.notes}
                onChange={(e) => updateItem(i, "notes", e.target.value)}
                placeholder="Notes (optional)"
                className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 text-lg mt-1">✕</button>
            )}
          </div>
        ))}
        <button onClick={addItem} className="text-xs text-blue-400 hover:underline">
          + Add another test
        </button>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-purple-500 hover:bg-purple-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Sending…" : "Send Lab Request"}
          </button>
        </div>
      </div>
    </Card>
  );
};

// ─── PRESCRIPTION FORM ────────────────────────────────────────────
const PrescriptionForm = ({ consultationId, doctorId, onSaved, onClose }) => {
  const [items, setItems] = useState([{ medicine_name: "", dosage: "", frequency: "", duration: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addItem = () => setItems([...items, { medicine_name: "", dosage: "", frequency: "", duration: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
  };

  const handleSubmit = async () => {
    if (items.some((it) => !it.medicine_name.trim())) {
      setError("All medicine names are required.");
      return;
    }
    setLoading(true);
    try {
      await createPrescription({ consultation: consultationId, doctor: doctorId, items });
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.detail || JSON.stringify(err?.response?.data) || "Failed to create prescription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Write Prescription" />
      <div className="p-5 space-y-3">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}
        <div className="grid grid-cols-4 gap-2 text-xs text-gray-500 px-1">
          <span>Medicine *</span><span>Dosage</span><span>Frequency</span><span>Duration</span>
        </div>
        {items.map((item, i) => (
          <div key={i} className="flex gap-2 items-center">
            {["medicine_name", "dosage", "frequency", "duration"].map((field) => (
              <input
                key={field}
                value={item[field]}
                onChange={(e) => updateItem(i, field, e.target.value)}
                placeholder={{ medicine_name: "e.g. Paracetamol", dosage: "500mg", frequency: "TDS", duration: "5 days" }[field]}
                className="flex-1 bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition"
              />
            ))}
            {items.length > 1 && (
              <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-300 text-lg">✕</button>
            )}
          </div>
        ))}
        <button onClick={addItem} className="text-xs text-green-400 hover:underline">+ Add medicine</button>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-5 py-2 text-sm font-semibold bg-green-500 hover:bg-green-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Creating…" : "Create Prescription"}
          </button>
        </div>
      </div>
    </Card>
  );
};

// ─── HISTORY PANEL ────────────────────────────────────────────────
const HistoryPanel = ({ consultations, prescriptions, labResults }) => {
  const [tab, setTab] = useState("consultations");

  return (
    <Card className="h-full flex flex-col">
      <div className="flex border-b border-[#1e2d4a]">
        {[
          { key: "consultations", label: `History (${consultations.length})` },
          { key: "prescriptions", label: `Rx (${prescriptions.length})` },
          { key: "labs", label: `Labs (${labResults.length})` },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
              tab === t.key
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tab === "consultations" &&
          (consultations.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No previous consultations.</p>
          ) : (
            consultations.map((c, i) => (
              <div key={i} className="bg-[#060d1a] rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400">{c.consultation_code}</span>
                  <span className="text-xs text-gray-500">{c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN") : ""}</span>
                </div>
                <p className="text-xs text-gray-400"><span className="text-gray-500">Symptoms:</span> {c.symptoms}</p>
                <p className="text-xs text-gray-400"><span className="text-gray-500">Diagnosis:</span> {c.diagnosis}</p>
              </div>
            ))
          ))}

        {tab === "prescriptions" &&
          (prescriptions.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No previous prescriptions.</p>
          ) : (
            prescriptions.map((rx, i) => (
              <div key={i} className="bg-[#060d1a] rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-green-400">{rx.prescription_code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    rx.status === "Dispensed" ? "text-green-400 bg-green-400/10" :
                    rx.status === "Sent" ? "text-blue-400 bg-blue-400/10" :
                    "text-gray-400 bg-gray-400/10"
                  }`}>{rx.status}</span>
                </div>
                {(rx.items || []).map((item, j) => (
                  <p key={j} className="text-xs text-gray-400">
                    • {item.medicine_name || item.medicine} — {item.dosage} {item.frequency} for {item.duration}
                  </p>
                ))}
              </div>
            ))
          ))}

        {tab === "labs" &&
          (labResults.length === 0 ? (
            <p className="text-gray-600 text-sm text-center py-8">No lab results available.</p>
          ) : (
            labResults.map((lr, i) => (
              <div key={i} className="bg-[#060d1a] rounded-lg p-3">
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">Test:</span> {lr.test_name || lr.test || "—"}
                </p>
                <p className="text-xs text-gray-400">
                  <span className="text-gray-500">Result:</span> {lr.result || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {lr.created_at ? new Date(lr.created_at).toLocaleDateString("en-IN") : ""}
                </p>
              </div>
            ))
          ))}
      </div>
    </Card>
  );
};

// ─── MAIN CONSULTATION PAGE ───────────────────────────────────────
const ConsultationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Active form panel
  const [activeForm, setActiveForm] = useState(null); // null | "consultation" | "lab" | "prescription"

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getConsultationPage(appointmentId);
      setData(res.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load consultation data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchData();
  }, [appointmentId]);

  const handleFormSaved = () => {
    setActiveForm(null);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Loading consultation…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl text-sm max-w-md text-center">
          <p className="font-semibold mb-2">Error</p>
          <p>{error}</p>
          <button onClick={() => navigate("/doctor/dashboard")} className="mt-4 text-xs text-gray-400 hover:text-white underline">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasConsultation = !!data.current_consultation;
  const consultationId = data.current_consultation?.id;
  const doctorId = data.appointment?.doctor;

  return (
    <div className="min-h-screen bg-[#060d1a] p-4 md:p-6">
      {/* Back button + header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate("/doctor/dashboard")}
          className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1"
        >
          ← Dashboard
        </button>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300 text-sm">
          Consultation — Token #{data.appointment?.token_number}
        </span>
      </div>

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4" style={{ minHeight: "340px" }}>
        <PatientInfoCard patient={data.patient} appointment={data.appointment} />
        <CurrentConsultationCard consultation={data.current_consultation} />

        {/* Action Buttons */}
        <Card className="flex flex-col">
          <CardHeader title="Actions" />
          <div className="p-5 flex flex-col gap-3 flex-1">
            <button
              onClick={() => setActiveForm(activeForm === "consultation" ? null : "consultation")}
              disabled={hasConsultation}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                hasConsultation
                  ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-500"
                  : activeForm === "consultation"
                  ? "bg-blue-500/20 border-blue-400 text-blue-300"
                  : "border-blue-400/40 text-blue-400 hover:bg-blue-400/10"
              }`}
            >
              <span className="text-lg">📋</span>
              <div className="text-left">
                <p>{hasConsultation ? "Consultation Added ✓" : "Add Consultation"}</p>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  {hasConsultation ? "Already recorded" : "Record vitals, symptoms, diagnosis"}
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveForm(activeForm === "lab" ? null : "lab")}
              disabled={!hasConsultation}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                !hasConsultation
                  ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-500"
                  : activeForm === "lab"
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : "border-purple-400/40 text-purple-400 hover:bg-purple-400/10"
              }`}
            >
              <span className="text-lg">🔬</span>
              <div className="text-left">
                <p>Request Lab Tests</p>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  {!hasConsultation ? "Add consultation first" : "Send to lab technician"}
                </p>
              </div>
            </button>

            <button
              onClick={() => setActiveForm(activeForm === "prescription" ? null : "prescription")}
              disabled={!hasConsultation}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                !hasConsultation
                  ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-500"
                  : activeForm === "prescription"
                  ? "bg-green-500/20 border-green-400 text-green-300"
                  : "border-green-400/40 text-green-400 hover:bg-green-400/10"
              }`}
            >
              <span className="text-lg">💊</span>
              <div className="text-left">
                <p>Write Prescription</p>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  {!hasConsultation ? "Add consultation first" : "Send medicines to pharmacy"}
                </p>
              </div>
            </button>
          </div>
        </Card>
      </div>

      {/* ACTIVE FORM */}
      {activeForm === "consultation" && (
        <div className="mb-4">
          <ConsultationForm
            appointmentId={parseInt(appointmentId)}
            onSaved={handleFormSaved}
            onClose={() => setActiveForm(null)}
          />
        </div>
      )}

      {activeForm === "lab" && consultationId && (
        <div className="mb-4">
          <LabTestForm
            consultationId={consultationId}
            onSaved={handleFormSaved}
            onClose={() => setActiveForm(null)}
          />
        </div>
      )}

      {activeForm === "prescription" && consultationId && (
        <div className="mb-4">
          <PrescriptionForm
            consultationId={consultationId}
            doctorId={doctorId}
            onSaved={handleFormSaved}
            onClose={() => setActiveForm(null)}
          />
        </div>
      )}

      {/* BOTTOM — HISTORY */}
      <div style={{ height: "360px" }}>
        <HistoryPanel
          consultations={data.previous_consultations || []}
          prescriptions={data.previous_prescriptions || []}
          labResults={data.lab_results || []}
        />
      </div>
    </div>
  );
};

export default ConsultationPage;
