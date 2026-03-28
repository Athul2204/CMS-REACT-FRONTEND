import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://127.0.0.1:8000/api/patients/",
          {
            headers: {
              Authorization: `Token ${token}`, // ✅ important
            },
          }
        );

        setPatients(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load patients");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Patients</h2>

      {/* Add Patient Button */}
      <button
        onClick={() => navigate("/receptionist/add-patient")}
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
      >
        + Add Patient
      </button>

      {/* Loading */}
      {loading && <p>Loading patients...</p>}

      {/* Empty State */}
      {!loading && patients.length === 0 && (
        <p>No patients found</p>
      )}

      {/* Patient List */}
      {!loading &&
        patients.map((p) => (
          <div
            key={p.patient_id}
            className="border p-3 mb-2 rounded shadow-sm"
          >
            <p className="font-semibold">
              {p.first_name} {p.last_name}
            </p>
            <p className="text-sm text-gray-600">
              {p.email} | {p.phone}
            </p>
          </div>
        ))}
    </div>
  );
};

export default PatientList;