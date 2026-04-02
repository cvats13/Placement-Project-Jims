import { LayoutDashboard, Users, Building2, CheckSquare, Mail, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from './ui/utils';

export function Sidebar({ activeView, onNavigate, onLogout, userRole }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'companies', label: 'Companies', icon: Building2 },
    { id: 'shortlisted', label: 'Shortlisted', icon: CheckSquare },
    { id: 'email', label: 'Email Notifications', icon: Mail },
    ...(userRole === 'admin' ? [{ id: 'admin', label: 'Bulk Upload', icon: LayoutDashboard }] : []),
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="font-semibold text-xl text-gray-900">Placement Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Management System</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <NavLink
              key={item.id}
              to={`/${item.id}`}
              className={({ isActive: navIsActive }) => cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                navIsActive || isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
