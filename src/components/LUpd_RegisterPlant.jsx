import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterPlant = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    plant_name: "",
    plant_number: "",
    plant_zone: "",
    height: "",
    planted_on: "",
    latitude: "",
    longitude: "",
    health_status: "Good",
    water_schedule: "Daily",
    insects_present: false,
    fertilizers_applied: false,
    soil_level_maintained: false,
    tree_burnt: false,
    unwanted_grass: false,
    water_logging: false,
    compound_maintained: false,
  });
  const [userInfo, setUserInfo] = useState({
    full_name: "",
    zone: "",
    vibhaag: "",
    role: "",
  });
  const [plantImage, setPlantImage] = useState(null);

  useEffect(() => {
    // Display a pop-up notification before the form is filled
    toast.info("Please fill out all the fields before submitting the form.");
    toast.info("कृपया फॉर्म पूर्णपणे भरून रजिस्टर करा.");
  }, []);

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
        if (response.data.role === "zonal-admin") {
          setFormData((prev) => ({
            ...prev,
            plant_zone: response.data.zone, // Pre-fill the zone for zonal-admin
          }));
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please log in again.");
          toast.error("तुमचा सेशन संपला आहे, पुन्हा लॉगिन करा.");
          localStorage.removeItem("authToken");
          navigate("/login");
        } else {
          toast.error("Error fetching user info.");
        }
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setPlantImage(e.target.files[0]);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => console.error("Error fetching location:", error)
      );
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate health status-related fields
    // (Same validation logic as before)

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    data.append("field_comments", JSON.stringify(formData.comments));
    data.append("upload_date", new Date().toISOString());
    if (plantImage) data.append("plant_image", plantImage);

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("You need to be logged in to register a plant.");
        navigate("/login");
        return;
      }

      await axios.post("http://localhost:5000/plants/register-plant", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Plant registered successfully!");
      toast.success("माहिती अद्ययावत झाली आहे!");

      setFormData({
        plant_name: "",
        plant_number: "",
        plant_zone: userInfo.role === "zonal-admin" ? userInfo.zone : "",
        height: "",
        planted_on: "",
        latitude: "",
        longitude: "",
        health_status: "Good",
        water_schedule: "Daily",
        insects_present: "false",
        fertilizers_applied: "false",
        soil_level_maintained: "false",
        tree_burnt: "false",
        unwanted_grass: "false",
        water_logging: "false",
        compound_maintained: "false",
      });
      setPlantImage(null);
    } catch (error) {
      toast.error("Error registering plant.");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="max-w-full sm:max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
        Register Plant
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Plant Details */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Plant Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Plant Name (वृक्षाचे नाव):
              <input
                type="text"
                name="plant_name"
                placeholder="Enter Plant Name"
                value={formData.plant_name}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Plant Number (वृक्ष क्रमांक):
              <input
                type="text"
                name="plant_number"
                placeholder="Enter Plant Number"
                value={formData.plant_number}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            {/* <label className="block">
              Plant Zone
              <input
                type="number"
                name="plant_zone"
                placeholder="Plant Zone Number"
                value={formData.plant_zone}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label> */}
            <label className="block">
              Plant Zone (वृक्ष विभाग):
              {userInfo.role === "super-admin" ? (
                <input
                  type="text"
                  name="plant_zone"
                  value={formData.plant_zone}
                  onChange={handleChange}
                  placeholder="Zone"
                  className="p-2 border rounded w-full"
                  required
                />
              ) : (
                <input
                  type="text"
                  name="plant_zone"
                  value={userInfo.zone} // Set to the user's zone for zonal-admin
                  disabled
                  className="p-2 border rounded w-full bg-gray-100" // Optional styling for disabled input
                  required
                />
              )}
            </label>

            <label className="block">
              Height (meters) (ऊंची):
              <input
                type="number"
                name="height"
                placeholder="Enter Plant Height"
                value={formData.height}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Planted On (वृक्ष रोपण दिनांक):
              <input
                type="date"
                name="planted_on"
                value={formData.planted_on}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Latitude
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
            <label className="block">
              Longitude
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="p-2 border rounded w-full"
                required
              />
            </label>
          </div>
          <button
            type="button"
            onClick={fetchLocation}
            className="mt-4 py-2 px-4 bg-green-500 text-white rounded-2xl active:scale-95 w-full sm:w-auto"
          >
            Fetch GPS Location
          </button>
        </div>

        {/* Health and Water Schedule */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Health and Water Schedule
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              Health Status (वृक्षाची सध्यस्थिति):
              <select
                name="health_status"
                value={formData.health_status}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="Good">Good (चांगली) </option>
                <option value="Deceased">Deceased (मृत) </option>
                <option value="Infected">Infected (संक्रमित) </option>
              </select>
            </label>
            <label className="block">
              Water Schedule (वृक्षाला पाणी देण्याचा क्रम):
              <select
                name="water_schedule"
                value={formData.water_schedule}
                onChange={handleChange}
                className="p-2 border rounded w-full"
              >
                <option value="Daily">Daily (दररोज) </option>
                <option value="Alternate days">
                  Alternate days (एक किंवा दोन दिवस आड){" "}
                </option>
                <option value="Weekly">Weekly (साप्ताहिक) </option>
                <option value="Monthly">Monthly (मासिक) </option>
              </select>
            </label>
          </div>
        </div>

        {/* Boolean Fields */}
        {/* <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "insects_present", label: "Insects Present" },
              { name: "fertilizers_applied", label: "Fertilizers Applied" },
              { name: "soil_level_maintained", label: "Soil Level Maintained" },
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
                  onChange={handleChange}
                  className="mr-2"
                />
                {label}
              </label>
            ))}
          </div>
        </div> */}

        {/* Boolean Fields */}
        {/* <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">
            Additional Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "insects_present", label: "Insects Present" },
              { name: "fertilizers_applied", label: "Fertilizers Applied" },
              { name: "soil_level_maintained", label: "Soil Level Maintained" },
              { name: "tree_burnt", label: "Tree Burnt" },
              { name: "unwanted_grass", label: "Unwanted Grass" },
              { name: "water_logging", label: "Water Logging" },
              { name: "compound_maintained", label: "Compound Maintained" },
            ].map(({ name, label }) => (
              <div key={name} className="flex flex-col text-sm sm:text-base">
                <span className="font-medium mb-1">{label}</span>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={name}
                    value="true"
                    checked={formData[name] === "true"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={name}
                    value="false"
                    checked={formData[name] === "false"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            ))}
          </div>
        </div> */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              name: "insects_present",
              label: "Insects Present (कीड लागली आहे का?)",
            },
            {
              name: "fertilizers_applied",
              label: "Fertilizers Applied (खत टाकलेले आहे का?)",
            },
            {
              name: "soil_level_maintained",
              label: "Soil Level Maintained (मातीची पातळी योग्य आहे का?) ",
            },
            { name: "tree_burnt", label: "Tree Burnt (झाड जळालेले आहे का?)" },
            {
              name: "unwanted_grass",
              label: "Unwanted Grass (झाडाभोवती अनावश्यक गवत आहे का?) ",
            },
            {
              name: "water_logging",
              label: "Water Logging (आळीमध्ये पाणी साचले आहे का?) ",
            },
            {
              name: "compound_maintained",
              label: "Compound Maintained (झाडाभोवती आळी आहे का?) ",
            },
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
                "soil_level_maintained",
              ],
            };

            // Determine if the current field is relevant for the selected health_status
            const isRelevant =
              healthFieldMap[formData.health_status]?.includes(name);

            return (
              <div key={name} className="flex flex-col text-sm sm:text-base">
                <span className="font-medium mb-1">{label}</span>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={name}
                    value="true"
                    checked={formData[name] === "true"}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={!isRelevant} // Disable irrelevant fields
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={name}
                    value="false"
                    checked={formData[name] === "false"}
                    onChange={handleChange}
                    className="mr-2"
                    disabled={!isRelevant} // Disable irrelevant fields
                  />
                  No
                </label>
              </div>
            );
          })}
        </div>

        {/* Image Upload */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Plant Image</h2>
          <input
            type="file"
            onChange={handleFileChange}
            className="block w-full border rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 font-bold rounded-2xl bg-green-500 text-white mt-4 active:scale-95"
        >
          Register Plant
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default RegisterPlant;
