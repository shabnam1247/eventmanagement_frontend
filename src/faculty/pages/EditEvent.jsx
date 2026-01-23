import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  ArrowLeft, 
  User, 
  Loader2, 
  Info, 
  Edit3, 
  Save, 
  Zap, 
  Sparkles, 
  Layers, 
  Users, 
  FileText,
  Clock,
  ShieldCheck
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function FacultyEditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [eventData, setEventData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    image: null,
    category: "",
    maxParticipants: "",
    timing: "",
    venue: "",
    speakers: "",
    status: "upcoming"
  });
  
  const [existingImage, setExistingImage] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const catRes = await axios.get("http://localhost:5000/api/admin/categories");
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }

        const eventRes = await axios.get(`http://localhost:5000/api/admin/event/${id}`);
        if (eventRes.data.success) {
          const event = eventRes.data.event;
          const formattedDate = event.date ? new Date(event.date).toISOString().split('T')[0] : "";
          
          setEventData({
            title: event.title || "",
            date: formattedDate,
            location: event.location || "",
            description: event.description || "",
            image: null,
            category: event.category?._id || event.category || "",
            maxParticipants: event.maxParticipants || "",
            timing: event.timing || "",
            venue: event.venue || "",
            speakers: event.speakers ? (Array.isArray(event.speakers) ? event.speakers.join(', ') : event.speakers) : "",
            status: event.status || "upcoming"
          });
          setExistingImage(event.image || "");
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load event data");
        navigate("/faculty/events");
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files) {
      setEventData({ ...eventData, image: files[0] });
    } else {
      setEventData({ ...eventData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("date", eventData.date);
      formData.append("location", eventData.location);
      formData.append("description", eventData.description);
      formData.append("category", eventData.category);
      formData.append("maxParticipants", eventData.maxParticipants);
      formData.append("timing", eventData.timing);
      formData.append("venue", eventData.venue);
      formData.append("status", eventData.status);
      
      if (eventData.speakers) {
        formData.append("speakers", eventData.speakers);
      }
      if (eventData.image) {
        formData.append("image", eventData.image);
      }

      // Using faculty update endpoint
      const res = await axios.put(`http://localhost:5000/api/faculty/eventedit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Event updated successfully!");
        navigate("/faculty/events");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <FacultyLayout>
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto space-y-10 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Discard Changes
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Edit <span className="text-blue-600">Event</span></h1>
              <p className="text-gray-500 font-medium tracking-tight overflow-hidden text-ellipsis whitespace-nowrap max-w-sm md:max-w-none">
                 Modifying details for: <span className="text-blue-600 font-black">"{eventData.title}"</span>
              </p>
           </div>

           <div className="hidden md:block">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center relative shadow-xl shadow-blue-100/50">
                 <Edit3 className="w-10 h-10 text-blue-600" />
                 <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-50">
                    <Zap className="w-3 h-3 text-blue-600 animate-pulse" />
                 </div>
              </div>
           </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-50/50 p-10 md:p-14 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
           
           <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
              {/* Basic Details */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Basic Information</span>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input
                      type="text"
                      name="title"
                      value={eventData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-black text-gray-800 text-xl tracking-tight"
                      placeholder="Event Name"
                    />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Category</label>
                       <div className="relative group">
                          <Layers className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                          <select
                            name="category"
                            value={eventData.category}
                            onChange={handleChange}
                            required
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 appearance-none"
                          >
                            <option value="">Select Category</option>
                            {categories.map((cat) => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Max Participants</label>
                       <div className="relative group">
                          <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="number"
                            name="maxParticipants"
                            value={eventData.maxParticipants}
                            onChange={handleChange}
                            required
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                            placeholder="Max attendance"
                          />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Time & Location */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Time & Location</span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Date</label>
                       <div className="relative group">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="date"
                            name="date"
                            value={eventData.date}
                            onChange={handleChange}
                            required
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                          />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Time</label>
                       <div className="relative group">
                          <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                          <input
                            type="text"
                            name="timing"
                            value={eventData.timing}
                            onChange={handleChange}
                            required
                            className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                            placeholder="e.g. 10:00 AM - 04:00 PM"
                          />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Location / City</label>
                       <input
                         type="text"
                         name="location"
                         value={eventData.location}
                         onChange={handleChange}
                         required
                         className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                         placeholder="City name"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Specific Venue</label>
                       <input
                         type="text"
                         name="venue"
                         value={eventData.venue}
                         onChange={handleChange}
                         className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                         placeholder="Hall, Room, Auditorium"
                       />
                    </div>
                 </div>
              </div>

              {/* Status & Speakers */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Status & Speakers</span>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Status</label>
                       <select
                         name="status"
                         value={eventData.status}
                         onChange={handleChange}
                         required
                         className="w-full px-8 py-5 bg-blue-600 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-black text-white cursor-pointer uppercase tracking-widest text-xs"
                       >
                         <option value="upcoming">Upcoming</option>
                         <option value="ongoing">Ongoing</option>
                         <option value="completed">Completed</option>
                         <option value="cancelled">Cancelled</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Speakers</label>
                       <input
                         type="text"
                         name="speakers"
                         value={eventData.speakers}
                         onChange={handleChange}
                         className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                         placeholder="Comma separated names"
                       />
                    </div>
                 </div>
              </div>

              {/* Image Input */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <ImageIcon className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Event Image</span>
                 </div>
                 
                 <div className="flex flex-col md:flex-row gap-8 items-start">
                    {existingImage && !eventData.image && (
                       <div className="relative group w-full md:w-56 h-36 flex-shrink-0">
                          <img 
                             src={existingImage} 
                             alt="Current" 
                             className="w-full h-full object-cover rounded-[2rem] border-4 border-gray-50 shadow-xl"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-blue-600/90 backdrop-blur-sm p-2 rounded-b-[2rem]">
                             <p className="text-[9px] text-white font-black text-center uppercase tracking-tighter">Current Image</p>
                          </div>
                       </div>
                    )}
                    <div className="flex-1 w-full relative">
                       <div className="bg-gray-50 rounded-[2rem] p-10 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-all relative flex flex-col items-center justify-center text-center group">
                          <input
                             type="file"
                             name="image"
                             accept="image/*"
                             onChange={handleChange}
                             className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-2">
                             <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto text-blue-200 group-hover:text-blue-600 transition-colors">
                                <ImageIcon className="w-6 h-6" />
                             </div>
                             <p className="text-sm font-black text-gray-400 uppercase tracking-tighter">
                                {eventData.image ? eventData.image.name : "Upload New Image"}
                             </p>
                             <p className="text-xs text-gray-300 font-bold">MAX SIZE: 5MB</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Description */}
              <div className="space-y-8">
                 <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</span>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Description</label>
                    <textarea
                      name="description"
                      rows="7"
                      value={eventData.description}
                      onChange={handleChange}
                      required
                      className="w-full px-8 py-8 bg-gray-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700 leading-relaxed shadow-inner"
                      placeholder="About this event..."
                    />
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row gap-6">
                 <button
                   type="submit"
                   disabled={loading}
                   className="flex-1 py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em]"
                 >
                   {loading ? (
                     <>
                       <Loader2 className="w-6 h-6 animate-spin" />
                       SAVING CHANGES...
                     </>
                   ) : (
                     <>
                       <Save className="w-6 h-6" />
                       UPDATE EVENT
                     </>
                   )}
                 </button>
                 <button
                   type="button"
                   onClick={() => navigate(-1)}
                   className="px-12 py-6 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-gray-800 transition-all active:scale-95 text-sm uppercase tracking-[0.2em]"
                 >
                   CANCEL
                 </button>
              </div>
           </form>
        </div>


        
        <div className="mt-12 text-center">
           <div className="inline-flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Authorized Faculty Access Only</p>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
}


export default FacultyEditEventPage;
