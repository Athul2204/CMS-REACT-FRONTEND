import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ add this

const ReceptionDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-100">

        <h1 className="text-2xl font-bold mb-6">
          Reception Dashboard
        </h1>

        <div className="grid grid-cols-2 gap-4">

          <button
            onClick={() => navigate("/receptionist/patients")}
            className="bg-blue-500 text-white p-4 rounded shadow hover:bg-blue-600"
          >
            Manage Patients
          </button>

          <button
            onClick={() => navigate("/receptionist/availability")}
            className="bg-green-500 text-white p-4 rounded shadow hover:bg-green-600"
          >
            Doctor Availability
          </button>

          <button
            onClick={() => navigate("/receptionist/appointments")}
            className="bg-purple-500 text-white p-4 rounded shadow hover:bg-purple-600"
          >
            Book Appointment
          </button>

        </div>

      </div>
    </div>
  );
};

export default ReceptionDashboard;