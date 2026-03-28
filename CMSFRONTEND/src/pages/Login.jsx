import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://127.0.0.1:8000/api/login/",
      form
    );

    console.log("LOGIN RESPONSE:", res.data); // ✅ debug

    // ✅ Save token + role
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    const role = res.data.role?.toLowerCase(); // ✅ important

    // ✅ Role-based navigation (FIXED)
    if (role === "admin") navigate("/admin");
    else if (role === "doctor") navigate("/doctor");
    else if (role === "receptionist") navigate("/receptionist");
    else navigate("/");

  } catch (err) {
    console.error(err);
    alert("Invalid username or password");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-80">

        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="border p-2 w-full mb-4 rounded"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </div>

    </div>
  );
}