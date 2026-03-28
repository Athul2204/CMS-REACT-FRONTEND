import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPatient = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // ✅ Basic validation
    if (!form.first_name || !form.phone) {
      alert("First name and phone are required");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:8000/api/patients/",
        form,
        {
          headers: {
            Authorization: `Token ${token}`, // ✅ important
          },
        }
      );

      alert("Patient added successfully ✅");
      navigate("/receptionist/patients");

    } catch (err) {
      console.error(err);
      alert("Error adding patient ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Add Patient</h2>

      {/* Inputs */}
      <input
        name="first_name"
        placeholder="First Name"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        name="last_name"
        placeholder="Last Name"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <input
        type="date"
        name="date_of_birth"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />

      <select
        name="gender"
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>

      <textarea
        name="address"
        placeholder="Address"
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />

      {/* Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 w-full rounded"
      >
        {loading ? "Saving..." : "Save Patient"}
      </button>
    </div>
  );
};

export default AddPatient;