import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-indigo-600 text-white"
      : "text-gray-300 hover:bg-gray-800 hover:text-white";
  };

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col p-5">

      {/* Title */}
      <h2 className="text-xl font-bold mb-8">
        {role === "admin" ? "Admin Panel" : "Placement Cell"}
      </h2>

      {/* Menu */}
      <ul className="space-y-3 flex-1">

        {role === "admin" && (
          <>
            <li>
              <Link
                to="/admin/dashboard"
                className={`block px-4 py-2 rounded ${isActive("/admin/dashboard")}`}
              >
                Dashboard
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-student"
                className={`block px-4 py-2 rounded ${isActive("/admin/add-student")}`}
              >
                Add Student
              </Link>
            </li>

            <li>
              <Link
                to="/admin/add-company"
                className={`block px-4 py-2 rounded ${isActive("/admin/add-company")}`}
              >
                Add Company
              </Link>
            </li>

            <li>
              <Link
                to="/admin/eligible"
                className={`block px-4 py-2 rounded ${isActive("/admin/eligible")}`}
              >
                Eligible Students
              </Link>
            </li>
          </>
        )}

        {role === "placement" && (
          <>
            <li>
              <Link
                to="/placement/dashboard"
                className={`block px-4 py-2 rounded ${isActive("/placement/dashboard")}`}
              >
                Dashboard
              </Link>
            </li>

            {/* <li>
              <Link
                to="/placement/companies"
                className={`block px-4 py-2 rounded ${isActive("/placement/companies")}`}
              >
                Companies
              </Link>
            </li> */}

            {/* <li>
              <Link
                to="/placement/students"
                className={`block px-4 py-2 rounded ${isActive("/placement/students")}`}
              >
                Students
              </Link>
            </li> */}

            {/* <li>
              <Link
                to="/placement/shortlisted"
                className={`block px-4 py-2 rounded ${isActive("/placement/shortlisted")}`}
              >
                Shortlisted
              </Link>
            </li> */}
          </>
        )}

      </ul>

      {/* Logout Button (Bottom Properly Positioned) */}
      <button
        onClick={handleLogout}
        className="mt-auto bg-indigo-600 hover:bg-indigo-700 transition px-4 py-2 rounded text-white"
      >
        Logout
      </button>

    </div>
  );
};

export default Navbar;
