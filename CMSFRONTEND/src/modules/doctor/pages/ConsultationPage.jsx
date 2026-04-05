import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PatientInfoCard from "../components/consultationpage/PatientInfoCard";
import CurrentConsultation from "../components/consultationpage/CurrentConsultation";
import ActionPanel from "../components/consultationpage/ActionPanel";
import LabRequestsPanel from "../components/consultationpage/LabRequestsPanel";
import HistoryNavigation from "../components/consultationpage/HistoryNavigation";
import HistoryDetailsPanel from "../components/consultationpage/HistoryDetailsPanel";

import { getConsultationPage, getLabResultsByConsultation } from "../api/doctorapi";

// ─── Rainbow Wrapper ──────────────────────────────────────────────
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

// ─── Main Page ────────────────────────────────────────────────────
const ConsultationPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("consultations");

  const [labRequests, setLabRequests] = useState([]);
  const [previousLabResults, setPreviousLabResults] = useState([]);

  // ─── Fetch ──────────────────────────────────────────────────────
  const fetchConsultationData = async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true);

      const result = await getConsultationPage(appointmentId);
      setData(result.data);
      setLabRequests(result.data.lab_requests || []);

      if (result.data.current_consultation) {
        localStorage.setItem(
          "consultationId",
          result.data.current_consultation.id
        );
      }

      // Fetch previous lab results across all past consultations
      if (result.data.previous_consultations?.length > 0) {
        const promises = result.data.previous_consultations.map((c) =>
          getLabResultsByConsultation(c.id)
        );
        const responses = await Promise.all(promises);
        setPreviousLabResults(responses.flatMap((r) => r.results || []));
      } else {
        setPreviousLabResults([]);
      }
    } catch (err) {
      setError(err?.message || "Failed to load consultation data.");
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) fetchConsultationData();
  }, [appointmentId]);

  // ─── Poll while any lab request is still pending ─────────────────
  useEffect(() => {
    const hasPending = labRequests.some((req) => req.status === "Pending");
    if (!hasPending) return;

    const interval = setInterval(() => fetchConsultationData(true), 5000);
    return () => clearInterval(interval);
  }, [labRequests]);

  // ─── Derived state ───────────────────────────────────────────────
  const hasConsultation = !!data?.current_consultation;
  const hasPrescription = data?.appointment?.status === "Completed";
  const hasPendingLabs = labRequests.some((r) => r.status === "Pending");

  // ─── Guards ──────────────────────────────────────────────────────
  if (loading) return <div className="text-white p-5">Loading...</div>;
  if (error)   return <div className="text-red-400 p-5">{error}</div>;
  if (!data)   return <div className="text-white p-5">No data found</div>;

  // ─── Render ──────────────────────────────────────────────────────
  return (
    <div className="p-4 md:p-5 flex flex-col gap-4 md:gap-5 text-white min-h-screen bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.4fr_1.2fr] gap-4 md:gap-5 h-auto lg:h-[520px]">

        <RainbowCard className="h-full">
          <PatientInfoCard
            patient={data.patient}
            appointment={data.appointment}
          />
        </RainbowCard>

        <RainbowCard className="h-full">
          <CurrentConsultation consultation={data.current_consultation} />
        </RainbowCard>

        <div className="flex flex-col gap-4 md:gap-5 h-full">
          <RainbowCard>
            <ActionPanel
              hasConsultation={hasConsultation}
              hasLabRequests={labRequests.length > 0}
              hasPendingLabs={hasPendingLabs}
              hasPrescription={hasPrescription}
              onAddConsultation={() => {
                if (!hasConsultation)
                  navigate(`/doctor/consultation/create/${appointmentId}`);
              }}
              onLabRequest={() => {
                if (!hasConsultation) {
                  alert("Create consultation first");
                  return;
                }
                navigate(`/doctor/lab-request/${appointmentId}`);
              }}
              onPrescription={() => {
                if (hasPendingLabs) {
                  alert("Complete all lab requests first");
                  return;
                }
                navigate(`/doctor/prescription/${appointmentId}`);
              }}
            />
          </RainbowCard>

          <RainbowCard className="flex-1 min-h-0">
            <LabRequestsPanel labRequests={labRequests} />
          </RainbowCard>
        </div>

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-[0.8fr_2.2fr] gap-4 md:gap-5 h-auto lg:h-[350px]">

        <RainbowCard className="h-full">
          <HistoryNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </RainbowCard>

        <RainbowCard className="h-full overflow-y-auto">
          <HistoryDetailsPanel
            activeTab={activeTab}
            consultations={data.previous_consultations}
            prescriptions={data.previous_prescriptions}
            previousLabResults={previousLabResults}
          />
        </RainbowCard>

      </div>

    </div>
  );
};

export default ConsultationPage;