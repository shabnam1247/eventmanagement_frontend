import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, Users, ArrowLeft, Loader2, User, Mail, Phone, Building2, GraduationCap, MessageSquare } from "lucide-react";
import Header from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function EventRegister() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userData, setUserData] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    comments: ""
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUserData = localStorage.getItem('userData');
    if (!storedUserData) {
      toast.error("Please login to register for events");
      navigate('/userlogin');
      return;
    }

    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        firstName: parsedUserData.name?.split(' ')[0] || '',
        lastName: parsedUserData.name?.split(' ').slice(1).join(' ') || '',
        email: parsedUserData.email || '',
        phone: parsedUserData.phonenumber || '',
        department: parsedUserData.department || '',
        year: parsedUserData.year || ''
      }));
    } catch (error) {
      console.error("Error parsing user data:", error);
      toast.error("Invalid user session. Please login again.");
      navigate('/userlogin');
      return;
    }

    // Fetch event details
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/events/${id}`);
      
      if (response.data.success && response.data.event) {
        const eventData = response.data.event;
        
        // Check if event is available for registration
        if (eventData.status !== 'upcoming') {
          toast.error("Registration is closed for this event");
          navigate(`/eventdetails/${id}`);
          return;
        }

        if (eventData.availableSeats <= 0) {
          toast.error("No seats available for this event");
          navigate(`/eventdetails/${id}`);
          return;
        }

        // Check if user is already registered
        if (userData && userData._id) {
          try {
            const regCheckResponse = await axios.get(
              `http://localhost:5000/api/users/events/${id}/check-registration/${userData._id}`
            );
            
            if (regCheckResponse.data.success && regCheckResponse.data.registered) {
              toast.info("You are already registered for this event");
              navigate(`/eventdetails/${id}`);
              return;
            }
          } catch (checkError) {
            console.error("Error checking registration:", checkError);
            // Continue anyway if check fails
          }
        }

        setEvent(eventData);
      } else {
        toast.error("Event not found");
        navigate('/event');
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast.error("Failed to load event details");
      navigate('/event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userData || !userData._id) {
      toast.error("User session expired. Please login again.");
      navigate('/userlogin');
      return;
    }

    setSubmitting(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/users/eventregister/${userData._id}`,
        {
          eventId: id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          year: formData.year,
          comments: formData.comments
        }
      );

      if (response.data.success) {
        toast.success("Successfully registered for the event!");
        
        // Navigate to success page with registration data
        setTimeout(() => {
          navigate('/registration-success', {
            state: {
              registration: response.data.registration
            }
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || "Failed to register for event";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 font-medium">Loading registration form...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
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
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(`/eventdetails/${id}`)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Event Details
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Registration</h1>
          <p className="text-gray-600">Complete the form below to register for this event</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="Enter email"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                      placeholder="10-digit number"
                    />
                  </div>
                </div>

                {/* Academic Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <Building2 className="w-4 h-4" />
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Select Department</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Civil">Civil</option>
                      <option value="BCA">BCA</option>
                      <option value="BBA">BBA</option>
                      <option value="Commerce">Commerce</option>
                    </select>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                      <GraduationCap className="w-4 h-4" />
                      Year *
                    </label>
                    <select
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    Additional Comments (Optional)
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Any questions or special requirements..."
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5" />
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Event Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h3 className="font-bold text-gray-900 mb-4">Event Summary</h3>
              
              {/* Event Image */}
              {event.images && event.images.length > 0 && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={event.images[0]}
                    alt={event.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400";
                    }}
                  />
                </div>
              )}

              <h4 className="font-bold text-lg text-gray-900 mb-4">{event.title}</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Date</p>
                    <p className="text-gray-900 font-medium">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-purple-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Time</p>
                    <p className="text-gray-900 font-medium">{event.time || event.timing || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Venue</p>
                    <p className="text-gray-900 font-medium">{event.location || event.venue || 'TBA'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-gray-500">Available Seats</p>
                    <p className="text-gray-900 font-bold">{event.availableSeats} / {event.maxRegistrations}</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <span>Registration Progress</span>
                  <span className="font-bold">{Math.round((event.registeredCount / event.maxRegistrations) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      event.availableSeats > event.maxRegistrations * 0.5 ? 'bg-green-500' :
                      event.availableSeats > event.maxRegistrations * 0.2 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${(event.registeredCount / event.maxRegistrations) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
