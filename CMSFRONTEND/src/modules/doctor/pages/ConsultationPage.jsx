import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getConsultationPage,
  createConsultation,
  createLabTestRequest,
  createPrescription,
  getMedicines,
  getLabTests,
  getLabResults,
  markLabResultsViewed,
} from "../api/doctorApi";
import API from "../../../api";

// ─── CARD COMPONENTS ─────────────────────────────────────────────
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

// ─── CURRENT CONSULTATION CARD ────────────────────────────────────
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
        Object.entries(data).forEach(([k, v]) => { se[k] = Array.isArray(v) ? v[0] : String(v); });
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
        {errors.non_field_errors && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{errors.non_field_errors}</div>
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
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}
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
const LabTestForm = ({ consultationId, doctorId, onSaved, onClose }) => {
  const [availableTests, setAvailableTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [selected, setSelected] = useState([]);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getLabTests()
      .then((data) => setAvailableTests(data))
      .catch(() => setError("Failed to load lab tests."))
      .finally(() => setTestsLoading(false));
  }, []);

  const toggleTest = (testId) => {
    setSelected((prev) =>
      prev.includes(testId) ? prev.filter((id) => id !== testId) : [...prev, testId]
    );
    setError("");
  };

  const handleSubmit = async () => {
    if (selected.length === 0) { setError("Select at least one lab test."); return; }
    setLoading(true);
    try {
      await createLabTestRequest({
        consultation: consultationId,
        doctor: doctorId,
        notes: notes.trim(),
        tests: selected.map((id) => ({ lab_test: id })),
      });
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.non_field_errors
        ? (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors)
        : data?.detail || JSON.stringify(data) || "Failed to submit lab request.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title="Request Lab Tests" subtitle="Select tests from the list below" />
      <div className="p-5 space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {testsLoading ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 w-28 bg-[#1e2d4a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : availableTests.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No lab tests available in the system.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTests.map((test) => {
              const isSelected = selected.includes(test.test_id);
              return (
                <button
                  key={test.test_id}
                  type="button"
                  onClick={() => toggleTest(test.test_id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? "bg-purple-500 border-purple-400 text-white"
                      : "bg-[#060d1a] border-[#1e2d4a] text-gray-300 hover:border-purple-400/60 hover:text-purple-300"
                  }`}
                >
                  {test.test_name}
                  {isSelected && " ✓"}
                </button>
              );
            })}
          </div>
        )}

        {selected.length > 0 && (
          <p className="text-xs text-purple-400">
            {selected.length} test{selected.length > 1 ? "s" : ""} selected:{" "}
            {selected.map((id) => availableTests.find((t) => t.test_id === id)?.test_name).join(", ")}
          </p>
        )}

        <div>
          <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional notes for the lab…"
            className="w-full bg-[#060d1a] border border-[#1e2d4a] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-400 transition resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading || testsLoading}
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
  const [medicines, setMedicines] = useState([]);
  const [medsLoading, setMedsLoading] = useState(true);
  const [items, setItems] = useState([{ medicine_name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState([]);

  useEffect(() => {
    getMedicines()
      .then((data) => setMedicines(data))
      .catch(() => setError("Failed to load medicines."))
      .finally(() => setMedsLoading(false));
  }, []);

  const addItem = () => setItems([...items, { medicine_name: "", dosage: "", frequency: "", duration: "", instructions: "" }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, field, value) => {
    const copy = [...items];
    copy[i][field] = value;
    setItems(copy);
    setError("");
    setFieldErrors([]);
  };

  const handleSubmit = async () => {
    const errs = items.map((it) => ({
      medicine_name: !it.medicine_name ? "Required" : "",
      dosage: !it.dosage.trim() ? "Required" : "",
      frequency: !it.frequency.trim() ? "Required" : "",
      duration: !it.duration ? "Required" : isNaN(Number(it.duration)) || Number(it.duration) <= 0 ? "Must be a positive number" : "",
    }));
    const hasErrors = errs.some((e) => Object.values(e).some(Boolean));
    if (hasErrors) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      await createPrescription({
        consultation: consultationId,
        doctor: doctorId,
        items: items.map((it) => ({
          medicine_name: Number(it.medicine_name),
          dosage: it.dosage,
          frequency: it.frequency,
          duration: Number(it.duration),
          instructions: it.instructions,
        })),
      });
      onSaved();
    } catch (err) {
      const data = err?.response?.data;
      const msg = data?.non_field_errors
        ? (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors)
        : data?.detail || JSON.stringify(data) || "Failed to create prescription.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (err) => `w-full bg-[#060d1a] border ${err ? "border-red-500" : "border-[#1e2d4a]"} rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-green-400 transition`;

  return (
    <Card>
      <CardHeader title="Write Prescription" subtitle="Add medicines and dosages" />
      <div className="p-5 space-y-4">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>}

        {items.map((item, i) => {
          const errs = fieldErrors[i] || {};
          return (
            <div key={i} className="border border-[#1e2d4a] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-400 font-medium">Medicine #{i + 1}</p>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(i)} className="text-xs text-red-400 hover:text-red-300">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Medicine *</label>
                  <select value={item.medicine_name} onChange={(e) => updateItem(i, "medicine_name", e.target.value)} className={inputCls(errs.medicine_name)}>
                    <option value="">-- Select --</option>
                    {medicines.map((m) => <option key={m.medicine_id} value={m.medicine_id}>{m.medicine_name}</option>)}
                  </select>
                  {errs.medicine_name && <p className="text-red-400 text-xs mt-1">{errs.medicine_name}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Dosage *</label>
                  <input type="text" value={item.dosage} onChange={(e) => updateItem(i, "dosage", e.target.value)} placeholder="e.g., 500mg" className={inputCls(errs.dosage)} />
                  {errs.dosage && <p className="text-red-400 text-xs mt-1">{errs.dosage}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Frequency *</label>
                  <input type="text" value={item.frequency} onChange={(e) => updateItem(i, "frequency", e.target.value)} placeholder="e.g., Twice daily" className={inputCls(errs.frequency)} />
                  {errs.frequency && <p className="text-red-400 text-xs mt-1">{errs.frequency}</p>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Duration (days) *</label>
                  <input type="number" value={item.duration} onChange={(e) => updateItem(i, "duration", e.target.value)} placeholder="7" className={inputCls(errs.duration)} />
                  {errs.duration && <p className="text-red-400 text-xs mt-1">{errs.duration}</p>}
                </div>
                <div className="col-span-full">
                  <label className="text-xs text-gray-400 mb-1 block">Instructions</label>
                  <textarea rows={2} value={item.instructions} onChange={(e) => updateItem(i, "instructions", e.target.value)} placeholder="After meals, with water…" className={inputCls()} />
                </div>
              </div>
            </div>
          );
        })}

        <button type="button" onClick={addItem} className="w-full py-2 text-sm text-green-400 border border-green-400/40 rounded-lg hover:bg-green-400/10 transition">
          + Add Another Medicine
        </button>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-5 py-2 text-sm text-gray-400 hover:text-white border border-[#1e2d4a] rounded-lg transition">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={loading || medsLoading}
            className="px-5 py-2 text-sm font-semibold bg-green-500 hover:bg-green-400 text-white rounded-lg transition disabled:opacity-50 flex items-center gap-2">
            {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Sending…" : "Send to Pharmacy"}
          </button>
        </div>
      </div>
    </Card>
  );
};

// ─── LAB RESULTS PANEL ────────────────────────────────────────────
const LabResultsPanel = ({ consultationId, labRequestId, labResultsViewed, onClose, onMarkedViewed }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(false);
  const [viewed, setViewed] = useState(labResultsViewed);

  useEffect(() => {
    if (!consultationId) return;
    getLabResults(consultationId)
      .then((data) => setResults(data.results || []))
      .catch(() => setError("Failed to load lab results."))
      .finally(() => setLoading(false));
  }, [consultationId]);

  const handleMarkViewed = async () => {
    if (!labRequestId) return;
    setMarking(true);
    try {
      await markLabResultsViewed(labRequestId);
      setViewed(true);
      onMarkedViewed();
    } catch (err) {
      setError("Failed to mark results as viewed.");
    } finally {
      setMarking(false);
    }
  };

  return (
    <Card>
      <div className="px-5 py-4 border-b border-[#1e2d4a] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Lab Results</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {results.length} result{results.length !== 1 ? "s" : ""} returned from lab
          </p>
        </div>
        <button type="button" onClick={onClose} className="text-gray-500 hover:text-white text-sm">✕</button>
      </div>
      <div className="p-5 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">{error}</div>
        ) : results.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No results available yet.</p>
        ) : (
          <>
            <div className="space-y-3">
              {results.map((result, i) => (
                <div key={i} className={`border rounded-lg p-4 ${result.is_critical ? "border-red-400/40 bg-red-500/5" : "border-[#1e2d4a] bg-[#060d1a]"}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-semibold text-purple-300">🧪 {result.test_name}</p>
                    {result.is_critical && (
                      <span className="text-xs bg-red-400/20 text-red-400 border border-red-400/40 px-2 py-0.5 rounded-full font-medium">
                        ⚠ Critical
                      </span>
                    )}
                  </div>
                  <p className="text-lg font-bold text-cyan-400 mb-1">{result.result_value}</p>
                  {result.remarks && (
                    <p className="text-xs text-gray-400 mb-1">
                      <span className="text-gray-500">Remarks:</span> {result.remarks}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    {result.created_at ? new Date(result.created_at).toLocaleDateString("en-IN") : ""}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#1e2d4a]">
              <div className="flex flex-col gap-2">
                {viewed ? (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-400/5 border border-green-400/20 text-green-400 text-xs">
                    <span className="text-lg">✅</span>
                    <span>Results marked as reviewed</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleMarkViewed}
                    disabled={marking}
                    className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-300 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                  >
                    {marking && <span className="w-3.5 h-3.5 border-2 border-cyan-300/30 border-t-cyan-300 rounded-full animate-spin" />}
                    {marking ? "Marking…" : "✔ Mark as Viewed"}
                  </button>
                )}
                <p className="text-xs text-gray-500">
                  {viewed
                    ? "You can now write a prescription for this patient."
                    : "Acknowledge that you have reviewed all lab results."}
                </p>
              </div>
            </div>
          </>
        )}
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
          { key: "labs", label: `Labs (${labResults.length})`, hasNew: labResults.length > 0 },
        ].map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex-1 px-4 py-3 text-xs font-medium transition-all ${
              tab === t.key ? "text-blue-400 border-b-2 border-blue-400" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t.label}
            {t.hasNew && tab !== t.key && (
              <span className="ml-1.5 w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            )}
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
                    rx.status === "Sent" ? "text-blue-400 bg-blue-400/10" : "text-gray-400 bg-gray-400/10"
                  }`}>{rx.status}</span>
                </div>
                {(rx.items || []).map((item, j) => (
                  <p key={j} className="text-xs text-gray-400">
                    • {item.medicine_display || item.medicine_name} — {item.dosage} {item.frequency} for {item.duration} days
                  </p>
                ))}
              </div>
            ))
          ))}
        {tab === "labs" &&
          (labResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">No lab results available yet.</p>
              <p className="text-gray-700 text-xs mt-1">Results will appear here once the lab technician enters them.</p>
            </div>
          ) : (
            labResults.map((lr, i) => (
              <div key={i} className={`bg-[#060d1a] rounded-lg p-3 border ${lr.is_critical ? "border-red-400/30" : "border-[#1e2d4a]"}`}>
                {lr.test_name && <p className="text-xs font-semibold text-purple-300 mb-1">🧪 {lr.test_name}</p>}
                <p className="text-sm font-bold text-cyan-400">{lr.result_value || "—"}</p>
                {lr.is_critical && <span className="text-xs bg-red-400/10 text-red-400 border border-red-400/20 px-2 py-0.5 rounded mt-1 inline-block">⚠ Critical</span>}
                {lr.remarks && <p className="text-xs text-gray-400 mt-1"><span className="text-gray-500">Remarks:</span> {lr.remarks}</p>}
                <p className="text-xs text-gray-500 mt-1">{lr.created_at ? new Date(lr.created_at).toLocaleDateString("en-IN") : ""}</p>
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
  const [activeForm, setActiveForm] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");
  const [completeSuccess, setCompleteSuccess] = useState(false);
  const [localLabViewed, setLocalLabViewed] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getConsultationPage(appointmentId);
      setData(res.data);
      setLocalLabViewed(res.data?.lab_results_viewed || false);
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

  const handleCompleteConsultation = async () => {
    setCompleting(true);
    setCompleteError("");
    try {
      await API.patch(`/api/doctor/consultation/${appointmentId}/complete/`);
      setCompleteSuccess(true);
      fetchData();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        "Failed to complete consultation.";
      setCompleteError(msg);
    } finally {
      setCompleting(false);
    }
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
  const labResults = data.lab_results || [];
  const hasLabResults = labResults.length > 0;
  const hasCriticalResult = labResults.some((r) => r.is_critical);
  const labRequestId = data.lab_request_id;
  const labResultsViewed = localLabViewed || data.lab_results_viewed || false;
  const isCompleted = data.appointment?.status === "Completed";

  // ✅ NEW: Check if any lab request exists for this consultation
  const labRequests = data.lab_requests || [];
  const hasLabRequest = labRequests.length > 0;
  const hasAnyPendingLabRequest = labRequests.some(req => req.status === "Pending");

  // Detect if a prescription has been written for this consultation.
  // The backend exposes previous_prescriptions scoped to the patient;
  // we also check a potential flag from the consultation itself.
  const hasPrescription =
    data.current_consultation?.has_prescription ||
    (data.previous_prescriptions || []).some(
      (rx) => rx.consultation === consultationId || rx.consultation_id === consultationId
    );

  return (
    <div className="min-h-screen bg-[#060d1a] p-4 md:p-6">
      {/* Back + header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          type="button"
          onClick={() => navigate("/doctor/dashboard")}
          className="text-gray-500 hover:text-white transition text-sm flex items-center gap-1"
        >
          ← Dashboard
        </button>
        <span className="text-gray-600">/</span>
        <span className="text-gray-300 text-sm">
          Consultation — Token #{data.appointment?.token_number}
        </span>
        {isCompleted && (
          <span className="ml-2 text-xs bg-green-400/10 text-green-400 border border-green-400/30 px-2 py-0.5 rounded-full font-medium">
            ✓ Completed
          </span>
        )}
      </div>

      {/* COMPLETE SUCCESS BANNER */}
      {completeSuccess && (
        <div className="mb-4 flex items-center gap-3 px-5 py-3.5 rounded-xl border bg-green-500/10 border-green-400/40 text-green-300">
          <span className="text-xl">✅</span>
          <p className="text-sm font-semibold">Consultation marked as Completed successfully.</p>
        </div>
      )}

      {/* COMPLETE ERROR */}
      {completeError && (
        <div className="mb-4 px-5 py-3 rounded-xl border bg-red-500/10 border-red-400/40 text-red-300 text-sm">
          {completeError}
        </div>
      )}

      {/* LAB RESULTS READY BANNER */}
      {hasLabResults && (
        <div className={`mb-4 flex items-center justify-between gap-4 px-5 py-3.5 rounded-xl border ${
          hasCriticalResult
            ? "bg-red-500/10 border-red-400/40 text-red-300"
            : "bg-cyan-500/10 border-cyan-400/40 text-cyan-300"
        }`}>
          <div className="flex items-center gap-3">
            <span className="text-xl">{hasCriticalResult ? "⚠️" : "✅"}</span>
            <div>
              <p className="text-sm font-semibold">
                {hasCriticalResult ? "Critical Lab Results Available" : "Lab Results Ready"}
              </p>
              <p className="text-xs opacity-70 mt-0.5">
                {labResults.length} result{labResults.length !== 1 ? "s" : ""} returned from the lab
                {hasCriticalResult ? " — one or more are marked critical" : ""}
                {labResultsViewed ? " · Reviewed ✓" : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveForm(activeForm === "labResults" ? null : "labResults")}
            className={`flex-shrink-0 text-xs font-semibold px-4 py-2 rounded-lg border transition ${
              hasCriticalResult
                ? "bg-red-400/20 border-red-400/50 hover:bg-red-400/30 text-red-300"
                : "bg-cyan-400/20 border-cyan-400/50 hover:bg-cyan-400/30 text-cyan-300"
            }`}
          >
            {activeForm === "labResults" ? "Hide Results" : "View Results →"}
          </button>
        </div>
      )}

      {/* TOP SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4" style={{ minHeight: "340px" }}>
        <PatientInfoCard patient={data.patient} appointment={data.appointment} />
        <CurrentConsultationCard consultation={data.current_consultation} />

        {/* Action Buttons */}
        <Card className="flex flex-col">
          <CardHeader title="Actions" />
          <div className="p-5 flex flex-col gap-3 flex-1">
            {/* Add Consultation */}
            <button
              type="button"
              onClick={() => setActiveForm(activeForm === "consultation" ? null : "consultation")}
              disabled={hasConsultation || isCompleted}
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

            {/* Request Lab Tests */}
            <button
              type="button"
              onClick={() => setActiveForm(activeForm === "lab" ? null : "lab")}
              disabled={!hasConsultation || isCompleted || hasLabRequest}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                !hasConsultation || hasLabRequest
                  ? "opacity-40 cursor-not-allowed border-[#1e2d4a] text-gray-500"
                  : activeForm === "lab"
                  ? "bg-purple-500/20 border-purple-400 text-purple-300"
                  : "border-purple-400/40 text-purple-400 hover:bg-purple-400/10"
              }`}
            >
              <span className="text-lg">🔬</span>
              <div className="text-left">
                <p>{hasLabRequest ? "Lab Request Sent ✓" : "Request Lab Tests"}</p>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  {!hasConsultation 
                    ? "Add consultation first" 
                    : hasLabRequest 
                    ? "Request already submitted" 
                    : "Send to lab technician"}
                </p>
              </div>
            </button>

            {/* View Lab Results */}
            {hasLabResults && (
              <button
                type="button"
                onClick={() => setActiveForm(activeForm === "labResults" ? null : "labResults")}
                className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                  hasCriticalResult
                    ? activeForm === "labResults"
                      ? "bg-red-500/20 border-red-400 text-red-300"
                      : "border-red-400/40 text-red-400 hover:bg-red-400/10 animate-pulse"
                    : labResultsViewed
                    ? activeForm === "labResults"
                      ? "bg-green-500/20 border-green-400 text-green-300"
                      : "border-green-400/40 text-green-400 hover:bg-green-400/10"
                    : activeForm === "labResults"
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "border-cyan-400/40 text-cyan-400 hover:bg-cyan-400/10"
                }`}
              >
                <span className="text-lg">{labResultsViewed ? "✅" : hasCriticalResult ? "⚠️" : "📊"}</span>
                <div className="text-left">
                  <p>
                    {activeForm === "labResults" ? "Hide Lab Results" : "View Lab Results"}
                    {!labResultsViewed && (
                      <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        hasCriticalResult ? "bg-red-400 text-white" : "bg-cyan-400 text-black"
                      }`}>{labResults.length}</span>
                    )}
                  </p>
                  <p className="text-xs font-normal text-gray-500 mt-0.5">
                    {labResultsViewed
                      ? "Results reviewed ✓"
                      : hasCriticalResult
                      ? "Critical result — review immediately"
                      : "Results ready from lab"}
                  </p>
                </div>
              </button>
            )}

            {/* Write Prescription */}
            <button
              type="button"
              onClick={() => setActiveForm(activeForm === "prescription" ? null : "prescription")}
              disabled={!hasConsultation || isCompleted || (hasLabResults && !labResultsViewed) || hasAnyPendingLabRequest}
              className={`w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition border ${
                !hasConsultation || (hasLabResults && !labResultsViewed) || hasAnyPendingLabRequest
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
                  {!hasConsultation
                    ? "Add consultation first"
                    : hasAnyPendingLabRequest
                    ? "Wait for lab results first"
                    : hasLabResults && !labResultsViewed
                    ? "View & acknowledge lab results first"
                    : "Send medicines to pharmacy"}
                </p>
              </div>
            </button>

            {/* ── COMPLETE CONSULTATION — only after prescription is written ── */}
            {hasConsultation && !isCompleted && (
              <div className="mt-auto pt-3 border-t border-[#1e2d4a]">
                {!hasPrescription ? (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-xl bg-yellow-400/5 border border-yellow-400/20 text-yellow-500 text-xs">
                    <span className="mt-0.5">⚠</span>
                    <span>Please write a prescription before completing this consultation.</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteConsultation}
                    disabled={completing}
                    className="w-full px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-3 transition border bg-emerald-500/20 border-emerald-400/60 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50"
                  >
                    {completing ? (
                      <span className="w-3.5 h-3.5 border-2 border-emerald-300/30 border-t-emerald-300 rounded-full animate-spin" />
                    ) : (
                      <span className="text-lg">🏁</span>
                    )}
                    <div className="text-left">
                      <p>{completing ? "Completing…" : "Complete Consultation"}</p>
                      <p className="text-xs font-normal text-emerald-400/70 mt-0.5">Mark this appointment as done</p>
                    </div>
                  </button>
                )}
              </div>
            )}

            {isCompleted && (
              <div className="mt-auto pt-3 border-t border-[#1e2d4a]">
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-400/5 border border-green-400/20 text-green-400 text-xs">
                  <span>✅</span>
                  <span>Consultation completed. No further actions needed.</span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ACTIVE FORMS */}
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
            doctorId={doctorId}
            onSaved={handleFormSaved}
            onClose={() => setActiveForm(null)}
          />
        </div>
      )}

      {activeForm === "labResults" && consultationId && (
        <div className="mb-4">
          <LabResultsPanel
            consultationId={consultationId}
            labRequestId={labRequestId}
            labResultsViewed={labResultsViewed}
            onClose={() => setActiveForm(null)}
            onMarkedViewed={() => setLocalLabViewed(true)}
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

      {/* HISTORY */}
      <div style={{ height: "360px" }}>
        <HistoryPanel
          consultations={data.previous_consultations || []}
          prescriptions={data.previous_prescriptions || []}
          labResults={labResults}
        />
      </div>
    </div>
  );
};

export default ConsultationPage;