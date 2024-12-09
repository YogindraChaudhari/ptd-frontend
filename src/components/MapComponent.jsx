import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon issues with Leaflet and Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const MapComponent = () => {
  const [plants, setPlants] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null); // State for selected plant (image zoom)
  const BASE_URL = "http://localhost:5000"; // Replace with your backend URL

  // Fetch plants data from the backend
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token provided");
        }
        const response = await axios.get(`${BASE_URL}/plants/get-map-plant`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token as Bearer token
          },
        });
        console.log("API Response:", response.data); // Log the data
        if (Array.isArray(response.data)) {
          setPlants(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
        }
      } catch (error) {
        console.error("Error fetching plants data:", error);
      }
    };

    fetchPlants();
  }, []);

  // Function to handle image click (zoom in)
  const handleImageClick = (plant) => {
    setSelectedPlant(plant); // Set the selected plant for modal display
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedPlant(null); // Close the modal by setting selectedPlant to null
  };

  return (
    <div>
      <MapContainer
        center={[19.1, 73.1]} // Default location (India)
        zoom={10}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render markers for each plant */}
        {plants &&
          Array.isArray(plants) &&
          plants.map((plant) => (
            <Marker key={plant.id} position={[plant.latitude, plant.longitude]}>
              <Popup>
                <div style={{ textAlign: "center" }}>
                  <h4 className="font-bold text-xl">{plant.plant_name}</h4>
                  <img
                    src={`${BASE_URL}${plant.plant_image}`}
                    alt={plant.plant_name}
                    style={{
                      // width: "100px",
                      // height: "100px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    className="w-full h-full mt-2"
                    onClick={() => handleImageClick(plant)} // Handle image click to zoom in
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
          ))}
      </MapContainer>

      {/* Modal for zoomed-in image */}
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

export default MapComponent;
