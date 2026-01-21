import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  ArrowLeft, 
  Loader2, 
  User as UserIcon,
  Tag,
  Info,
  Edit
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function ViewEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/event/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        toast.error("Failed to load event details");
        navigate("/admin/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AdminHeader />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Image Header */}
          <div className="relative h-64 md:h-96 w-full">
            <img
              src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 w-full">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                  event.status === 'upcoming' ? 'bg-blue-500 text-white' : 
                  event.status === 'ongoing' ? 'bg-green-500 text-white' : 
                  'bg-gray-500 text-white'
                }`}>
                  {event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{event.title}</h1>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-semibold text-gray-900">{event.timing || "Not specified"}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold text-gray-900">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    About Event
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {event.description}
                  </p>
                </div>

                {event.venue && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Specific Venue</h3>
                    <div className="p-4 bg-gray-50 rounded-xl text-gray-700">
                      {event.venue}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Event Info</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Tag className="w-4 h-4" />
                        <span className="text-sm">Category</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {event.category?.name || "Uncategorized"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">Max Seats</span>
                      </div>
                      <span className="text-sm font-semibold">{event.maxParticipants}</span>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Organizer</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {(event.organizer?.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">{event.organizer?.name || "Not Assigned"}</p>
                          <p className="text-xs text-gray-500">{event.organizer?.email || "No contact info"}</p>
                        </div>
                      </div>
                    </div>

                    {event.speakers && event.speakers.length > 0 && (
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold mb-3">Speakers</p>
                        <div className="flex flex-wrap gap-2">
                          {event.speakers.map((speaker, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-sm text-gray-700">
                              {speaker}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/admin/editevent/${id}`)}
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit Event Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEventPage;
