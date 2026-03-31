// import React, { createContext, useContext, useState } from "react";
// import { loginUser } from "../api/authApi";
// import { useNavigate } from "react-router-dom";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const navigate = useNavigate();

//   // ✅ Restore token from sessionStorage
//   const [token, setToken] = useState(() => {
//     return sessionStorage.getItem("access");
//   });

//   // ✅ Restore user from sessionStorage
//   const [user, setUser] = useState(() => {
//     const storedUser = sessionStorage.getItem("user");
//     return storedUser ? JSON.parse(storedUser) : null;
//   });

//   // 🔥 LOGIN FUNCTION
//   const login = async (credentials) => {
//     try {
//       const data = await loginUser(credentials);

//       const { access, refresh, user } = data;
//       const role = user.role;

//       console.log("LOGIN DATA:", data);
//       console.log("ROLE:", role);

//       // ✅ store in sessionStorage
//       sessionStorage.setItem("access", access);
//       sessionStorage.setItem("refresh", refresh);
//       sessionStorage.setItem("user", JSON.stringify(user));

//       setToken(access);
//       setUser(user);

//       // 🔥 role-based redirect
//       const roleRoutes = {
//         doctor: "/doctor/dashboard",
//         admin: "/admin/dashboard",
//         receptionist: "/reception/dashboard",
//         pharmacist: "/pharmacist/dashboard",
//         labtechnician: "/labtechnician/dashboard",
//       };

//       if (!roleRoutes[role]) {
//         console.error("Invalid role:", role);
//         return;
//       }

//       navigate(roleRoutes[role]);

//     } catch (error) {
//       console.error("LOGIN ERROR:", error);
//       alert(error || "Invalid credentials");
//     }
//   };

//   // 🔥 LOGOUT
//   const logout = () => {
//     sessionStorage.clear(); // ✅ clear everything

//     setToken(null);
//     setUser(null);

//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // custom hook
// export const useAuth = () => useContext(AuthContext);


import React, { createContext, useContext, useState } from "react";
import { loginUser } from "../api/authApi";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // ✅ Restore token from sessionStorage
  const [token, setToken] = useState(() => {
    return sessionStorage.getItem("access");
  });

  // ✅ Restore user from sessionStorage
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // 🔥 LOGIN FUNCTION
  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);

      const { access, refresh, user } = data;
      const role = user.role;

      console.log("LOGIN DATA:", data);
      console.log("ROLE:", role);

      // ✅ store in sessionStorage
      sessionStorage.setItem("access", access);
      sessionStorage.setItem("refresh", refresh);
      sessionStorage.setItem("user", JSON.stringify(user));

      setToken(access);
      setUser(user);

      // 🔥 role-based redirect
      const roleRoutes = {
        doctor: "/doctor/dashboard",
        admin: "/admin/dashboard",
        receptionist: "/reception/dashboard",
        pharmacist: "/pharmacist/dashboard",
        labtechnician: "/labtechnician/dashboard",
      };

      if (!roleRoutes[role]) {
        console.error("Invalid role:", role);
        return;
      }

      navigate(roleRoutes[role]);

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert(error || "Invalid credentials");
    }
  };

  // 🔥 LOGOUT
  const logout = () => {
    sessionStorage.clear(); // ✅ clear everything

    setToken(null);
    setUser(null);

    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook
export const useAuth = () => useContext(AuthContext);