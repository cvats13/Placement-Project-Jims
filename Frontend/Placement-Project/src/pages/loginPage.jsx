import { useState } from "react";
import { useNavigate } from "react-router-dom";
import collegeImg from "../assets/collegeImg.jpg";

const LoginPage = () => {
  const [role, setRole] = useState("admin"); // default selected
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    // Save role (optional but recommended for protected routes later)
    localStorage.setItem("role", role);

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "placement") {
      navigate("/placement/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">

      <div className="relative w-[900px] h-[550px] rounded-3xl shadow-2xl overflow-hidden">

        {/* SLIDING IMAGE PANEL */}
        <div
          className={`absolute top-0 h-full w-1/2 transition-all duration-500 ease-in-out
      ${role === "placement" ? "translate-x-full" : "translate-x-0"}`}
        >
          <div
            className="h-full w-full bg-cover bg-center relative text-white p-12 flex flex-col justify-between"
            style={{ backgroundImage: `url(${collegeImg})` }}
          >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className="relative z-10">
              <h1 className="text-3xl font-bold">Placement Portal</h1>
            </div>

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold leading-snug">
                Welcome Back
              </h2>
              <p className="mt-4 text-white/80">
                Manage students, job drives and recruitment efficiently.
              </p>
            </div>

            <p className="relative z-10 text-sm text-white/70">
              © 2026 Training & Placement Cell
            </p>
          </div>
        </div>

        {/* FORM PANEL */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-white p-12 flex flex-col justify-center transition-all duration-500 ease-in-out
      ${role === "placement" ? "left-0" : "left-1/2"}`}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign In
          </h2>
          <p className="text-gray-500 mb-8">
            Choose your role and enter credentials
          </p>

          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 rounded-md font-medium transition ${role === "admin"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600"
                }`}
            >
              Admin
            </button>

            <button
              onClick={() => setRole("placement")}
              className={`flex-1 py-2 rounded-md font-medium transition ${role === "placement"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-600"
                }`}
            >
              Placement Officer
            </button>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-3 mb-6 transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-b-2 border-gray-300 focus:border-indigo-500 outline-none py-3 mb-8 transition"
          />

          <button
            onClick={handleLogin}
            className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition font-semibold shadow-lg"
          >
            Sign In
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;