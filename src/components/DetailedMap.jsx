import React from "react";
import { useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const DetailedMap = () => {
  const location = useLocation();
  const plant = location.state?.plant; // Get the plant data passed from ZoneWisePlantDetails.jsx
  const [selectedPlant, setSelectedPlant] = useState(null); // State for selected plant (image zoom)
  const BASE_URL = "http://localhost:5000";

  if (!plant) {
    return <div>Plant data not found</div>;
  }

  // Helper function to display "Yes" or "No" for boolean values
  const renderBoolean = (value) => (value ? "Yes" : "No");

  // Function to handle image click (zoom in)
  const handleImageClick = (plant) => {
    setSelectedPlant(plant); // Set the selected plant for modal display
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedPlant(null); // Close the modal by setting selectedPlant to null
  };

  return (
    <div style={{ display: "flex" }}>
      {/* Map Component */}
      <MapContainer
        center={[plant.latitude, plant.longitude]} // Center map on the plant's coordinates
        zoom={12}
        style={{ height: "100vh", width: "70%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Marker for the selected plant */}
        <Marker position={[plant.latitude, plant.longitude]}>
          <Popup>
            <div style={{ textAlign: "center" }}>
              <h4>{plant.plant_name}</h4>
              <img
                src={`http://localhost:5000${plant.plant_image}`} // Use the correct URL for the image
                alt={plant.plant_name}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => handleImageClick(plant)}
              />
              <p>
                <strong>Plant Number:</strong> {plant.plant_number}
              </p>
              <p>
                <strong>Zone:</strong> {plant.zone}
              </p>
              <p>
                <strong>Health Status:</strong> {plant.health_status}
              </p>
              <p>
                <strong>Planted On:</strong>{" "}
                {new Date(plant.planted_on).toLocaleDateString("en-GB")}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Plant Data Card */}
      <div
        style={{
          width: "40%",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 className="font-bold text-center text-xl mb-4 ">
          {plant.plant_name}
        </h3>
        <img
          src={`http://localhost:5000${plant.plant_image}`} // Use the correct URL for the image
          alt={plant.plant_name}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={() => handleImageClick(plant)}
          className="mb-4"
        />
        <p>
          <strong>Plant Number:</strong> {plant.plant_number}
        </p>
        <p>
          <strong>Zone:</strong> {plant.plant_zone}
        </p>
        <p>
          <strong>Health Status:</strong> {plant.health_status}
        </p>
        <p>
          <strong>Planted On:</strong>{" "}
          {new Date(plant.planted_on).toLocaleDateString("en-GB")}
        </p>
        <p>
          <strong>Latitude:</strong> {plant.latitude}
        </p>
        <p>
          <strong>Longitude:</strong> {plant.longitude}
        </p>
        <p>
          <strong>Height:</strong> {plant.height}
        </p>
        <p>
          <strong>Insects Present:</strong>{" "}
          {renderBoolean(plant.insects_present)}
        </p>
        <p>
          <strong>Water Logging:</strong> {renderBoolean(plant.water_logging)}
        </p>
        <p>
          <strong>Water Schedule:</strong> {renderBoolean(plant.water_schedule)}
        </p>
        <p>
          <strong>Soil Level Maintained:</strong>{" "}
          {renderBoolean(plant.soil_level_maintained)}
        </p>
        <p>
          <strong>Tree Burnt:</strong> {renderBoolean(plant.tree_brunt)}
        </p>
        <p>
          <strong>Unwanted Grass:</strong> {renderBoolean(plant.unwanted_grass)}
        </p>
      </div>
      {selectedPlant && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={closeModal} // Close modal when clicked outside
        >
          <div
            style={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <img
              src={`${BASE_URL}${selectedPlant.plant_image}`}
              alt={selectedPlant.plant_name}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: "5px",
                cursor: "zoom-out",
              }}
            />
            <h4 style={{ color: "white", marginTop: "10px" }}>
              {selectedPlant.plant_name}
            </h4>
            <button
              onClick={closeModal}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedMap;
