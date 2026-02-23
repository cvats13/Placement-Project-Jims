import { Routes, Route } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

import AdminDashboard from "../pages/admin/Dashboard";
import AddStudent from "../pages/admin/AddStudent";
import AddCompany from "../pages/admin/AddCompany";
import EligibleStudents from "../pages/admin/EligibleStudents";

const AdminLayout = () => {
  return (
    <div className="flex">
      <Sidebar role="admin" />
      <div className="flex-1 bg-gray-100 min-h-screen">
        <Navbar />
        <div className="p-6">
          <Routes>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="add-company" element={<AddCompany />} />
            <Route path="eligible" element={<EligibleStudents />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
