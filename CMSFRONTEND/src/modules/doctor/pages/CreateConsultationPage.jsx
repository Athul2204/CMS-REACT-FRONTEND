import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConsultationForm from "../components/consultationpage/ConsultationForm";
import { createConsultation } from "../api/doctorApi";

const CreateConsultationPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();

  const handleSubmit = async (formData) => {
    try {
      const payload = {
        appointment: appointmentId,
        ...formData,
      };

      await createConsultation(payload);

      alert("Consultation Added ✅");

      // 🔥 go back
      navigate(`/doctor/consultation/${appointmentId}`);

    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a] p-5 text-white">
      
      {/* 🔥 TITLE + BACK BUTTON SAME LINE */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">
          Create Consultation
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition"
        >
          ← Back
        </button>
      </div>

      <ConsultationForm
        onSubmit={handleSubmit}
        onClose={() => navigate(-1)}
      />

    </div>
  );
};

export default CreateConsultationPage;