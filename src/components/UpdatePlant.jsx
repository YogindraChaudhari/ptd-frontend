import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdatePlant = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // const { zone, plantNumber } = location.state || {};
  // Get query params from URL
  const queryParams = new URLSearchParams(location.search);
  const plant_zone = queryParams.get("zone");
  const plantNumber = queryParams.get("plantNumber");
  const [searchParams, setSearchParams] = useState({
    // plant_zone: "",
    // plant_number: "",
    plant_zone: plant_zone || "",
    plant_number: plantNumber || "",
  });
  const [formData, setFormData] = useState(null);
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    zone: "",
    vibhaag: "",
  });
  const [plantImage, setPlantImage] = useState(null);

  useEffect(() => {
    toast.info("Please enter plant zone and number to fetch the plant data.");
  }, []);

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          toast.error("Please log in to continue.");
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:5000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          toast.error("Error fetching user info.");
        }
      }
    };
    fetchUserInfo();
  }, [navigate]);

  // Handle input changes for search parameters
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchPlantData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please log in to fetch plant data.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/plants/get-plant",
        {
          params: searchParams,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data) {
        // Format the `planted_on` field to `YYYY-MM-DD`
        const formattedData = {
          ...response.data,
          planted_on: response.data.planted_on
            ? new Date(response.data.planted_on).toISOString().split("T")[0]
            : "",
        };

        setFormData(formattedData);
        toast.success("Plant data fetched successfully.");
      } else {
        toast.error("No plant found with the provided details.");
      }
    } catch (error) {
      toast.error("Error fetching plant data.");
      console.error("Fetch error:", error);
    }
  };

  // Handle input changes for form data
  // const handleFormChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: type === "checkbox" ? checked : value,
  //   }));
  // };

  const handleFormChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "radio" ? value === "true" : value,
    }));
  };

  // Handle image upload
  const handleFileChange = (e) => {
    setPlantImage(e.target.files[0]);
  };

  // Fetch GPS location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          toast.success("Location fetched successfully.");
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  // Handle form submission
  // const handleUpdate = async (e) => {
  //   e.preventDefault();
  //   if (!formData) {
  //     toast.error("Please fetch plant data before updating.");
  //     return;
  //   }

  //   const data = new FormData();
  //   Object.keys(formData).forEach((key) => data.append(key, formData[key]));
  //   data.append("updated_by_full_name", userInfo.full_name);
  //   data.append("updated_by_zone", userInfo.zone);
  //   data.append("updated_by_vibhaag", userInfo.vibhaag);
  //   if (plantImage) data.append("plant_image", plantImage);

  //   try {
  //     const token = localStorage.getItem("authToken");
  //     if (!token) {
  //       toast.error("You need to be logged in to update the plant.");
  //       navigate("/login");
  //       return;
  //     }

  //     await axios.put(`http://localhost:5000/plants/update-plant`, data, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     toast.success("Plant updated successfully!");
  //     setFormData(null);
  //     setPlantImage(null);
  //   } catch (error) {
  //     toast.error("Error updating plant.");
  //     console.error("Update error:", error);
  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData) {
      toast.error("Please fetch plant data before updating.");
      return;
    }

    const healthFieldMap = {
      Good: [
        "fertilizers_applied",
        "soil_level_maintained",
        "compound_maintained",
      ],
      Infected: [
        "insects_present",
        "water_logging",
        "tree_burnt",
        "unwanted_grass",
      ],
      Deceased: [
        "tree_burnt",
        "water_logging",
        "insects_present",
        "fertilizers_applied",
      ],
    };

    const requiredFields = healthFieldMap[formData.health_status] || [];
    const isValid = requiredFields.some((field) => formData[field] === true);

    if (!isValid) {
      toast.error(
        `For health status "${
          formData.health_status
        }", at least one of the following fields must be "Yes": ${requiredFields
          .map((field) => field.replace(/_/g, " "))
          .join(", ")}.`
      );
      return;
    }

    const booleanFields = [
      "insects_present",
      "fertilizers_applied",
      "soil_level_maintained",
      "tree_burnt",
      "unwanted_grass",
      "water_logging",
      "compound_maintained",
    ];

    const processedFormData = { ...formData };
    booleanFields.forEach((field) => {
      processedFormData[field] = formData[field] === "true";
    });

    const data = new FormData();
    Object.keys(processedFormData).forEach((key) =>
      data.append(key, processedFormData[key])
    );
    data.append("updated_by_full_name", userInfo.full_name);
    data.append("updated_by_zone", userInfo.zone);
    data.append("updated_by_vibhaag", userInfo.vibhaag);
    if (plantImage) data.append("plant_image", plantImage);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to update the plant.");
        navigate("/login");
        return;
      }

      await axios.put("http://localhost:5000/plants/update-plant", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plant updated successfully!");

      setFormData(null);
      setPlantImage(null);
    } catch (error) {
      toast.error("Error updating plant.");
      console.error("Update error:", error);
    }
  };

  return (
    <div className="update-plant p-4 sm:p-6 lg:p-8">
      <ToastContainer />
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
        Update Plant
      </h2>

      <div className="space-y-4">
        <label className="block text-sm sm:text-base">
          Plant Zone
          <input
            type="number"
            name="plant_zone"
            placeholder="Plant Zone Number"
            value={searchParams.plant_zone}
            onChange={handleSearchChange}
            className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </label>

        <label className="block text-sm sm:text-base">
          Plant Number
          <input
            type="text"
            name="plant_number"
            placeholder="Enter Plant Number"
            value={searchParams.plant_number}
            onChange={handleSearchChange}
            className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            required
          />
        </label>

        <button
          onClick={fetchPlantData}
          className="w-full sm:w-auto mt-4 py-2 px-4 bg-yellow-500 text-white rounded-2xl shadow hover:bg-yellow-600 active:scale-95 transition duration-200"
        >
          Fetch Plant Data
        </button>
      </div>

      {formData && (
        <form onSubmit={handleUpdate} className="space-y-6 mt-8">
          {/* Plant Details */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Plant Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block text-sm sm:text-base">
                Plant Name
                <input
                  type="text"
                  name="plant_name"
                  placeholder="Enter Plant Name"
                  value={formData.plant_name}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Plant Number
                <input
                  type="text"
                  name="plant_number"
                  placeholder="Enter Plant Number"
                  value={formData.plant_number}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border bg-gray-100 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Plant Zone
                <input
                  type="number"
                  name="plant_zone"
                  placeholder="Plant Zone Number"
                  value={formData.plant_zone}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border bg-gray-100 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Height (meters)
                <input
                  type="number"
                  name="height"
                  placeholder="Enter Plant Height"
                  value={formData.height}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Planted On
                <input
                  type="date"
                  name="planted_on"
                  value={formData.planted_on}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block text-sm sm:text-base">
                Latitude
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
              <label className="block text-sm sm:text-base">
                Longitude
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </label>
            </div>
            <button
              type="button"
              onClick={fetchLocation}
              className="w-full sm:w-auto mt-4 py-2 px-4 bg-yellow-500 text-white rounded-2xl shadow hover:bg-yellow-600 transition active:scale-95 duration-200"
            >
              Fetch GPS Location
            </button>
          </div>

          {/* Health and Water Schedule */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Health and Water Schedule
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <label className="block text-sm sm:text-base">
                Health Status
                <select
                  name="health_status"
                  value={formData.health_status}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Good">Good</option>
                  <option value="Deceased">Deceased</option>
                  <option value="Infected">Infected</option>
                </select>
              </label>
              <label className="block text-sm sm:text-base">
                Water Schedule
                <select
                  name="water_schedule"
                  value={formData.water_schedule}
                  onChange={handleFormChange}
                  className="mt-2 p-3 border rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="Daily">Daily</option>
                  <option value="Alternate days">Alternate days</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </label>
            </div>
          </div>

          {/* Boolean Fields */}
          {/* <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "insects_present", label: "Insects Present" },
                { name: "fertilizers_applied", label: "Fertilizers Applied" },
                {
                  name: "soil_level_maintained",
                  label: "Soil Level Maintained",
                },
                { name: "tree_burnt", label: "Tree Burnt" },
                { name: "unwanted_grass", label: "Unwanted Grass" },
                { name: "water_logging", label: "Water Logging" },
                { name: "compound_maintained", label: "Compound Maintained" },
              ].map(({ name, label }) => (
                <label
                  key={name}
                  className="flex items-center text-sm sm:text-base"
                >
                  <input
                    type="checkbox"
                    name={name}
                    checked={formData[name]}
                    onChange={handleFormChange}
                    className="mr-2"
                  />
                  {label}
                </label>
              ))}
            </div>
          </div> */}

          {/* Boolean Fields */}
          {/* <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "insects_present", label: "Insects Present" },
                { name: "fertilizers_applied", label: "Fertilizers Applied" },
                {
                  name: "soil_level_maintained",
                  label: "Soil Level Maintained",
                },
                { name: "tree_burnt", label: "Tree Burnt" },
                { name: "unwanted_grass", label: "Unwanted Grass" },
                { name: "water_logging", label: "Water Logging" },
                { name: "compound_maintained", label: "Compound Maintained" },
              ].map(({ name, label }) => (
                <div key={name} className="flex flex-col">
                  <span className="text-sm sm:text-base mb-2">{label}</span>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={name}
                        value="true"
                        checked={formData[name] === true}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={name}
                        value="false"
                        checked={formData[name] === false}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div> */}

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Additional Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "insects_present", label: "Insects Present" },
                { name: "fertilizers_applied", label: "Fertilizers Applied" },
                {
                  name: "soil_level_maintained",
                  label: "Soil Level Maintained",
                },
                { name: "tree_burnt", label: "Tree Burnt" },
                { name: "unwanted_grass", label: "Unwanted Grass" },
                { name: "water_logging", label: "Water Logging" },
                { name: "compound_maintained", label: "Compound Maintained" },
              ].map(({ name, label }) => {
                // Define health status mappings
                const healthFieldMap = {
                  Good: [
                    "fertilizers_applied",
                    "soil_level_maintained",
                    "compound_maintained",
                  ],
                  Infected: [
                    "insects_present",
                    "water_logging",
                    "tree_burnt",
                    "unwanted_grass",
                  ],
                  Deceased: [
                    "tree_burnt",
                    "water_logging",
                    "insects_present",
                    "fertilizers_applied",
                  ],
                };
                // Determine if the current field is relevant for the selected health_status
                const isRelevant =
                  healthFieldMap[formData.health_status]?.includes(name);
                return (
                  <div key={name} className="flex flex-col">
                    <span className="text-sm sm:text-base mb-2">{label}</span>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={name}
                          value="true"
                          checked={formData[name] === true}
                          onChange={handleFormChange}
                          className="mr-2"
                          disabled={!isRelevant}
                        />
                        Yes
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name={name}
                          value="false"
                          checked={formData[name] === false}
                          onChange={handleFormChange}
                          className="mr-2"
                          disabled={!isRelevant}
                        />
                        No
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-4">
              Plant Image
            </h2>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full border rounded p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 bg-yellow-500 text-white font-bold rounded-2xl mt-6 hover:bg-yellow-600 transition duration-200 active:scale-95"
          >
            Update Plant
          </button>
        </form>
      )}
    </div>
  );
};

export default UpdatePlant;
