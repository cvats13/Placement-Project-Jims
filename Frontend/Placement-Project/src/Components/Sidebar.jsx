import { Link } from "react-router-dom";

const Sidebar = ({ role }) => {
  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">
      <h2 className="text-xl font-bold mb-6">
        {role === "admin" ? "Admin Panel" : "Placement Cell"}
      </h2>

      {role === "admin" && (
        <ul className="space-y-4">
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/add-student">Add Student</Link></li>
          <li><Link to="/admin/add-company">Add Company</Link></li>
          <li><Link to="/admin/eligible">Eligible Students</Link></li>
        </ul>
      )}

      {role === "placement" && (
        <ul className="space-y-4">
          <li><Link to="/placement/dashboard">Dashboard</Link></li>
          <li><Link to="/placement/companies">Companies</Link></li>
          <li><Link to="/placement/students">Students</Link></li>
          <li><Link to="/placement/shortlisted">Shortlisted</Link></li>
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
