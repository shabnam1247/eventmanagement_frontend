import React, { useState, useEffect } from "react";
import { Search, Plus, Calendar, MapPin, Users, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast from "react-hot-toast";

const FacultyEventPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/faculty/addevent');
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/admin/events");
      setEvents(response.data.events || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDeleteRequest = (eventId, eventTitle) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium text-gray-900">
          Are you sure you want to delete <b>{eventTitle}</b>?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(eventId);
            }}
            className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handleDelete = async (eventId) => {
    setDeleting(eventId);
    try {
      const res = await axios.delete(`http://localhost:5000/api/faculty/eventdelete/${eventId}`);
      if (res.data.success) {
        toast.success("Event deleted successfully");
        setEvents(events.filter(e => e._id !== eventId));
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Failed to delete event");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (eventId) => {
    navigate(`/faculty/editevent/${eventId}`);
  };

  const handleView = (eventId) => {
    navigate(`/faculty/event/${eventId}`);
  };

  const filteredEvents = events.filter((event) => {
    const titleMatch = event.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || event.status === statusFilter;
    return titleMatch && statusMatch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-50 text-blue-600 border-blue-100";
      case "ongoing": return "bg-green-50 text-green-600 border-green-100";
      case "pastevents": return "bg-gray-50 text-gray-600 border-gray-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <FacultyLayout>
      
      <div className="py-2">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Events Management</h1>
            <p className="text-gray-500 font-medium tracking-tight">Create, publish and manage your events</p>
          </div>
          
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95 font-bold"
          >
            <Plus className="w-5 h-5" />
            CREATE NEW EVENT
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Events</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{events.length}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Upcoming</h3>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {events.filter(e => e.status === "upcoming").length}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Seats</h3>
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {events.reduce((sum, e) => sum + (e.maxParticipants || 0), 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Completed</h3>
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {events.filter(e => e.status === "completed" || e.status === "pastevents").length}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events by title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-600 font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all border-none shadow-sm"
                >
                  <option value="all">Every Status</option>
                  <option value="upcoming">Upcoming Only</option>
                  <option value="ongoing">Active Now</option>
                  <option value="pastevents">Past Events</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Retrieving event data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Event Name</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Schedule</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Capacity</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Detail</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredEvents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                             <Calendar className="w-8 h-8 text-gray-200" />
                           </div>
                           <p className="text-gray-400 font-medium">No events found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredEvents.map((event) => (
                      <tr key={event._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                 {event.image ? (
                                   <img src={event.image} alt="" className="w-full h-full object-cover" />
                                 ) : (
                                   <Calendar className="w-5 h-5 text-gray-400" />
                                 )}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{event.title}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 font-medium italic">
                                  <MapPin className="w-3 h-3 text-blue-400" /> {event.location}
                                </p>
                              </div>
                           </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-gray-700">
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </p>
                          <p className="text-xs text-gray-400 font-medium uppercase tracking-tight">{event.timing}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                               <div className="bg-blue-500 h-1.5 rounded-full" style={{width: '60%'}}></div>
                            </div>
                            <span className="text-xs font-bold text-gray-600">{event.maxParticipants}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                          <div className="flex flex-col">
                             <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Category</span>
                             <span className="text-blue-600 font-bold">{event.category?.name || "None"}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1">
                            <button 
                              onClick={() => handleView(event._id)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleEdit(event._id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Edit Event"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteRequest(event._id, event.title)}
                              disabled={deleting === event._id}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                              title="Delete Event"
                            >
                              {deleting === event._id ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                              ) : (
                                <Trash2 className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-6 bg-gray-50/30 border-t border-gray-50 flex justify-between items-center italic">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredEvents.length}</span> active events in total
            </p>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyEventPanel;
