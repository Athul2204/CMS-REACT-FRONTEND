import { useEffect, useState } from "react";
import axios from "axios";

const DoctorAvailability = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "http://127.0.0.1:8000/api/availability/",
          {
            headers: {
              Authorization: `Token ${token}`, // ✅ important
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load availability ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Doctor Availability</h2>

      {/* Loading */}
      {loading && <p>Loading availability...</p>}

      {/* Empty State */}
      {!loading && data.length === 0 && (
        <p>No availability found</p>
      )}

      {/* Data */}
      {!loading &&
        data.map((item) => (
          <div
            key={item.availability_id}
            className="border p-3 mb-2 rounded shadow-sm"
          >
            <p className="font-semibold">
              Doctor: {item.doctor_name || item.doctor}
            </p>

            <p className="text-sm text-gray-600">
              Date: {item.available_date}
            </p>

            <p className="text-sm">
              Time: {item.start_time} - {item.end_time}
            </p>
          </div>
        ))}
    </div>
  );
};

export default DoctorAvailability;