import { useNavigate } from "react-router-dom";

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

export default RoleSelection;
