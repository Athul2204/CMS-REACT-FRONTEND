import { useEffect, useState } from "react";
import { getDoctorAvailability } from "../api/receptionApi";

const DoctorAvailability = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState("");

  const fetchAvailability = async (date = "") => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDoctorAvailability(date || null);
      // Backend returns { count, data: [...] } or a plain array
      setData(Array.isArray(result) ? result : result.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load doctor availability. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const handleDateFilter = (e) => {
    const date = e.target.value;
    setFilterDate(date);
    fetchAvailability(date);
  };

  const handleClearFilter = () => {
    setFilterDate("");
    fetchAvailability();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Doctor Availability</h2>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600 font-medium">Filter by date:</label>
          <input
            type="date"
            value={filterDate}
            onChange={handleDateFilter}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {filterDate && (
            <button
              onClick={handleClearFilter}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-gray-500">
          <span className="mr-2">⏳</span> Loading availability...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {!loading && !error && data.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No availability records found</p>
          {filterDate && (
            <p className="text-sm mt-1">Try a different date or clear the filter.</p>
          )}
        </div>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">#</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Doctor</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">Start Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-600">End Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {data.map((item, idx) => (
                <tr key={item.availability_id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {item.doctor_name || `Doctor #${item.doctor}`}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.available_date}</td>
                  <td className="px-4 py-3 text-gray-700">{item.start_time}</td>
                  <td className="px-4 py-3 text-gray-700">{item.end_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;