import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [registrationStatus, setRegistrationStatus] = useState({
    checked: false,
    registered: false,
    registrationData: null
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fetch event details
    fetchEventDetails();
  }, [id]);

  // Check registration status after event is loaded and user is logged in
  useEffect(() => {
    if (event && userData && userData._id) {
      checkIfRegistered();
    }
  }, [event, userData]);

  const checkIfRegistered = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/events/${id}/check-registration/${userData._id}`
      );

      if (response.data.success) {
        setRegistrationStatus({
          checked: true,
          registered: response.data.registered,
          registrationData: response.data.registration || null
        });
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
      setRegistrationStatus({
        checked: true,
        registered: false,
        registrationData: null
      });
    }
  };

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`http://localhost:5000/api/users/events/${id}`);
      
      if (response.data.success && response.data.event) {
        setEvent(response.data.event);
      } else {
        setError("Event not found");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      setError(error.response?.data?.message || "Failed to load event details");
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    if (!isLoggedIn) {
      toast.error("Please login to register for events");
      navigate('/userlogin');
      return;
    }

    if (registrationStatus.registered) {
      toast.info("You are already registered for this event");
      return;
    }

    if (event.status !== 'upcoming') {
      toast.error("Registration is closed for this event");
      return;
    }

    if (event.availableSeats <= 0) {
      toast.error("No seats available");
      return;
    }

    // Navigate to registration page with event ID
    navigate(`/eventregister/${id}`);
  };

  const getButtonContent = () => {
    if (!isLoggedIn) {
      return { text: "Login to Register", disabled: false, color: "blue" };
    }

    if (registrationStatus.registered) {
      return { 
        text: "Already Registered ✓", 
        disabled: true, 
        color: "green",
        icon: "✓"
      };
    }

    if (event.status !== 'upcoming') {
      return { text: "Registration Closed", disabled: true, color: "gray" };
    }

    if (event.availableSeats <= 0) {
      return { text: "Event Full", disabled: true, color: "gray" };
    }

    return { text: "Register Now", disabled: false, color: "blue" };
  };

  const generateGCalUrl = () => {
    if (!event) return '';
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || `Join us for ${event.title}!`);
    const location = encodeURIComponent(event.location || event.venue || "Campus Hall");
    
    // Format dates for Google: YYYYMMDDTHHMMSSZ
    const date = new Date(evtDateToISO(event.date, event.time || event.timing));
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // Default to 1 hour event
    const endDate = new Date(date.getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
  };

  const evtDateToISO = (dateStr, timeStr) => {
    const baseDate = new Date(dateStr).toISOString().split('T')[0];
    const time = timeStr ? (timeStr.includes(':') ? timeStr : "10:00") : "10:00";
    return `${baseDate}T${time}:00`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Events
          </button>
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
              <p className="text-gray-600 mb-6">{error || "The event you're looking for doesn't exist."}</p>
              <button
                onClick={() => navigate('/event')}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={event.images && event.images.length > 0 
                ? event.images[0] 
                : "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600"}
              alt={event.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600";
              }}
            />
          </div>
          
          <div className="p-6">
            {/* Status Badge */}
            <div className="mb-4">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              {event.category && (
                <span className="ml-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {event.category}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{event.time || event.timing || 'TBA'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium">{event.location || event.venue || 'TBA'}</p>
                </div>
              </div>
            </div>

            {/* Registration Info */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Seats Available</span>
                <span className="text-lg font-bold text-blue-600">{event.availableSeats} / {event.maxRegistrations}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    event.availableSeats > event.maxRegistrations * 0.5 ? 'bg-green-500' :
                    event.availableSeats > event.maxRegistrations * 0.2 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(event.availableSeats / event.maxRegistrations) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleRegister}
                disabled={getButtonContent().disabled}
                className={`flex-1 px-8 py-4 font-bold rounded-2xl transition-all shadow-lg ${
                  getButtonContent().color === 'green' 
                    ? 'bg-green-600 text-white cursor-not-allowed shadow-green-100' 
                    : getButtonContent().disabled 
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-100 hover:-translate-y-0.5 mt-2 md:mt-0'
                }`}
              >
                {getButtonContent().text}
              </button>
              
              <button
                onClick={() => window.open(generateGCalUrl(), '_blank')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-indigo-100 text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-all shadow-md hover:-translate-y-0.5 mt-2 md:mt-0"
              >
                <Calendar className="w-5 h-5" />
                Add to Google Calendar
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Schedule */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Event</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                {event.description}
              </p>
            </div>

            {/* Schedule Section */}
            {event.eventScheduletime && event.eventScheduletime.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Event Schedule</h2>
                </div>
                
                <div className="space-y-4">
                  {event.eventScheduletime.map((item, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="w-20 flex-shrink-0">
                        <span className="font-medium text-gray-900">{item.time}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{item.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Speakers & Details */}
          <div className="space-y-8">
            {/* Speakers Section */}
            {event.speakers && event.speakers.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Speakers</h2>
                </div>
                
                <div className="space-y-4">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                        {speaker.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{speaker}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Details Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{formattedDate}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{event.time || event.timing || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{event.location || event.venue || 'TBA'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">{event.registeredCount} registered</span>
                </div>
              </div>
              
              <button
                onClick={handleRegister}
                disabled={getButtonContent().disabled}
                className={`w-full mt-6 py-3 font-medium rounded-lg transition-colors ${
                  getButtonContent().color === 'green' 
                    ? 'bg-green-600 text-white cursor-not-allowed' 
                    : getButtonContent().disabled 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {getButtonContent().text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}