

// import React, { useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { MdPerson, MdLock } from "react-icons/md";

// const Login = () => {
//   const { login } = useAuth();

//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await login(formData);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200 font-poppins">

//       {/* Card */}
//       <div className="bg-white p-10 rounded-2xl shadow-2xl w-[360px]">
        
//         {/* Logo */}
//         <div className="flex flex-col items-center mb-6">
//           <img
//             src="https://img.icons8.com/ios-filled/80/1B4360/hospital-room.png"
//             alt="MediCare+ Logo"
//             className="w-16 h-16 mb-2"
//           />
//           <h1 className="text-2xl font-extrabold text-[#1B4360]">MediCare+</h1>
//           <p className="text-sm text-[#D4AF37] uppercase tracking-widest">
//             Hospital & Research
//           </p>
//         </div>

//         {/* Title */}
//         <h2 className="text-xl font-bold text-center mb-6 text-blue-600">
//           Login to Your Account
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">

//           {/* Username */}
//           <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
//             <MdPerson className="text-gray-400 mr-2 text-xl" />
//             <input
//               type="text"
//               name="username"
//               placeholder="Enter Username"
//               value={formData.username}
//               onChange={handleChange}
//               className="w-full outline-none p-2"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="flex items-center border rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
//             <MdLock className="text-gray-400 mr-2 text-xl" />
//             <input
//               type="password"
//               name="password"
//               placeholder="Enter Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full outline-none p-2"
//               required
//             />
//           </div>

//           {/* Forgot Password */}
//           <div className="text-right mb-2">
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot Password?
//             </a>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             className="bg-[#D4AF37] text-[#1B4360] py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
//           >
//             Login
//           </button>
//         </form>

//         {/* Signup Link */}
//         <p className="text-center text-sm text-gray-500 mt-4">
//           Don't have an account?{" "}
//           <a href="#" className="text-blue-600 hover:underline">
//             Sign Up
//           </a>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Login;



import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { MdPerson, MdLock } from "react-icons/md";

const Login = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg')",
      }}
    >
      {/* Soft premium overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1B4360]/85 via-black/70 to-[#1B4360]/90"></div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://img.icons8.com/ios-filled/80/1B4360/hospital-room.png"
            alt="Logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-extrabold text-[#1B4360]">
            MediCare+
          </h1>
          <p className="text-sm text-[#D4AF37] tracking-widest">
            Hospital & Research
          </p>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-center mb-6 text-[#1B4360]">
          Login to Your Account
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Username */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#D4AF37] transition">
            <MdPerson className="text-gray-400 text-xl mr-2" />
            <input
              type="text"
              name="username"
              placeholder="Enter Username"
              value={formData.username}
              onChange={handleChange}
              className="w-full outline-none p-2"
              required
            />
          </div>

          {/* Password */}
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#D4AF37] transition">
            <MdLock className="text-gray-400 text-xl mr-2" />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full outline-none p-2"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <a href="#" className="text-sm text-[#1B4360] hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="bg-[#D4AF37] text-[#1B4360] py-3 rounded-lg font-semibold hover:bg-yellow-400 transition shadow-md"
          >
            Login
          </button>

        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-6">
          © {new Date().getFullYear()} Hospital Management System
        </p>

      </div>
    </div>
  );
};

export default Login;