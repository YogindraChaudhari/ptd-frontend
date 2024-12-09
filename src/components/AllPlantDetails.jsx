import React, { useState, useEffect } from "react";
import axios from "axios";

const AllPlantDetails = () => {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [zoneFilter, setZoneFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    // Fetch all plants data from your API
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No token provided");
        }
        const response = await axios.get(
          "http://localhost:5000/plants/get-map-plant",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched plants:", response.data); // Log response data
        setPlants(response.data);
        setFilteredPlants(response.data);
      } catch (error) {
        console.error("Unexpected error", error);
      }
    };

    fetchPlants();
  }, []);

  // Scroll listener for showing the "Back to Top" button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    // Attach the event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to handle filtering by zone
  const handleZoneFilter = (event) => {
    setZoneFilter(event.target.value);
  };

  // Function to handle sorting by plant number (numerically)
  const handleSort = () => {
    const sortedPlants = [...filteredPlants].sort((a, b) => {
      const plantA = parseInt(a.plant_number, 10);
      const plantB = parseInt(b.plant_number, 10);
      return sortOrder === "asc" ? plantA - plantB : plantB - plantA;
    });
    setFilteredPlants(sortedPlants);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Function to filter plants by zone
  const filterPlants = () => {
    const filtered = plants.filter((plant) =>
      plant.plant_zone
        .toString()
        .toLowerCase()
        .includes(zoneFilter.toLowerCase())
    );
    setFilteredPlants(filtered);
  };

  useEffect(() => {
    filterPlants();
  }, [zoneFilter, plants]);

  // Render function for boolean values (true/false)
  const renderBoolean = (value) => (value ? "Yes" : "No");

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-teal-800">
        All Plant Details
      </h2>
      {/* Filter Section */}
      <div className="mb-4 flex flex-col sm:flex-row items-center">
        <input
          type="text"
          placeholder="Filter by zone"
          value={zoneFilter}
          onChange={handleZoneFilter}
          className="border p-2 rounded-xl border-solid-2 border-gray-400 mr-2 mb-2 sm:mb-0"
        />
        <button
          onClick={handleSort}
          className="bg-green-500 text-white p-2 text-sm rounded-xl"
        >
          Sort by Plant Number (
          {sortOrder === "asc" ? "Ascending" : "Descending"})
        </button>
      </div>

      {/* Display Plant Data in Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlants.map((plant) => (
          <div
            key={plant.id} // Assuming 'id' is the primary key
            className="bg-green-50 p-4 rounded-3xl shadow-md"
          >
            <h3 className="font-bold text-center text-xl mb-4">
              {plant.plant_name}
            </h3>
            <img
              src={`http://localhost:5000${plant.plant_image}`} // Adjust this URL based on your API
              alt={plant.plant_name}
              className="w-full h-auto rounded-lg mb-4"
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
              <strong>Water Logging:</strong>{" "}
              {renderBoolean(plant.water_logging)}
            </p>
            <p>
              <strong>Water Schedule:</strong> {plant.water_schedule}{" "}
            </p>
            <p>
              <strong>Soil Level Maintained:</strong>{" "}
              {renderBoolean(plant.soil_level_maintained)}
            </p>
            <p>
              <strong>Tree Burnt:</strong> {renderBoolean(plant.tree_burnt)}
            </p>
            <p>
              <strong>Unwanted Grass:</strong>{" "}
              {renderBoolean(plant.unwanted_grass)}
            </p>
          </div>
        ))}
      </div>
      {/* Back to Top Button for Mobile View */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 p-4 font-bold bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg focus:outline-none md:hidden transition-all duration-300 ease-in-out hover:bg-green-600"
          style={{ zIndex: 1000 }}
        >
          ↑ Back To Top
        </button>
      )}
    </div>
  );
};

export default AllPlantDetails;
