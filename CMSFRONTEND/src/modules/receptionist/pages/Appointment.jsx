import { useState, useEffect } from "react";
import axios from "axios";

const Appointment = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [form, setForm] = useState({
    patient: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    token_number: "",
    reason: ""
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/patients/")
      .then(res => setPatients(res.data));

    axios.get("http://127.0.0.1:8000/api/doctors/")
      .then(res => setDoctors(res.data));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post("http://127.0.0.1:8000/api/appointments/", form);
    alert("Appointment booked ✅");
  };

  return (
    <div className="p-6">
      <h2>Book Appointment</h2>

      {/* Patient */}
      <select name="patient" onChange={handleChange}>
        <option>Select Patient</option>
        {patients.map(p => (
          <option key={p.patient_id} value={p.patient_id}>
            {p.first_name}
          </option>
        ))}
      </select>

      {/* Doctor */}
      <select name="doctor" onChange={handleChange}>
        <option>Select Doctor</option>
        {doctors.map(d => (
          <option key={d.id} value={d.id}>
            {d.name}
          </option>
        ))}
      </select>

      <input type="date" name="appointment_date" onChange={handleChange} />
      <input type="time" name="appointment_time" onChange={handleChange} />
      <input name="token_number" placeholder="Token" onChange={handleChange} />
      <textarea name="reason" placeholder="Reason" onChange={handleChange} />

      <button onClick={handleSubmit}>Book</button>
    </div>
  );
};

export default Appointment;