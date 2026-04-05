import React, { useEffect, useState } from "react";
import API from "../../../api";

const PrescriptionForm = ({ onSubmit, onClose }) => {
  const [medicinesList, setMedicinesList] = useState([]);
  const [items, setItems] = useState([
    {
      medicine_name: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);

  // 🔥 Fetch medicines from backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await API.get("/api/doctor/medicines/");
        setMedicinesList(res.data);
      } catch (err) {
        console.error("Failed to load medicines");
      }
    };

    fetchMedicines();
  }, []);

  // 🔥 Handle input change
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  // ➕ Add new row
  const addRow = () => {
    setItems([
      ...items,
      {
        medicine_name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ]);
  };

  // ❌ Remove row
  const removeRow = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  // 🚀 Submit
  const handleSubmit = () => {
    const valid = items.every(
      (item) =>
        item.medicine_name &&
        item.dosage &&
        item.frequency &&
        item.duration
    );

    if (!valid) {
      alert("Please fill all required fields");
      return;
    }

    // ✅ Ensure medicine IDs are numbers
    const formattedItems = items.map((item) => ({
      ...item,
      medicine_name: Number(item.medicine_name),
    }));

    onSubmit(formattedItems);
  };

  return (
    <div className="bg-[#1e293b] border border-white/10 rounded-xl p-5 text-white mt-4">

      <h2 className="text-lg font-semibold mb-4">💊 Create Prescription</h2>

      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-1 md:grid-cols-5 gap-2 bg-[#334155] p-3 rounded-lg"
          >
            <select
              className="bg-[#1e293b] p-2 rounded"
              value={item.medicine_name}
              onChange={(e) =>
                handleChange(index, "medicine_name", e.target.value)
              }
            >
              <option value="">Select Medicine</option>
              {medicinesList.map((med, idx) => {
                const medId = med.medicine_id || med.id;
                return (
                  <option key={medId || idx} value={medId}>
                    {med.name}
                  </option>
                );
              })}
            </select>

            <input
              type="text"
              placeholder="Dosage"
              className="bg-[#1e293b] p-2 rounded"
              value={item.dosage}
              onChange={(e) =>
                handleChange(index, "dosage", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Frequency"
              className="bg-[#1e293b] p-2 rounded"
              value={item.frequency}
              onChange={(e) =>
                handleChange(index, "frequency", e.target.value)
              }
            />

            <input
              type="number"
              placeholder="Days"
              className="bg-[#1e293b] p-2 rounded"
              value={item.duration}
              onChange={(e) =>
                handleChange(index, "duration", e.target.value)
              }
            />

            <input
              type="text"
              placeholder="Instructions"
              className="bg-[#1e293b] p-2 rounded"
              value={item.instructions}
              onChange={(e) =>
                handleChange(index, "instructions", e.target.value)
              }
            />

            <button
              onClick={() => removeRow(index)}
              className="text-red-400 text-sm col-span-full text-right"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={addRow}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Medicine
        </button>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="bg-gray-500 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;