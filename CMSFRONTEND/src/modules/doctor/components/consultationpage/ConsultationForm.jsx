import React, { useState } from "react";
const ConsultationForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    advice: ""
  });

  // 🔥 Updated Vitals (BP single field)
  const [vitals, setVitals] = useState({
    bp: "",
    pulse: "",
    temperature: "",
    spo2: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  // 🔥 VALIDATION
  const validateForm = () => {
    const { symptoms, diagnosis } = formData;
    const { bp, pulse, temperature, spo2 } = vitals;
    const textOnlyRegex = /^[A-Za-z\s.,-]+$/;
    let newErrors = {};

    // ✅ Text validation
    if (!symptoms.trim() || symptoms.length < 5)
      newErrors.symptoms = "Symptoms must be at least 5 characters";
    else if (!textOnlyRegex.test(symptoms))
      newErrors.symptoms = "Symptoms should not contain numbers";

    if (!diagnosis.trim() || diagnosis.length < 3)
      newErrors.diagnosis = "Diagnosis must be at least 3 characters";
    else if (!textOnlyRegex.test(diagnosis))
      newErrors.diagnosis = "Diagnosis should not contain numbers";

    // 🔥 BP format validation (e.g., 120/80)
    if (!bp) {
      newErrors.bp = "BP is required";
    } else {
      const bpRegex = /^\d{2,3}\/\d{2,3}$/;
      if (!bpRegex.test(bp)) {
        newErrors.bp = "BP must be in format 120/80";
      } else {
        const [sys, dia] = bp.split("/").map(Number);
        if (sys < 70 || sys > 200) newErrors.bp = "Systolic BP must be between 70–200";
        else if (dia < 40 || dia > 120) newErrors.bp = "Diastolic BP must be between 40–120";
      }
    }

    // 🔥 Other vitals
    const pul = Number(pulse);
    const temp = Number(temperature);
    const sp = Number(spo2);

    if (!pul || pul < 40 || pul > 180)
      newErrors.pulse = "Pulse must be between 40–180 bpm";

    if (!temp || temp < 90 || temp > 110)
      newErrors.temperature = "Temperature must be between 90–110 °F";

    if (!sp || sp < 50 || sp > 100)
      newErrors.spo2 = "SpO2 must be between 50–100%";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    // 🔥 Final string
    const vitalsString = `BP: ${vitals.bp} mmHg | Pulse: ${vitals.pulse} bpm | Temperature: ${vitals.temperature} °F | SpO2: ${vitals.spo2}%`;

    onSubmit({
      ...formData,
      vitals: vitalsString
    });
  };

  return (
    <div className="p-4 flex flex-col gap-3">

      <h3 className="text-lg font-semibold">
        Add Consultation
      </h3>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Symptoms</label>
        <textarea
          placeholder="Symptoms"
          className="bg-gray-700 p-2 rounded"
          onChange={(e) => handleChange("symptoms", e.target.value)}
        />
        {errors.symptoms && <p className="text-red-500 text-xs">{errors.symptoms}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-300">Diagnosis</label>
        <textarea
          placeholder="Diagnosis"
          className="bg-gray-700 p-2 rounded"
          onChange={(e) => handleChange("diagnosis", e.target.value)}
        />
        {errors.diagnosis && <p className="text-red-500 text-xs">{errors.diagnosis}</p>}
      </div>

      {/* 🔥 VITALS */}
      <div className="bg-gray-800 p-3 rounded flex flex-col gap-3">

        <p className="text-sm font-semibold text-gray-300">
          Vitals
        </p>

        {/* BP */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">BP (mmHg)</label>
          <input
            type="text"
            placeholder="e.g. 120/80"
            className="bg-gray-700 p-2 rounded"
            value={vitals.bp}
            onChange={(e) => {
              setVitals({ ...vitals, bp: e.target.value });
              if (errors.bp) setErrors({ ...errors, bp: null });
            }}
          />
          {errors.bp && <p className="text-red-500 text-xs">{errors.bp}</p>}
        </div>

        {/* Pulse */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Pulse (bpm)</label>
          <input
            type="number"
            placeholder="Pulse"
            className="bg-gray-700 p-2 rounded"
            value={vitals.pulse}
            onChange={(e) => {
              setVitals({ ...vitals, pulse: e.target.value });
              if (errors.pulse) setErrors({ ...errors, pulse: null });
            }}
          />
          {errors.pulse && <p className="text-red-500 text-xs">{errors.pulse}</p>}
        </div>

        {/* Temperature */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Temperature (°F)</label>
          <input
            type="number"
            placeholder="Temperature"
            className="bg-gray-700 p-2 rounded"
            value={vitals.temperature}
            onChange={(e) => {
              setVitals({ ...vitals, temperature: e.target.value });
              if (errors.temperature) setErrors({ ...errors, temperature: null });
            }}
          />
          {errors.temperature && <p className="text-red-500 text-xs">{errors.temperature}</p>}
        </div>

        {/* SpO2 */}
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">SpO2 (%)</label>
          <input
            type="number"
            placeholder="SpO2"
            className="bg-gray-700 p-2 rounded"
            value={vitals.spo2}
            onChange={(e) => {
              setVitals({ ...vitals, spo2: e.target.value });
              if (errors.spo2) setErrors({ ...errors, spo2: null });
            }}
          />
          {errors.spo2 && <p className="text-red-500 text-xs">{errors.spo2}</p>}
        </div>

      </div>

      <div className="flex flex-col gap-1 mt-2">
        <label className="text-sm font-medium text-gray-300">Advice</label>
        <textarea
          placeholder="Advice"
          className="bg-gray-700 p-2 rounded"
          onChange={(e) => handleChange("advice", e.target.value)}
        />
      </div>

      <div className="flex gap-2 mt-2">

        <button
          onClick={handleSubmit}
          className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded font-medium"
        >
          Submit
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-gray-500 hover:bg-gray-600 py-2 rounded font-medium"
        >
          Cancel
        </button>

      </div>

    </div>
  );
};

export default ConsultationForm;