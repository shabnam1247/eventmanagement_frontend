import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Gallery", path: "/mediagallery" },
    { name: "Events", path: "/event" },
    { name: "Calendar", path: "/studentcalendar" },
    { name: "My Events", path: "/myevents" },
    { name: "Contact", path: "/contact" },
    { name: "Profile", path: "/profile" },
    { name: "Login", path: "/login" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-r from-blue-50 to-indigo-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.slice(0, -2).map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {localStorage.getItem("userData") ? (
              <>
                <Link
                  to="/profile"
                  className="px-5 py-2.5 text-gray-700 hover:text-indigo-600 font-medium transition-colors flex items-center gap-2"
                  title="userprofile"
                >
                  <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                    {JSON.parse(localStorage.getItem("userData")).name.charAt(0).toUpperCase()}
                  </div>
                  <span>{JSON.parse(localStorage.getItem("userData")).name}</span>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("userData");
                    navigate("/login");
                  }}
                  className="px-6 py-2.5 border border-red-200 text-red-600 rounded-full font-medium hover:bg-red-50 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/profile"
                  className="px-5 py-2.5 text-gray-700 hover:text-indigo-600 font-medium transition-colors"
                  title="userprofile"
                >
                  Profile
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-indigo-200 transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden relative w-10 h-10 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  open ? "rotate-45 translate-y-0" : "-translate-y-2"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block h-0.5 w-6 bg-gray-700 transition-all duration-300 ${
                  open ? "-rotate-45 -translate-y-0" : "translate-y-2"
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          open
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100">
          <nav className="flex flex-col px-6 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <div className="flex items-center justify-between">
                  {item.name}
                  {isActive(item.path) && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </Link>
            ))}
          </nav>
          <div className="px-6 pb-6 pt-4 border-t border-gray-100">
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block w-full py-3.5 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}