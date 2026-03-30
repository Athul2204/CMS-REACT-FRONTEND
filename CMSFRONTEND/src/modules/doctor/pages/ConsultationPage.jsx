import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PatientInfoCard from "../components/consultationpage/PatientInfoCard";
import CurrentConsultation from "../components/consultationpage/CurrentConsultation";
import ActionPanel from "../components/consultationpage/ActionPanel";
import LabResultsPanel from "../components/consultationpage/LabResultsPanel";
import HistoryNavigation from "../components/consultationpage/HistoryNavigation";
import HistoryDetailsPanel from "../components/consultationpage/HistoryDetailsPanel";
import ConsultationForm from "../components/consultationpage/ConsultationForm";

import { getConsultationPage, createConsultation } from "../api/doctorapi";

// 🔥 Rainbow Wrapper
const RainbowCard = ({ children, className = "" }) => {
  return (
    <div className={`relative p-[2px] rounded-xl ${className}`}>
      <div
        className="absolute inset-0 rounded-xl blur-sm opacity-70"
        style={{
          background:
            "linear-gradient(45deg, red, orange, yellow, lime, cyan, blue, violet, red)",
        }}
      />
      <div className="relative rounded-xl bg-[#1e293b] h-full">
        {children}
      </div>
    </div>
  );
};

const ConsultationPage = () => {
  const { appointmentId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("consultations");

  const [showForm, setShowForm] = useState(false);

  // 🔥 FETCH FUNCTION
  const fetchConsultationData = async () => {
    try {
      setLoading(true);
      const result = await getConsultationPage(appointmentId);
      setData(result.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchConsultationData();
  }, [appointmentId]);

  // 🔥 NEW SUBMIT (FROM CHILD)
  const handleSubmit = async (formData) => {
    try {
      const payload = {
        appointment: data.appointment.appointment_id,
        ...formData
      };

      await createConsultation(payload);

      alert("Consultation Added ✅");

      setShowForm(false);
      fetchConsultationData();

    } catch (err) {
      alert(err);
    }
  };

  if (loading) return <div className="text-white p-5">Loading...</div>;
  if (error) return <div className="text-red-400 p-5">{error}</div>;
  if (!data) return <div className="text-white p-5">No data found</div>;

  return (
    <div className="p-4 md:p-5 flex flex-col gap-4 md:gap-5 text-white min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

      {/* 🔥 TOP */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.4fr_1.2fr] gap-4 md:gap-5 h-[520px]">

        <RainbowCard className="h-full">
          <PatientInfoCard
            patient={data.patient}
            appointment={data.appointment}
          />
        </RainbowCard>

        <RainbowCard className="h-full">
          <CurrentConsultation
            consultation={data.current_consultation}
          />
        </RainbowCard>

        <div className="flex flex-col gap-4 md:gap-5 h-full">

          <RainbowCard>
            <ActionPanel
              hasConsultation={!!data.current_consultation}
              labPending={false}
              onAddConsultation={() => {
                if (!data.current_consultation) {
                  setShowForm(true);
                }
              }}
              onLabRequest={() => console.log("Lab Request")}
              onPrescription={() => console.log("Prescription")}
            />
          </RainbowCard>

          <RainbowCard className="flex-1 min-h-0">
            <LabResultsPanel
              labResults={[]}
              labPending={true}
            />
          </RainbowCard>

        </div>
      </div>

      {/* 🔥 FORM (NEW COMPONENT) */}
      {showForm && (
        <RainbowCard>
          <ConsultationForm
            onSubmit={handleSubmit}
            onClose={() => setShowForm(false)}
          />
        </RainbowCard>
      )}

      {/* 🔥 BOTTOM */}
      <div className="grid grid-cols-1 md:grid-cols-[0.8fr_2.2fr] gap-4 md:gap-5 h-[350px]">

        <RainbowCard className="h-full">
          <HistoryNavigation
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </RainbowCard>

        <RainbowCard className="h-full overflow-y-auto">
          <HistoryDetailsPanel
            activeTab={activeTab}
            consultations={data.previous_consultations}
            prescriptions={data.previous_prescriptions}
            labResults={data.lab_results}
          />
        </RainbowCard>

      </div>

    </div>
  );
};

export default ConsultationPage;