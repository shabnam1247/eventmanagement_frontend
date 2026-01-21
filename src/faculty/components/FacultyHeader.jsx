import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, UserCheck, GraduationCap, LogOut } from 'lucide-react';
import { GrAnalytics } from 'react-icons/gr';

function FacultyHeader() {
  const location = useLocation();
  
  const navItems = [
     {
          path: '/faculty/analytics',
          label: 'Overview',
          icon: <GrAnalytics className="w-4 h-4" />
        },
    {
      path: '/faculty/events',
      label: 'Events',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      path: '/faculty/registrationlist',
      label: 'Registrations',
      icon: <UserCheck className="w-4 h-4" />
    },
    {
      path: '/faculty/students',
      label: 'Students',
      icon: <Users className="w-4 h-4" />
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <Link to="/faculty/events" className="text-xl font-bold text-gray-900">
              EventHub
              <span className="text-green-600"> Faculty</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Faculty Profile & Logout */}
          <div className="hidden md:flex items-center gap-4">
            {localStorage.getItem("facultyData") && (
              <div className="flex items-center gap-3">
                <Link
                  to="/faculty/events"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                  title="userprofile"
                >
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold border border-green-200">
                    {JSON.parse(localStorage.getItem("facultyData")).name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {JSON.parse(localStorage.getItem("facultyData")).name}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("facultyData");
                    window.location.href = "/faculty/login";
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Dropdown */}
          <div className="md:hidden flex items-center gap-2">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
            {localStorage.getItem("facultyData") && (
               <button
               onClick={() => {
                 localStorage.removeItem("facultyData");
                 window.location.href = "/faculty/login";
               }}
               className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
               title="Logout"
             >
               <LogOut className="w-5 h-5" />
             </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default FacultyHeader;