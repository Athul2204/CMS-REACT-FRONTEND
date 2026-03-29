import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // 🔹 handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[350px]">

        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Enter Username"
            value={formData.username}
            onChange={handleChange}
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {/* Login Button */}
          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;

