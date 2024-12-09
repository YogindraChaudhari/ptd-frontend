import { Routes, Route, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";
import RegisterPlant from "./components/RegisterPlant";
import UpdatePlant from "./components/UpdatePlant";
import DeletePlant from "./components/DeletePlant";
import ZoneWisePlantDetails from "./components/ZoneWisePlantDetails";
import DetailedMap from "./components/DetailedMap";
import Navbar from "./components/Navbar"; // Import Navbar
import AllPlantDetails from "./components/AllPlantDetails";
import AttendancePage from "./components/AttendancePage";

function App() {
  const location = useLocation(); // Get the current location

  return (
    <div>
      {/* Conditionally render Navbar based on the current route */}
      {location.pathname !== "/login" && location.pathname !== "/register" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-plant"
          element={
            <PrivateRoute>
              <RegisterPlant />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-plant"
          element={
            <PrivateRoute>
              <UpdatePlant />
            </PrivateRoute>
          }
        />
        <Route
          path="/delete-plant"
          element={
            <PrivateRoute>
              <DeletePlant />
            </PrivateRoute>
          }
        />
        <Route
          path="/zone-wise-plant-details"
          element={
            <PrivateRoute>
              <ZoneWisePlantDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/detailed-map"
          element={
            <PrivateRoute>
              <DetailedMap />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-plant-details"
          element={
            <PrivateRoute>
              <AllPlantDetails />
            </PrivateRoute>
          }
        />
        <Route
          path="/attendance"
          element={
            <PrivateRoute>
              <AttendancePage />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
