// import React from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import LabRequestForm from "../components/consultationpage/LabRequestForm";
// import { createLabRequest } from "../api/doctorApi";

// const CreateLabRequestPage = () => {
//   const navigate = useNavigate();
//   const { appointmentId } = useParams();

//   // ✅ consultation from localStorage
//   const consultationId = Number(localStorage.getItem("consultationId"));

//   // ✅ doctor_id from sessionStorage → user object
//   const userData = JSON.parse(sessionStorage.getItem("user"));
//   const doctorId = Number(userData?.doctor_id);

//   // 🔍 DEBUG
//   console.log("consultationId:", consultationId);
//   console.log("userData:", userData);
//   console.log("doctorId:", doctorId);

//   const handleSubmit = async (data) => {
//     try {
//       // 🔥 SAFETY CHECKS
//       if (!consultationId) {
//         alert("Consultation ID missing. Go back and try again.");
//         return;
//       }

//       if (!doctorId) {
//         alert("Doctor ID missing. Please login again.");
//         return;
//       }

//       const payload = {
//         consultation: consultationId,
//         doctor: doctorId,
//         ...data,
//       };

//       console.log("Final Payload:", payload);

//       await createLabRequest(payload);

//       // ✅ Removed old localStorage logic (new backend handles multiple lab requests)

//       alert("Lab Request Created ✅");

//       navigate(`/doctor/consultation/${appointmentId}`);
//     } catch (err) {
//       alert(err);
//     }
//   };

//   return (
//     <div className="min-h-screen p-5 bg-[#020617] text-white">
//       {/* 🔥 TITLE + BACK BUTTON */}
//       <div className="flex items-center justify-between mb-4">
//         <h1 className="text-xl md:text-2xl font-semibold">
//           Lab Request
//         </h1>

//         <button
//           onClick={() => navigate(-1)}
//           className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition"
//         >
//           ← Back
//         </button>
//       </div>

//       <LabRequestForm
//         onSubmit={handleSubmit}
//         onClose={() => navigate(-1)}
//       />
//     </div>
//   );
// };

// export default CreateLabRequestPage;


import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabRequestForm from "../components/consultationpage/LabRequestForm";
import { createLabRequest } from "../api/doctorApi";
import { useAuth } from "../../../context/AuthContext";

const CreateLabRequestPage = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { user } = useAuth();

  // ✅ consultation from localStorage
  const consultationId = Number(localStorage.getItem("consultationId"));

  // ✅ doctor_id from AuthContext (populated by /api/auth/me/)
  const doctorId = user?.doctor_id;

  const handleSubmit = async (data) => {
    try {
      // 🔥 SAFETY CHECKS
      if (!consultationId) {
        alert("Consultation ID missing. Go back and try again.");
        return;
      }

      if (!doctorId) {
        alert("Doctor ID missing. Please login again.");
        return;
      }

      const payload = {
        consultation: consultationId,
        doctor: doctorId,
        ...data,
      };

      console.log("Final Payload:", payload);

      await createLabRequest(payload);

      // ✅ Removed old localStorage logic (new backend handles multiple lab requests)

      alert("Lab Request Created ✅");

      navigate(`/doctor/consultation/${appointmentId}`);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="min-h-screen p-5 bg-[#020617] text-white">
      {/* 🔥 TITLE + BACK BUTTON */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-semibold">
          Lab Request
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 text-sm bg-white/10 hover:bg-white/20 rounded-md transition"
        >
          ← Back
        </button>
      </div>

      <LabRequestForm
        onSubmit={handleSubmit}
        onClose={() => navigate(-1)}
      />
    </div>
  );
};

export default CreateLabRequestPage;