// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const { auth } = useContext(AuthContext);
//   return auth ? children : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" />;
  }

  // Render the child component if authenticated
  return children;
};

export default PrivateRoute;
