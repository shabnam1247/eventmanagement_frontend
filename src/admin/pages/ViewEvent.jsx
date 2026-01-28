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
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  if (!event) return null;

  return (
    <AdminLayout>
      
      <div className="py-2">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-all font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Management
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-50 border border-gray-100 overflow-hidden">
          {/* Image Header */}
          <div className="relative h-64 md:h-[400px] w-full">
            <img
              src={event.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80"}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
              <div className="p-8 md:p-12 w-full">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg ${
                    event.status === 'upcoming' ? 'bg-blue-600 text-white' : 
                    event.status === 'ongoing' ? 'bg-green-600 text-white' : 
                    'bg-gray-600 text-white'
                  }`}>
                    {event.status}
                  </span>
                  <span className="px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md text-white border border-white/30">
                    {event.category?.name || "Event"}
                  </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">{event.title}</h1>
                <p className="text-white/70 flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4" /> {event.location}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-50 flex items-center gap-4 group hover:bg-blue-50 transition-colors">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Calendar className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Event Date</p>
                  <p className="font-bold text-gray-900 leading-tight">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-50 flex items-center gap-4 group hover:bg-purple-50 transition-colors">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-7 h-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Timing</p>
                  <p className="font-bold text-gray-900 leading-tight">{event.timing || "Contact Organizer"}</p>
                </div>
              </div>

              <div className="bg-green-50/50 rounded-2xl p-6 border border-green-50 flex items-center gap-4 group hover:bg-green-50 transition-colors">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Max Capacity</p>
                  <p className="font-bold text-gray-900 leading-tight">{event.maxParticipants} Registered</p>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-12">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                    Event Overview
                  </h2>
                  <div className="prose prose-blue max-w-none">
                    <p className="text-gray-600 leading-relaxed text-lg font-medium whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
                </div>

                {event.venue && (
                  <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                    <h3 className="text-lg font-black text-gray-900 mb-4 uppercase tracking-tight">Venue Details</h3>
                    <div className="flex items-start gap-4 text-gray-700">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center flex-shrink-0">
                         <MapPin className="w-5 h-5 text-red-500" />
                      </div>
                      <p className="font-medium text-lg leading-snug pt-1">{event.venue}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                  <h3 className="text-lg font-black text-gray-900 mb-6 uppercase tracking-tight">Organizer Profile</h3>
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
                      {(event.organizer?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 leading-tight text-lg">{event.organizer?.name || "University Admin"}</h4>
                      <p className="text-xs text-gray-400 font-bold mt-1 mb-2">Academic Department</p>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-tight">{event.organizer?.email || "internal@eventhub.edu"}</p>
                    </div>
                  </div>

                  {event.speakers && event.speakers.length > 0 && (
                    <div className="pt-8 border-t border-gray-100">
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Keynote Speakers</p>
                      <div className="flex flex-wrap gap-2">
                        {event.speakers.map((speaker, idx) => (
                          <span key={idx} className="px-4 py-2 bg-gray-50 text-gray-700 rounded-xl text-sm font-bold border border-gray-100 shadow-sm transition-all hover:bg-white hover:shadow-md cursor-default">
                             {speaker}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="pt-8 mt-8 border-t border-gray-100 flex flex-col gap-4">
                    <button
                      onClick={() => navigate(`/admin/editevent/${id}`)}
                      className="w-full py-4 bg-gray-900 text-white font-black rounded-2xl hover:bg-gray-800 transition-all shadow-lg hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                      <Edit className="w-5 h-5" />
                      MODIFY DETAILS
                    </button>
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Last updated: {new Date(event.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default ViewEventPage;
