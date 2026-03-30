import React, { useState } from "react";

const ConsultationForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    symptoms: "",
    diagnosis: "",
    vitals: "",
    advice: ""
  });

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="p-4 flex flex-col gap-3">

      <h3 className="text-lg font-semibold">
        Add Consultation
      </h3>

      <textarea
        placeholder="Symptoms"
        className="bg-gray-700 p-2 rounded"
        onChange={(e) => handleChange("symptoms", e.target.value)}
      />

      <textarea
        placeholder="Diagnosis"
        className="bg-gray-700 p-2 rounded"
        onChange={(e) => handleChange("diagnosis", e.target.value)}
      />

      <textarea
        placeholder="Vitals"
        className="bg-gray-700 p-2 rounded"
        onChange={(e) => handleChange("vitals", e.target.value)}
      />

      <textarea
        placeholder="Advice"
        className="bg-gray-700 p-2 rounded"
        onChange={(e) => handleChange("advice", e.target.value)}
      />

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