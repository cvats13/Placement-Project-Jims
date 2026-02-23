import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import collegeImg from "./assets/collegeImg.jpg";
import RoleSelection from "./pages/RoleSelection";
import AdminLayout from "./layouts/AdminLayout";
import PlacementLayout from "./layouts/PlacementLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/placement/*" element={<PlacementLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
