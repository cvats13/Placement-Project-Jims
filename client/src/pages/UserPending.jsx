import React from 'react';
import { useNavigate } from 'react-router-dom';

export function UserPending() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 text-center space-y-8">
        <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Registration Pending</h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Hello, <span className="font-semibold text-gray-900">{user.name}</span>!
          </p>
          <p className="text-gray-500">
            Your registration is currently pending approval by the placement administrator.
            Please check back once you've been approved.
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Logout & Check Later
          </button>
        </div>

        <p className="text-sm text-gray-400">
          Need help? <a href="mailto:admin@jims.edu" className="text-indigo-500 hover:underline">Contact Admin</a>
        </p>
      </div>
    </div>
  );
}
