/*import { useNavigate } from "react-router-dom";

const RoleSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded shadow-lg text-center w-96">
        <h1 className="text-2xl font-bold mb-8">Select Portal</h1>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-blue-600 text-white py-2 rounded"
          >
            Admin Login
          </button>

          <button
            onClick={() => navigate("/placement/dashboard")}
            className="bg-green-600 text-white py-2 rounded"
          >
            Placement Cell Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;*/
import { useState } from "react";
import collegeImg from "../assets/collegeImg.jpg";

const RoleSelection = () => {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    alert("Frontend Login Only (No Backend Connected)");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-md scale-110"
        style={{ backgroundImage: `url(${collegeImg})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Login Card */}
      <div className="relative bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-2xl w-96">

        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Placement Portal Login
        </h1>

        {/* Role */}
        <label className="text-gray-600">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border p-2 rounded mt-1 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="placement">Placement Cell</option>
        </select>

        {/* Username */}
        <label className="text-gray-600">Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-2 rounded mt-1 mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Password */}
        <label className="text-gray-600">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mt-1 mb-6 focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 rounded-lg hover:scale-105 transition duration-300"
        >
          Login
        </button>

      </div>
    </div>
  );
};

export default RoleSelection;
