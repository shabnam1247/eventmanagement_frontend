import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  UserCheck, 
  LogOut, 
  MessageSquare, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X,
  Clock,
  Scan,
  Grid3x3
} from 'lucide-react';

const FacultySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/faculty/dashboard',
      label: 'Analytics',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: '/faculty/events',
      label: 'Events Management',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      path: '/faculty/registrationlist',
      label: 'Registrations',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      path: '/faculty/students',
      label: 'Students List',
      icon: <Users className="w-5 h-5" />
    },
    {
      path: '/faculty/calendar',
      label: 'Events Calendar',
      icon: <Clock className="w-5 h-5" />
    },
    {
      path: '/faculty/gallery',
      label: 'Media Gallery',
      icon: <Grid3x3 className="w-5 h-5" />
    },
    {
      path: '/faculty/check-in',
      label: 'Attendance Check-in',
      icon: <Scan className="w-5 h-5" />
    },
    {
      path: '/faculty/feedback',
      label: 'Student Reviews',
      icon: <MessageSquare className="w-5 h-5" />
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("facultytoken");
    navigate("/faculty/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed left-0 top-0 h-screen z-40 bg-white border-r border-gray-100 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-20' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="font-bold text-xl tracking-tight">
                Event<span className="text-blue-600">Hub</span>
                <span className="block text-[10px] text-gray-400 -mt-1 uppercase tracking-widest">Faculty Panel</span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <div className="flex flex-col h-[calc(100vh-64px)] justify-between py-6">
          <nav className="px-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all group
                  ${isActive(item.path) 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 lg:translate-x-1' 
                    : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'}
                `}
              >
                <div className={`${isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="truncate">{item.label}</span>}
                {isCollapsed && (
                  <div className="absolute left-20 bg-gray-900 text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 space-y-2">
            {!isMobileOpen && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex w-full items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5 ml-1" /> : <ChevronLeft className="w-5 h-5" />}
                {!isCollapsed && <span>Collapse</span>}
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-3 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
            >
              <LogOut className="w-5 h-5 ml-1" />
              {!isCollapsed && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


export default FacultySidebar;
