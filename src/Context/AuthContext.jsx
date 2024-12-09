// import { createContext, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: localStorage.getItem("authToken") || null,
//     user: null, // Optionally store user data
//   });
//   const navigate = useNavigate();

//   const logout = () => {
//     setAuth(null);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// last working code:
// import { createContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [auth, setAuth] = useState({
//     token: localStorage.getItem("authToken") || null,
//     user: JSON.parse(localStorage.getItem("user")) || null,
//   });

//   const navigate = useNavigate();

//   // Logout function
//   const logout = () => {
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     setAuth({ token: null, user: null });
//     navigate("/login");
//   };

//   // Ensure `auth` syncs with `localStorage`
//   useEffect(() => {
//     if (auth.token) {
//       localStorage.setItem("authToken", auth.token);
//       localStorage.setItem("user", JSON.stringify(auth.user));
//     }
//   }, [auth]);

//   return (
//     <AuthContext.Provider value={{ auth, setAuth, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("authToken") || null,
    user: JSON.parse(localStorage.getItem("user")) || null, // User includes role
  });

  const navigate = useNavigate();

  // Logout function
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
    navigate("/login");
  };

  // Ensure `auth` syncs with `localStorage`
  useEffect(() => {
    if (auth.token) {
      localStorage.setItem("authToken", auth.token);
      localStorage.setItem("user", JSON.stringify(auth.user));
    }
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
