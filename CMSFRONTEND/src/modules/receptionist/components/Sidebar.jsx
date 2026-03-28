import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="w-60 h-screen bg-blue-600 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Reception</h2>

      <p className="cursor-pointer mb-3" onClick={() => navigate("/receptionist")}>
        Dashboard
      </p>

      <p className="cursor-pointer mb-3" onClick={() => navigate("/receptionist/patients")}>
        Patients
      </p>

      <p className="cursor-pointer mb-3" onClick={() => navigate("/receptionist/availability")}>
        Availability
      </p>

      <p className="cursor-pointer mb-3" onClick={() => navigate("/receptionist/appointments")}>
        Appointments
      </p>
    </div>
  );
};

export default Sidebar;