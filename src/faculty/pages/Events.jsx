import React, { useState, useEffect } from "react";
import { 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Filter,
  ChevronRight,
  Zap,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const FacultyEventPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admin/events");
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddClick = () => {
    navigate('/faculty/addevent');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/faculty/eventdelete/${id}`);
        if (response.data.success) {
          toast.success("Event deleted successfully");
          fetchEvents();
        }
      } catch (error) {
        console.error("Error deleting event:", error);
        toast.error(error.response?.data?.message || "Failed to delete event");
      }
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "upcoming": return { color: "text-blue-600 bg-blue-50", icon: <Clock className="w-3 h-3" /> };
      case "ongoing": return { color: "text-amber-600 bg-amber-50", icon: <Zap className="w-3 h-3" /> };
      case "completed": return { color: "text-emerald-600 bg-emerald-50", icon: <CheckCircle2 className="w-3 h-3" /> };
      default: return { color: "text-gray-600 bg-gray-50", icon: <Clock className="w-3 h-3" /> };
    }
  };

  return (
    <FacultyLayout>
      <Toaster position="top-right" />
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Manage <span className="text-blue-600">Events</span></h1>
              <p className="text-gray-500 font-medium tracking-tight">Control and track all your scheduled events</p>
            </div>
           
           <button
            onClick={handleAddClick}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            CREATE NEW EVENT
          </button>
        </div>

        {/* Top Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <CompactStat 
             label="Total Events" 
             value={events.length} 
             icon={<Calendar className="w-5 h-5 text-blue-600" />} 
             bg="bg-blue-50"
           />
           <CompactStat 
             label="Total Attendees" 
             value={events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0)} 
             icon={<Users className="w-5 h-5 text-emerald-600" />} 
             bg="bg-emerald-50"
           />
           <CompactStat 
             label="Upcoming" 
             value={events.filter(e => e.status === "upcoming").length} 
             icon={<Zap className="w-5 h-5 text-amber-600" />} 
             bg="bg-amber-50"
           />
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative group w-full flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search events by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="upcoming">Status: Upcoming</option>
                    <option value="ongoing">Status: Ongoing</option>
                    <option value="completed">Status: Completed</option>
                  </select>
               </div>
            </div>
        </div>

        {/* Event Table Content */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden">
           {loading ? (
             <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Accessing Event Data...</p>
             </div>
           ) : (
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="bg-gray-50/50">
                      <th className="py-6 px-10 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Event Name</th>
                      <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Current Status</th>
                      <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Location</th>
                      <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Attendees</th>
                      <th className="py-6 px-10 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                   {filteredEvents.map((event) => {
                     const status = getStatusConfig(event.status);
                     return (
                      <tr key={event._id} className="hover:bg-blue-50/30 transition-all group">
                         <td className="py-8 px-10">
                            <div className="flex items-center gap-5">
                               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center font-black text-blue-600 text-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                  {event.title.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-black text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">{event.title}</p>
                                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 flex items-center gap-1">
                                     <Calendar className="w-3 h-3" /> {new Date(event.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                                  </p>
                               </div>
                            </div>
                         </td>
                         <td className="py-8 px-8">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-sm ${status.color}`}>
                               {status.icon}
                               {event.status}
                            </div>
                         </td>
                         <td className="py-8 px-8">
                            <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                               <MapPin className="w-4 h-4 text-gray-300" />
                               {event.location}
                            </div>
                            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1 ml-6">{event.category?.name || "No Category"}</p>
                         </td>
                         <td className="py-8 px-8">
                            <div className="flex items-center gap-3">
                               <div className="flex -space-x-3">
                                  {[1,2,3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400 grayscale">U</div>
                                  ))}
                               </div>
                               <span className="text-sm font-black text-gray-900">{event.maxParticipants}</span>
                            </div>
                         </td>
                         <td className="py-8 px-10 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button 
                                 onClick={() => navigate(`/faculty/event/${event._id}`)}
                                 className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg rounded-xl transition-all active:scale-90"
                               >
                                  <Eye className="w-5 h-5" />
                               </button>
                               <button 
                                 onClick={() => navigate(`/faculty/editevent/${event._id}`)}
                                 className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-emerald-600 hover:shadow-lg rounded-xl transition-all active:scale-90"
                               >
                                  <Edit className="w-5 h-5" />
                               </button>
                               <div className="w-px h-6 bg-gray-100 mx-2"></div>
                               <button 
                                 onClick={() => handleDelete(event._id)}
                                 className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-lg rounded-xl transition-all active:scale-90"
                               >
                                  <Trash2 className="w-5 h-5" />
                               </button>
                            </div>
                         </td>
                      </tr>
                   )})}
                 </tbody>
               </table>
             </div>
           )}

           {/* Table Footer Actions */}
           <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">
                Showing {filteredEvents.length} events from database
              </p>
              <div className="flex gap-3">
                 <button className="px-6 py-3 bg-gray-50 text-gray-400 font-black text-[10px] uppercase rounded-xl hover:bg-white hover:shadow-md transition-all">Previous</button>
                 <button className="px-6 py-3 bg-blue-600 text-white font-black text-[10px] uppercase rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Next Page</button>
              </div>
           </div>
        </div>

        {/* Global Footer */}
        <div className="flex justify-center pt-6 pb-10">
           <p className="text-[10px] font-black text-gray-200 uppercase tracking-[0.5em] flex items-center gap-4">
              <span className="w-20 h-px bg-gray-100"></span>
              Event Management Dashboard
              <span className="w-20 h-px bg-gray-100"></span>
           </p>
        </div>
      </div>
    </FacultyLayout>
  );
};


const CompactStat = ({ label, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl shadow-gray-50/50 flex items-center gap-6 transition-transform hover:scale-[1.02]">
     <div className={`w-14 h-14 ${bg} rounded-2xl flex items-center justify-center shrink-0`}>
        {icon}
     </div>
     <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tighter mt-1">{value || 0}</p>
     </div>
     <div className="ml-auto">
        <ChevronRight className="w-4 h-4 text-gray-200" />
     </div>
  </div>
);

export default FacultyEventPanel;
