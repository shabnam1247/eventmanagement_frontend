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
  Edit,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
  Activity
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function FacultyViewEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // Using the same endpoint as admin for now, or a faculty specific one if it exists
        const res = await axios.get(`http://localhost:5000/api/admin/event/${id}`);
        if (res.data.success) {
          setEvent(res.data.event);
        }
      } catch (err) {
        console.error("Failed to fetch event details:", err);
        toast.error("Failed to load event details");
        navigate("/faculty/events");
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <FacultyLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="relative">
             <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
             <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Loading event data...</p>
        </div>
      </FacultyLayout>
    );
  }

  if (!event) return null;

  return (
    <FacultyLayout>
      <Toaster position="top-right" />
      
      <div className="space-y-8 pb-12">
        {/* Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <button
                onClick={() => navigate('/faculty/events')}
                className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to All Events
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Event <span className="text-blue-600">Details</span></h1>
              <p className="text-gray-500 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-md md:max-w-none tracking-tight">
                 Viewing: <span className="text-blue-600 font-bold">{event.title}</span>
              </p>
           </div>
           
           <button
             onClick={() => navigate(`/faculty/editevent/${id}`)}
             className="group flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-gray-800 shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95"
           >
             <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
             EDIT EVENT
           </button>
        </div>

        {/* Main Event Body */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/30 rounded-full blur-[100px] -mr-48 -mt-48"></div>

           {/* Event Image */}
           <div className="relative h-64 md:h-[450px] w-full overflow-hidden">
             <img
               src={event.image || "https://images.unsplash.com/photo-1540575861501-7ad05823c23d?auto=format&fit=crop&w=1200&q=80"}
               alt={event.title}
               className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
             />
             <div className="absolute inset-x-0 bottom-0 py-12 px-10 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent">
                <div className="flex flex-wrap gap-3 mb-6">
                   <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl shadow-lg">
                      <Zap className="w-3.5 h-3.5 text-white animate-pulse" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">{event.status}</span>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl">
                      <Layers className="w-3.5 h-3.5 text-white/70" />
                      <span className="text-xs font-black text-white uppercase tracking-widest">{event.category?.name || "Uncategorized"}</span>
                   </div>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight mb-4">{event.title}</h2>
                <div className="flex items-center gap-6">
                   <div className="flex items-center gap-2 text-white/70 font-bold text-sm">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {event.location}
                   </div>
                   <div className="w-px h-4 bg-white/20"></div>
                   <div className="flex items-center gap-2 text-white/70 font-bold text-sm">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      Event Active
                   </div>
                </div>
             </div>
           </div>

           <div className="p-10 md:p-14">
              {/* Event Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                 <TelemetryCard 
                    label="Event Date" 
                    value={new Date(event.date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}
                    icon={<Calendar className="w-6 h-6 text-blue-600" />}
                    detail={new Date(event.date).toLocaleDateString("en-US", { weekday: 'long' })}
                 />
                 <TelemetryCard 
                    label="Event Time" 
                    value={event.timing || "09:00 - 17:00"}
                    icon={<Clock className="w-6 h-6 text-emerald-600" />}
                    detail="Local Time"
                 />
                 <TelemetryCard 
                    label="Max Participants" 
                    value={`${event.maxParticipants} People`}
                    icon={<Users className="w-6 h-6 text-amber-600" />}
                    detail="Seat Capacity"
                 />
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
                 {/* Left Column: Description */}
                 <div className="lg:col-span-3 space-y-12">
                    <section className="space-y-6">
                       <h3 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
                          Description
                       </h3>
                       <p className="text-gray-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                          {event.description || "No description provided for this event."}
                       </p>
                    </section>

                    {event.venue && (
                       <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-2xl transition-all">
                          <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                             <MapPin className="w-7 h-7" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Venue Details</p>
                             <p className="text-xl font-black text-gray-900 tracking-tight uppercase">{event.venue}</p>
                             <p className="text-sm font-bold text-gray-400 mt-2">Located at {event.location}</p>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Right Column: Faculty & Attendance */}
                 <div className="lg:col-span-2 space-y-10">
                    {/* Faculty Host */}
                    <div className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full group-hover:bg-blue-600/30 transition-all"></div>
                       <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Event Organizer</h4>
                       
                       <div className="flex items-center gap-6 mb-10">
                          <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center font-black text-3xl shadow-xl shadow-blue-900/40 border border-blue-400/30">
                             {(event.organizer?.name || "F").charAt(0).toUpperCase()}
                          </div>
                          <div>
                             <h4 className="text-xl font-black tracking-tight">{event.organizer?.name || "Faculty Member"}</h4>
                             <p className="text-xs font-bold text-blue-400 mt-1 uppercase tracking-widest">{event.organizer?.department || "Department"}</p>
                          </div>
                       </div>

                       <div className="space-y-4 pt-8 border-t border-white/10">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                             <span>EMAIL</span>
                             <span className="text-white text-xs tracking-wider">{event.organizer?.email || "N/A"}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs font-bold text-gray-400">
                             <span>FACULTY ID</span>
                             <span className="text-blue-400 text-xs tracking-wider uppercase">{event.organizer?.facultyId || "N/A"}</span>
                          </div>
                       </div>
                    </div>

                    {/* Attendance Stats */}
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl p-10">
                       <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Attendance Overview</h4>
                       <div className="space-y-6">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <Users className="w-6 h-6" />
                             </div>
                             <div>
                                <p className="text-2xl font-black text-gray-900 leading-none">82%</p>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Registration Load</p>
                             </div>
                          </div>
                          <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
                             <div className="h-full bg-emerald-500 rounded-full w-[82%] shadow-sm"></div>
                          </div>
                          <button 
                            onClick={() => navigate('/faculty/registrationlist')}
                            className="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
                          >
                             View All Registrations
                          </button>
                       </div>
                    </div>

                    {/* Speakers */}
                    {event.speakers && event.speakers.length > 0 && (
                       <div className="space-y-6">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Event Speakers</h4>
                          <div className="flex flex-wrap gap-2">
                             {event.speakers.map((speaker, idx) => (
                                <span key={idx} className="px-5 py-3 bg-blue-50 text-blue-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all cursor-default">
                                   {speaker}
                                </span>
                             ))}
                          </div>
                       </div>
                    )}
                 </div>
              </div>
           </div>
           
           {/* Footer */}
           <div className="p-10 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
              <div className="flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-blue-600" />
                 <p className="text-xs font-black text-gray-400 uppercase tracking-widest italic">Secure Data Access</p>
              </div>
              <p className="text-xs font-bold text-gray-300">ID: {id.toUpperCase()}</p>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
}

const TelemetryCard = ({ label, value, icon, detail }) => (
  <div className="p-8 bg-gray-50/50 border border-gray-100 rounded-[2.5rem] flex items-center gap-6 hover:bg-white hover:shadow-2xl transition-all group">
     <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black text-gray-900 tracking-tight uppercase">{value}</p>
        <p className="text-xs font-black text-blue-400 uppercase tracking-tight mt-1">{detail}</p>
     </div>
  </div>
);

export default FacultyViewEventPage;
