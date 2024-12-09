import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";

const ZoneWisePlantDetails = () => {
  //   const [plantsData, setPlantsData] = useState([]);
  const [zoneData, setZoneData] = useState({}); // Store plants data grouped by zone
  const [loading, setLoading] = useState(true);
  const [selectedZone, setSelectedZone] = useState(null); // State to track the selected zone
  const navigate = useNavigate(); // Initialize navigate

  // Fetch plants data by zone
  useEffect(() => {
    const fetchPlantsData = async () => {
      try {
        // Retrieve the token from localStorage (or another storage method you're using)
        const token = localStorage.getItem("authToken");

        if (!token) {
          throw new Error("No token provided");
        }

        // Make the GET request with the token in the Authorization header
        const response = await axios.get(
          "http://localhost:5000/plants/zonewise",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Pass token as Bearer token
            },
          }
        );

        // Group plants by zone
        const groupedByZone = response.data.reduce((acc, plant) => {
          if (!acc[plant.plant_zone]) {
            acc[plant.plant_zone] = [];
          }
          acc[plant.plant_zone].push(plant);
          return acc;
        }, {});

        setZoneData(groupedByZone);
        setLoading(false);
      } catch (error) {
        toast.error("Error fetching plant data.");
        setLoading(false);
        console.error("Error fetching plant data:", error);
      }
    };

    fetchPlantsData();
  }, []);

  // Handle clicking a zone tile
  const handleZoneClick = (plant_zone) => {
    setSelectedZone(plant_zone);
  };

  // Handle click event to navigate to the detailed map page
  const handlePlantClick = (plant) => {
    navigate("/detailed-map", {
      state: { plant }, // Passing the specific plant data to the detailed map page
    });
  };

  // Handle edit action
  const handleEdit = (plant_zone, plantNumber) => {
    navigate(`/update-plant?zone=${plant_zone}&plantNumber=${plantNumber}`); // Navigate to the update page with zone and plantNumber as query params
  };

  const handleDelete = async (plantId, plant_zone, plant_number) => {
    try {
      //   console.log("Deleting plant with ID:", plantId, "and Zone:", zone);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No token provided");
      }

      const response = await axios.delete(
        `http://localhost:5000/plants/delete-zone-plant?plant_number=${encodeURIComponent(
          plant_number
        )}&zone=${plant_zone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Plant deleted successfully!");
        // Remove the deleted plant from the state
        setZoneData((prevZoneData) => {
          const updatedZoneData = { ...prevZoneData };
          updatedZoneData[plant_zone] = updatedZoneData[plant_zone].filter(
            (plant) => plant.plant_number !== plant_number
          );
          return updatedZoneData;
        });
      }
    } catch (error) {
      toast.error("Error deleting plant.");
      console.error("Error deleting plant:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="zonewise-plant-details max-w-7xl mx-auto p-4">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-indigo-800">
        Zonewise Plant Details
      </h2>

      {/* Zone buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-4">
        {Object.keys(zoneData).map((zone) => (
          <button
            key={zone}
            onClick={() => handleZoneClick(zone)}
            className="px-6 py-2 font-semibold text-white rounded-lg bg-indigo-600 hover:bg-indigo-800 active:scale-95 transition duration-300"
          >
            Zone {zone}
          </button>
        ))}
      </div>

      {/* Table for displaying plant details */}
      {selectedZone && (
        <div className="overflow-x-auto">
          <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 text-indigo-600">
            Plants in Zone {selectedZone}
          </h3>
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md text-center">
            <thead className="bg-indigo-100">
              <tr>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Plant No.
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Plant Name
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Ht.
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Planted
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Health
                </th>
                <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {zoneData[selectedZone].map((plant) => (
                <tr key={plant.id} className="border-b border-gray-200">
                  <td
                    className="py-2 px-4 text-sm sm:text-base text-gray-700 cursor-pointer underline"
                    onClick={() => handlePlantClick(plant)}
                  >
                    {plant.plant_number}
                  </td>
                  <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                    {plant.plant_name}
                  </td>
                  <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                    {plant.height} m
                  </td>
                  <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                    {new Date(plant.planted_on).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                    {plant.health_status}
                  </td>
                  <td className="py-2 px-4 text-sm sm:text-base text-gray-700 flex items-center gap-3">
                    <button
                      onClick={() =>
                        handleEdit(plant.plant_zone, plant.plant_number)
                      } // Pass the zone and plantNumber to handleEdit
                      className="text-green-500 hover:text-green-700 transition duration-300 active:scale-90"
                    >
                      <FaEdit size={20} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          plant.id,
                          plant.plant_zone,
                          plant.plant_number
                        )
                      } // Handle delete action
                      className="text-red-500 hover:text-red-700 transition duration-300 active:scale-90"
                    >
                      <FaTrashAlt size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setSelectedZone(null)}
            className="mt-4 px-4 py-2 font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 active:scale-90"
          >
            Back to Zones
          </button>
        </div>
      )}
    </div>
  );
};

export default ZoneWisePlantDetails;
