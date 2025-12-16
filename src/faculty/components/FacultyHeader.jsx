import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Users, UserCheck, GraduationCap } from 'lucide-react';
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

          {/* Mobile Dropdown */}
          <div className="md:hidden">
            <select
              value={location.pathname}
              onChange={(e) => window.location.href = e.target.value}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {navItems.map((item) => (
                <option key={item.path} value={item.path}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FacultyHeader;