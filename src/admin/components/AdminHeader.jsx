import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Users, UserCheck, GraduationCap, LogOut } from 'lucide-react';
import { GrAnalytics } from 'react-icons/gr';

function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
     {
      path: '/admin/dashboard',
      label: 'Overview',
      icon: <GrAnalytics className="w-4 h-4" />
    },
    {
      path: '/admin/events',
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      path: '/admin/registrationlist',
      label: 'Registrations',
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      path: '/admin/students',
      label: 'Students',
      icon: <Users className="w-4 h-4" />
    },
    {
      path: '/admin/faculty',
      label: 'Faculty',
      icon: <GraduationCap className="w-4 h-4" />
    },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <Link to="/admin/events" className="text-xl font-bold text-gray-900">
              EventHub
              <span className="text-blue-600"> Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors ml-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;