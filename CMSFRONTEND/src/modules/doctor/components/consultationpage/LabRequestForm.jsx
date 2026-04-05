import React, { useState, useEffect } from "react";
import { getLabTests } from "../../api/doctorApi";

const LabRequestForm = ({ onSubmit, onClose }) => {
  const [notes, setNotes] = useState("");
  const [selectedTests, setSelectedTests] = useState([]);
  const [testOptions, setTestOptions] = useState([]);

  // 🔥 FETCH LAB TESTS FROM API
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const res = await getLabTests();

        const data = res.data || res;

        const formatted = data.map((test) => ({
          id: Number(test.test_id),   // ✅ ensure number
          name: test.test_name
        }));

        setTestOptions(formatted);

      } catch (err) {
        console.error("Error fetching lab tests:", err);
      }
    };

    fetchTests();
  }, []);

  const toggleTest = (id) => {
    if (selectedTests.includes(id)) {
      setSelectedTests(selectedTests.filter((t) => t !== id));
    } else {
      setSelectedTests([...selectedTests, id]);
    }
  };

  const handleSubmit = () => {
    if (selectedTests.length === 0) {
      alert("Select at least one test");
      return;
    }

    onSubmit({
      notes,
      tests: selectedTests.map((id) => ({
        lab_test: Number(id) // ✅ ensure number
      }))
    });
  };

  return (
    <div className="p-4 flex flex-col gap-3 text-white">

      <h2 className="text-lg font-semibold">Create Lab Request</h2>

      {/* 🔥 Tests */}
      <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto">

        {testOptions.length === 0 ? (
          <p className="text-gray-400">Loading tests...</p>
        ) : (
          testOptions.map((test) => (
            <label key={test.id} className="flex gap-2">
              <input
                type="checkbox"
                checked={selectedTests.includes(test.id)}
                onChange={() => toggleTest(test.id)}
              />
              {test.name}
            </label>
          ))
        )}

      </div>

      {/* Notes */}
      <div className="flex flex-col gap-1 mt-2">
        <label className="text-sm font-medium text-gray-300">Notes / Instructions</label>
        <textarea
          placeholder="Notes"
          className="bg-gray-700 p-2 rounded"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-cyan-500 py-2 rounded"
        >
          Submit
        </button>

        <button
          onClick={onClose}
          className="flex-1 bg-gray-500 py-2 rounded"
        >
          Cancel
        </button>
      </div>

    </div>
  );
};

export default LabRequestForm;