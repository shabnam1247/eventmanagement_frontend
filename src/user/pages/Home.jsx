import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone,
  FaCalendarAlt,
  FaUsers,
  FaTrophy,
  FaClock,
  FaArrowRight,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaUniversity,
  FaGraduationCap
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import axios from "axios";

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);

    // Fetch upcoming events
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users/events");
      
      if (response.data.success && response.data.events) {
        // Filter only upcoming events and take first 6
        const upcomingEvents = response.data.events
          .filter(event => event.status === 'upcoming')
          .slice(0, 6)
          .map(event => ({
            id: event._id,
            title: event.title,
            date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            category: event.category || 'General',
            image: event.images && event.images.length > 0 
              ? event.images[0] 
              : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800",
            location: event.location || 'Campus',
            maxRegistrations: event.maxRegistrations || 100,
            registeredCount: event.registeredCount || 0
          }));
        setEvents(upcomingEvents);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      // Keep empty array if error
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { icon: <FaCalendarAlt />, value: "400+", label: "Events Managed", color: "from-blue-500 to-cyan-500" },
    { icon: <FaUsers />, value: "12K+", label: "Students Served", color: "from-purple-500 to-pink-500" },
    { icon: <FaTrophy />, value: "95%", label: "Satisfaction Rate", color: "from-green-500 to-emerald-500" },
    { icon: <FaClock />, value: "24/7", label: "Platform Uptime", color: "from-orange-500 to-red-500" }
  ];

  const features = [
    "Real-time event updates",
    "Easy registration process",
    "Automated reminders",
    "Digital certificates",
    "Interactive calendar",
    "Secure payment gateway"
  ];

  const handleViewEvents = () => navigate('/event');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover & Celebrate
              <span className="block bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Campus Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto md:mx-0">
              Your gateway to the most exciting college events. Register, participate, and create unforgettable memories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={handleViewEvents}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Events
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              {!isLoggedIn && (
                <button
                  onClick={() => navigate('/userregister')}
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300"
                >
                  Get Started Free
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
            UPCOMING EVENTS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Don't Miss Out on <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">These Events</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Join thousands of students in these exciting campus activities
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white rounded-3xl overflow-hidden shadow-lg animate-pulse">
                <div className="h-56 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <FaCalendarAlt className="text-gray-300 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-400 mb-2">No Upcoming Events</h3>
            <p className="text-gray-500">Check back later for exciting campus events!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const availableSeats = event.maxRegistrations - event.registeredCount;
              const seatPercentage = (availableSeats / event.maxRegistrations) * 100;
              
              return (
                <div key={event.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                  <div className="relative overflow-hidden h-56">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800";
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.category === 'Cultural' ? 'bg-purple-500 text-white' :
                        event.category === 'Technical' ? 'bg-blue-500 text-white' :
                        event.category === 'Sports' ? 'bg-green-500 text-white' :
                        'bg-orange-500 text-white'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-gray-900 font-bold">{event.date}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Available Seats</span>
                        <span className="font-semibold">{availableSeats} / {event.maxRegistrations}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            seatPercentage > 50 ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
                            seatPercentage > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-red-500 to-pink-500'
                          }`}
                          style={{ width: `${seatPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate(`/eventdetails/${event.id}`)}
                      className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      View Details
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={handleViewEvents}
            className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-blue-600 hover:text-blue-700 hover:gap-3 transition-all"
          >
            View All Events
            <FaArrowRight className="transition-transform" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Join thousands of students who trust us for their campus event management
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="relative group">
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-300">
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${stat.color} mb-6 text-white text-2xl`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-gray-300 text-lg font-medium">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-sm font-semibold mb-4">
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need for <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Event Success</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              We provide a comprehensive platform that simplifies event management and participation, making campus life more engaging and organized.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <FaCheckCircle className="text-green-500 text-xl" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl p-8 shadow-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <FaUniversity className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xl">Al Jamia Arts & Science College</h4>
                    <p className="text-white/80">Established 1995</p>
                  </div>
                </div>
                <p className="text-white/90">
                  A premier institution dedicated to academic excellence and holistic development of students through innovative learning and vibrant campus life.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <FaGraduationCap className="text-white text-3xl mx-auto mb-2" />
                  <p className="text-white font-bold text-2xl">12K+</p>
                  <p className="text-white/80 text-sm">Alumni</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
                  <FaCalendarAlt className="text-white text-3xl mx-auto mb-2" />
                  <p className="text-white font-bold text-2xl">50+</p>
                  <p className="text-white/80 text-sm">Annual Events</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
<Footer></Footer>
      {/* Footer */}
      
    </div>
  );
};

export default HomePage;