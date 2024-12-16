// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PlantReport = () => {
//   const { auth } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [plantZone, setPlantZone] = useState("");
//   const [plantNumber, setPlantNumber] = useState("");
//   const [formData, setFormData] = useState(null);

//   const questions = [
//     { key: "water_scheduled", label: "Is water scheduled?" },
//     { key: "insects_present", label: "Are insects present?" },
//     { key: "fertilizers_applied", label: "Are fertilizers applied?" },
//     { key: "soil_level_maintained", label: "Is soil level maintained?" },
//     { key: "tree_burnt", label: "Is the tree burnt?" },
//     { key: "unwanted_grass", label: "Is there unwanted grass?" },
//     { key: "water_logging", label: "Is there water logging?" },
//     { key: "compound_maintained", label: "Is the compound maintained?" },
//   ];

//   // Redirect to login if the user is not authenticated
//   useEffect(() => {
//     if (!auth.token) {
//       navigate("/login");
//     }
//   }, [auth, navigate]);

//   const handleGetForm = async () => {
//     try {
//       const response = await axios.get(
//         `plant-report/plants?zone=${plantZone}&number=${plantNumber}`,
//         {
//           headers: { Authorization: `Bearer ${auth.token}` },
//         }
//       );
//       console.log(response.data);

//       setFormData(response.data);
//     } catch (err) {
//       console.error(err);
//       alert("Error fetching form data");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const reportData = {
//       plant_zone: plantZone, // Include plantZone
//       plant_number: plantNumber, // Include plantNumber
//       plant_id: formData.id,
//       ...questions.reduce((acc, q) => {
//         acc[q.key] = formData[q.key];
//         return acc;
//       }, {}),
//       comments: questions.reduce((acc, q) => {
//         acc[q.key] = formData[`${q.key}_comment`] || null;
//         return acc;
//       }, {}),
//     };

//     try {
//       await axios.post("http://localhost:5000/plant-report", reportData, {
//         headers: { Authorization: `Bearer ${auth.token}` },
//       });
//       alert("Report submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       alert("Error submitting report");
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex space-x-4 mb-4">
//         <input
//           type="text"
//           placeholder="Plant Zone"
//           value={plantZone}
//           onChange={(e) => setPlantZone(e.target.value)}
//           className="border p-2"
//         />
//         <input
//           type="text"
//           placeholder="Plant Number"
//           value={plantNumber}
//           onChange={(e) => setPlantNumber(e.target.value)}
//           className="border p-2"
//         />
//         <button
//           onClick={handleGetForm}
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//         >
//           Get Form
//         </button>
//       </div>

//       {formData && (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {questions.map((q) => (
//             <div key={q.key} className="flex items-center space-x-4">
//               <label>{q.label}</label>
//               <div className="space-x-2">
//                 <label>
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="yes"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         [q.key]: e.target.value === "yes",
//                       })
//                     }
//                   />
//                   Yes
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="no"
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         [q.key]: e.target.value === "no",
//                       })
//                     }
//                   />
//                   No
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Comments"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     [`${q.key}_comment`]: e.target.value,
//                   })
//                 }
//                 className="border p-2 flex-grow"
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PlantReport;

// import React, { useState, useContext, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const PlantReport = () => {
//   const { auth } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const [plantZone, setPlantZone] = useState("");
//   const [plantNumber, setPlantNumber] = useState("");
//   const [formData, setFormData] = useState(null);

//   const questions = [
//     { key: "water_scheduled", label: "1) Is water scheduled?" },
//     { key: "insects_present", label: "2) Are insects present?" },
//     { key: "fertilizers_applied", label: "3) Are fertilizers applied?" },
//     { key: "soil_level_maintained", label: "4) Is soil level maintained?" },
//     { key: "tree_burnt", label: "5) Is the tree burnt?" },
//     { key: "unwanted_grass", label: "6) Is there unwanted grass?" },
//     { key: "water_logging", label: "7) Is there water logging?" },
//     { key: "compound_maintained", label: "8) Is the compound maintained?" },
//   ];

//   // Redirect to login if the user is not authenticated
//   useEffect(() => {
//     if (!auth.token) {
//       navigate("/login");
//     }
//   }, [auth, navigate]);

//   const handleGetForm = async () => {
//     try {
//       const response = await axios.get(
//         `plant-report/plants?zone=${plantZone}&number=${plantNumber}`,
//         {
//           headers: { Authorization: `Bearer ${auth.token}` },
//         }
//       );

//       setFormData(response.data);
//       toast.success("Form data fetched successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error fetching form data.");
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const reportData = {
//       plant_zone: plantZone, // Include plantZone
//       plant_number: plantNumber, // Include plantNumber
//       plant_id: formData.id,
//       ...questions.reduce((acc, q) => {
//         acc[q.key] = formData[q.key];
//         return acc;
//       }, {}),
//       comments: questions.reduce((acc, q) => {
//         acc[q.key] = formData[`${q.key}_comment`] || null;
//         return acc;
//       }, {}),
//     };

//     console.log(reportData);

//     try {
//       await axios.post("http://localhost:5000/plant-report", reportData, {
//         headers: { Authorization: `Bearer ${auth.token}` },
//       });
//       toast.success("Report submitted successfully!");
//     } catch (err) {
//       console.error(err);
//       toast.error("Error submitting report.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
//         <label className="block">
//           वृक्ष विभाग:
//           <input
//             type="text"
//             placeholder="Plant Zone"
//             value={plantZone}
//             onChange={(e) => setPlantZone(e.target.value)}
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//         </label>
//         <label className="block">
//           वृक्ष क्रमांक:
//           <input
//             type="text"
//             placeholder="Plant Number"
//             value={plantNumber}
//             onChange={(e) => setPlantNumber(e.target.value)}
//             className="border p-2 rounded w-full sm:w-auto"
//           />
//         </label>
//         <button
//           onClick={handleGetForm}
//           className="bg-purple-500 text-white px-4 py-2 rounded-xl w-full sm:w-auto hover:bg-purple-600"
//         >
//           Get Form
//         </button>
//       </div>

//       {formData && (
//         <form
//           onSubmit={handleSubmit}
//           className="space-y-6 border p-4 rounded-xl shadow-lg bg-white"
//         >
//           {questions.map((q) => (
//             <div
//               key={q.key}
//               className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
//             >
//               <label className="font-medium flex-shrink-0 sm:w-1/3">
//                 {q.label}
//               </label>
//               <div className="flex space-x-4">
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="yes"
//                     onChange={() =>
//                       setFormData({
//                         ...formData,
//                         // [q.key]: .target.value === "yes",
//                         [q.key]: true,
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   Yes
//                 </label>
//                 <label className="flex items-center">
//                   <input
//                     type="radio"
//                     name={q.key}
//                     value="no"
//                     onChange={() =>
//                       setFormData({
//                         ...formData,
//                         // [q.key]: e.target.value === "no",
//                         [q.key]: false,
//                       })
//                     }
//                     className="mr-2"
//                   />
//                   No
//                 </label>
//               </div>
//               <input
//                 type="text"
//                 placeholder="Comments"
//                 onChange={(e) =>
//                   setFormData({
//                     ...formData,
//                     [`${q.key}_comment`]: e.target.value,
//                   })
//                 }
//                 className="border p-2 rounded w-full sm:flex-grow"
//               />
//             </div>
//           ))}
//           <button
//             type="submit"
//             className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 w-full sm:w-auto"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default PlantReport;

import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PlantReport = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const [plantZone, setPlantZone] = useState("");
  const [plantNumber, setPlantNumber] = useState("");
  const [formData, setFormData] = useState(null);
  const [reportDate, setReportDate] = useState("");
  const [records, setRecords] = useState([]);

  const questions = [
    { key: "water_scheduled", label: "1) Is water scheduled?" },
    { key: "insects_present", label: "2) Are insects present?" },
    { key: "fertilizers_applied", label: "3) Are fertilizers applied?" },
    { key: "soil_level_maintained", label: "4) Is soil level maintained?" },
    { key: "tree_burnt", label: "5) Is the tree burnt?" },
    { key: "unwanted_grass", label: "6) Is there unwanted grass?" },
    { key: "water_logging", label: "7) Is there water logging?" },
    { key: "compound_maintained", label: "8) Is the compound maintained?" },
  ];

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!auth.token) {
      navigate("/login");
    }
  }, [auth, navigate]);

  const handleGetForm = async () => {
    if (!plantZone || !plantNumber) {
      toast.error("Please enter both Plant Zone and Plant Number!");
      return;
    }

    try {
      const response = await axios.get(
        `plant-report/plants?zone=${plantZone}&number=${plantNumber}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setFormData(response.data);
      toast.success("Form data fetched successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching form data.");
    }
  };

  // Fetch records for the specific plant based on the date
  const handleGetRecords = async () => {
    console.log(plantZone, plantNumber, reportDate);
    if (!plantZone || !plantNumber || !reportDate) {
      toast.error("Please enter all details, including the date!");
      return;
    }

    try {
      const formattedDate = new Date(reportDate).toISOString().split("T")[0];
      const response = await axios.get(
        `http://localhost:5000/plant-report/records?zone=${plantZone}&number=${plantNumber}&date=${formattedDate}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      const data = response.data;

      // setRecords(Array.isArray(data) ? data : []);
      if (!Array.isArray(data)) {
        setRecords([]); // Ensure records is reset if no array is returned.
      } else {
        setRecords(data);
      }
      toast.success("Records fetched successfully!");
    } catch (err) {
      // console.error(err);
      // toast.error("Error fetching records.");
      console.error("Error fetching records:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Error fetching records.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const reportData = {
      plant_zone: plantZone,
      plant_number: plantNumber,
      // plant_id: formData.id,
      ...questions.reduce((acc, q) => {
        acc[q.key] = formData[q.key];
        return acc;
      }, {}),
      comments: questions.reduce((acc, q) => {
        acc[q.key] = formData[`${q.key}_comment`] || null;
        return acc;
      }, {}),
    };

    console.log(reportData);

    try {
      await axios.post("http://localhost:5000/plant-report", reportData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("Report submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting report.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <label className="block">
          वृक्ष विभाग:
          <input
            type="text"
            placeholder="Plant Zone"
            value={plantZone}
            onChange={(e) => setPlantZone(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
        </label>
        <label className="block">
          वृक्ष क्रमांक:
          <input
            type="text"
            placeholder="Plant Number"
            value={plantNumber}
            onChange={(e) => setPlantNumber(e.target.value)}
            className="border p-2 rounded w-full sm:w-auto"
          />
        </label>
        <button
          onClick={handleGetForm}
          disabled={!plantZone || !plantNumber} // Disable button if fields are empty
          className={`px-4 py-2 rounded-xl w-full sm:w-auto ${
            plantZone && plantNumber
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Get Form
        </button>
      </div>
      <label className="block mb-6">
        Select Date:
        <input
          type="date"
          value={reportDate}
          onChange={(e) => setReportDate(e.target.value)}
          className="border p-2 rounded w-full sm:w-auto"
        />
      </label>
      <button
        onClick={handleGetRecords}
        disabled={!plantZone || !plantNumber} // Disable button if fields are empty
        className={`px-4 py-2 rounded-xl w-full sm:w-auto mb-12 ${
          plantZone && plantNumber
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        Get Records
      </button>

      {records.length > 0 && (
        <div className="overflow-x-auto border rounded-lg p-4 mb-12">
          <h3 className="text-xl font-bold mb-4">Plant Reports</h3>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-purple-400">
                <th className="p-2 border">Report Date</th>
                <th className="p-2 border">Report Time</th>
                <th className="p-2 border">Health Status</th>
                <th className="p-2 border">Reported By</th>
                <th className="p-2 border">Phone number</th>
                <th className="p-2 border">Water Scheduled</th>
                <th className="p-2 border">Insects Present</th>
                <th className="p-2 border">Fertilizers applied</th>
                <th className="p-2 border">Soil Level Maintained</th>
                <th className="p-2 border">Tree Burnt</th>
                <th className="p-2 border">Unwanted Grass</th>
                <th className="p-2 border">Water Logging</th>
                <th className="p-2 border">Compound Maintained</th>
                <th className="p-2 border">Comments</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record, idx) => (
                <tr key={idx} className="hover:bg-purple-200 text-sm">
                  <td className="p-2 border text-center">
                    {new Date(record.report_date).toLocaleDateString("en-GB") ||
                      "N/A"}
                  </td>
                  <td className="p-2 border text-center font-bold text-sm">
                    {new Date(record.report_date).toLocaleTimeString() || "N/A"}
                  </td>
                  <td
                    className={`p-2 border text-center font-bold bg-${
                      record.health_status === "Good" ? "green-500" : "red-500"
                    }`}
                  >
                    {record.health_status}
                  </td>
                  <td className="p-2 border text-center font-bold">
                    {record.reported_by_full_name}
                  </td>
                  <td className="p-2 border text-center font-bold">
                    {record.reported_by_phone}
                  </td>
                  <td className="p-2 border text-center">
                    {record.water_scheduled ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.insects_present ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.fertilizers_applied ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.soil_level_maintained ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.tree_burnt ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.unwanted_grass ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.water_logging ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center">
                    {record.compound_maintained ? "Yes" : "No"}
                  </td>
                  <td className="p-2 border text-center hover:bg-white">
                    {record.comments
                      ? Object.entries(record.comments)
                          .filter(([key, value]) => value !== null) // Filter out null comments
                          .map(([key, value]) => (
                            <div
                              key={key}
                              className="mb-1 p-2 border hover:bg-purple-300 bg-purple-100 rounded-lg flex flex-col"
                            >
                              <strong className="items-start justify-start">
                                {key.replace(/_/g, " ")}:
                              </strong>{" "}
                              <span className="items-end justify-end">
                                {value}
                              </span>
                            </div>
                          ))
                      : "N/A"}
                    {/* <td className="p-2 border">
                    {record.comments ? JSON.stringify(record.comments) : "N/A"}
                  </td> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formData && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border p-4 rounded-xl shadow-lg bg-white"
        >
          <h3 className="text-xl font-bold mb-4">Plant Health Questions</h3>
          {questions.map((q) => (
            <div
              key={q.key}
              className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4"
            >
              <label className="font-medium flex-shrink-0 sm:w-1/3">
                {q.label}
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={q.key}
                    value="yes"
                    onChange={() =>
                      setFormData({
                        ...formData,
                        [q.key]: true,
                      })
                    }
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name={q.key}
                    value="no"
                    onChange={() =>
                      setFormData({
                        ...formData,
                        [q.key]: false,
                      })
                    }
                    className="mr-2"
                  />
                  No
                </label>
              </div>
              <input
                type="text"
                placeholder="Comments"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [`${q.key}_comment`]: e.target.value,
                  })
                }
                className="border p-2 rounded w-full sm:flex-grow"
              />
            </div>
          ))}
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded-xl hover:bg-purple-600 w-full sm:w-auto"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PlantReport;
