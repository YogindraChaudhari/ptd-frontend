import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    zone: "",
    vibhaag: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/register", formData);
      setSuccess("User registered successfully! Please log in.");
      setError("");
    } catch (err) {
      setError("Registration failed. Check your inputs.");
      setSuccess("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create an Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="Enter your full name"
              value={formData.full_name}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="phone_number"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              placeholder="Enter your phone number"
              value={formData.phone_number}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="zone"
              className="block text-sm font-medium text-gray-700"
            >
              Zone
            </label>
            <input
              type="number"
              id="zone"
              name="zone"
              placeholder="Enter your zone number"
              value={formData.zone}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="vibhaag"
              className="block text-sm font-medium text-gray-700"
            >
              Vibhaag
            </label>
            <input
              type="text"
              id="vibhaag"
              name="vibhaag"
              placeholder="Enter your Vibhaag"
              value={formData.vibhaag}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium text-lg rounded-lg shadow-md transition-all"
          >
            Register
          </button>
        </form>
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-500 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
