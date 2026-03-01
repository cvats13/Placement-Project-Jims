import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage";
import AdminLayout from "./layouts/AdminLayout";
import PlacementLayout from "./layouts/PlacementLayout";

function App() {
  return (
    <Router>
      <Routes>

        {/* 🔥 Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/placement/*" element={<PlacementLayout />} />

      </Routes>
    </Router>
  );
}

export default App;