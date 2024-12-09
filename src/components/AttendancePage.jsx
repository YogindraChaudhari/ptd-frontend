import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const workTypesList = [
  "झाडांना पाणी देणे",
  "आळ तयार करणे",
  "ग्रीन नेट बांधणे",
  "मोठे गवत कापणे",
  "माती भुसभुशीत करणे",
  "गांडूळ खत टाकणे",
  "व्हर्मी कंपोस्ट खत टाकणे",
  "झाडांची पाने धुणे",
  "कंपोस्ट खत तयार करणे",
  "गांडूळ खत तयार करणे",
  "पाण्याच्या टाक्या भरणे",
  "ग्रास कटिंग किंवा इतर मशीन दुरुस्त करणे",
  "झाडांचे व इतर परिसर सर्वेक्षण करणे",
  "साहित्य नोंदणी करणे",
  "हजेरी नोंद करणे",
  "झुकलेल्या झाडांना आधार देणे",
  "पाण्याचा निचरा करणे",
  "कीटक नाशके फवारणे",
  "झाडा जवळचे गवत कापणे",
  "झाडांची माहिती अद्ययावत करणे",
  "नवीन झाडे लावणे",
  "मेलेली झाडे बदलणे",
  "झाडांची संख्या अद्ययावत करणे",
  "झाडांना नंबर देणे",
  "नवीन पाईप टाकणे",
  "पाईप दुरुस्त करणे",
  "गार्डन तयार करणे",
];

const AttendancePage = () => {
  const { auth } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [date, setDate] = useState("");

  // Toggle work types selection
  const toggleWorkType = (type) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(type)
        ? prev.filter((item) => item !== type)
        : [...prev, type]
    );
  };

  // Submit attendance
  const submitAttendance = async () => {
    if (!auth.user) {
      toast.error("You must be logged in to mark attendance.");
      return;
    }

    if (selectedWorkTypes.length === 0) {
      toast.error("Please select at least one work type.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/attendance/atd",
        {
          user_id: auth.user.id,
          full_name: auth.user.full_name,
          phone_number: auth.user.phone_number,
          email: auth.user.email,
          zone: auth.user.zone,
          vibhaag: auth.user.vibhaag,
          work_types: selectedWorkTypes,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      toast.success(response.data.message);
      setShowModal(false);
      setSelectedWorkTypes([]);
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance.");
    }
  };

  // Fetch attendance for a specific date
  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/attendance/${date}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setAttendanceRecords(response.data.attendance);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records.");
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-center mb-6">Mark Attendance</h1>
      <p className="font-semibold bg-slate-100 p-4 rounded-xl text-gray-600 mb-4">
        ❗Please Click on "
        <span className="text-indigo-500 font-mono">Check-In</span>" button to
        mark attendance.
      </p>
      {auth.user ? (
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-indigo-600 transition duration-300 active:scale-90"
        >
          Check-In
        </button>
      ) : (
        <p className="text-gray-500">Please log in to mark your attendance.</p>
      )}

      {/* Modal for marking attendance */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/3 p-6">
            <h2 className="text-lg font-bold mb-4">Select Type of Work</h2>
            <div className="max-h-60 overflow-y-auto">
              {workTypesList.map((type) => (
                <label key={type} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedWorkTypes.includes(type)}
                    onChange={() => toggleWorkType(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={submitAttendance}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600 transition duration-300 active:scale-90"
              >
                Submit
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-300 active:scale-90"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Attendance history */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">View Attendance</h2>
        <div className="flex items-center space-x-4 mb-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border px-4 py-2 rounded-xl bg-green-100"
          />
          <button
            onClick={fetchAttendance}
            className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold hover:bg-green-600 transition duration-300 active:scale-90"
          >
            Fetch Records
          </button>
        </div>
        {attendanceRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md text-center">
              <thead>
                <tr className="bg-green-400">
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-800">
                    Full Name
                  </th>
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-800">
                    Phone Number
                  </th>

                  <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-800">
                    Vibhaag
                  </th>
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-800">
                    Zone
                  </th>
                  <th className="py-3 px-4 text-center text-sm sm:text-base font-semibold text-gray-800">
                    Work Types
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index} className="odd:bg-slate-50 even:bg-white">
                    <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                      {record.full_name}
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                      {record.phone_number}
                    </td>

                    <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                      {record.vibhaag}
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base text-gray-700">
                      {record.zone}
                    </td>
                    <td className="py-2 px-4 text-start text-sm sm:text-base text-gray-700">
                      {record.work_types.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No records found for this date.</p>
        )}
      </div>
    </div>
  );
};

export default AttendancePage;
