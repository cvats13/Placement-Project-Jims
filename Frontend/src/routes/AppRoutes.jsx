import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { MainDashboard } from '../pages/MainDashboard';

export default function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleLogin = (role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserRole('');
    setIsLoggedIn(false);
  };

  return (
    <Routes>
      <Route 
        path="/login" 
        element={!isLoggedIn ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/*" 
        element={isLoggedIn ? <MainDashboard userRole={userRole} onLogout={handleLogout} /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  );
}
