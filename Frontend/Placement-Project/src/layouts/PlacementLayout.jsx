import { Routes, Route } from "react-router-dom";
import Navbar from "../Components/Navbar";

import PlacementDashboard from "../pages/placement/PlacementDashboard";
import CompanyManagement from "../pages/placement/CompanyManagement";
import StudentList from "../pages/placement/StudentList";
import ShortlistedStudents from "../pages/placement/ShortlistedStudents";

const PlacementLayout = () => {
  return (
    <div className="flex min-h-screen">

      {/* Sidebar */}
      <Navbar role="placement" />

      {/* Main Content */}
      <div className="flex-1 bg-gray-100 p-6">
        <Routes>
          <Route path="dashboard" element={<PlacementDashboard />} />
          <Route path="companies" element={<CompanyManagement />} />
          {/* <Route path="students" element={<StudentList />} /> */}
          <Route path="students/:id" element={<StudentList />} />
          <Route path="shortlisted" element={<ShortlistedStudents />} />
        </Routes>
      </div>

    </div>
  );
};

export default PlacementLayout;
