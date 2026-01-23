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
  Briefcase
} from 'lucide-react';

const FacultySidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    {
      path: '/faculty/dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      path: '/faculty/events',
      label: 'Manage Events',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      path: '/faculty/registrationlist',
      label: 'Registrations',
      icon: <UserCheck className="w-5 h-5" />
    },
    {
      path: '/faculty/students',
      label: 'Students list',
      icon: <Users className="w-5 h-5" />
    },
    {
      path: '/faculty/calendar',
      label: 'Events Calendar',
      icon: <Clock className="w-5 h-5" />
    },
    {
      path: '/faculty/chatroom',
      label: 'Chatroom',
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
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
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
        <div className="h-20 flex items-center px-6 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-100">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="font-black text-xl tracking-tight text-gray-900">
                Event<span className="text-blue-600">Hub</span>
                <span className="block text-xs text-blue-400 -mt-1 uppercase font-black tracking-widest">Faculty Portal</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-[calc(100vh-80px)] justify-between py-8">
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold transition-all group relative
                  ${isActive(item.path) 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
                    : 'text-gray-400 hover:bg-blue-50 hover:text-blue-600'}
                `}
              >
                <div className={`${isActive(item.path) ? 'text-white' : 'text-gray-300 group-hover:text-blue-600'} transition-colors`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="text-sm truncate">{item.label}</span>}
                
                {isActive(item.path) && !isCollapsed && (
                   <div className="absolute right-4 w-2 h-2 bg-white rounded-full"></div>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-4 bg-gray-900 text-white px-3 py-2 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="px-4 space-y-4">
            {!isMobileOpen && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-gray-400 hover:bg-gray-50 transition-all font-bold"
              >
                {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                {!isCollapsed && <span className="text-sm">Collapse Sidebar</span>}
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-red-500 hover:bg-red-50 transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="text-sm uppercase tracking-widest">Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};


export default FacultySidebar;
