import React, { useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Image as ImageIcon, 
  ArrowLeft, 
  Sparkles, 
  Type, 
  Users, 
  FileText, 
  Layers,
  Send,
  Loader2,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function FacultyAddEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
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
    speakers: ""
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/categories");
        if (response.data.success) {
          setCategories(response.data.categories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
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
      Object.keys(eventData).forEach(key => {
        if (eventData[key] !== null && eventData[key] !== "") {
          formData.append(key, eventData[key]);
        }
      });

      // Get current faculty name as organizer
      const facultyData = JSON.parse(localStorage.getItem("facultyData"));
      if (facultyData) {
        formData.append("organizer", facultyData._id);
      }

      const response = await axios.post("http://localhost:5000/api/faculty/eventcreate", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Event added successfully!");
        navigate("/faculty/events");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error(error.response?.data?.message || "Failed to add event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacultyLayout>
      <Toaster position="top-right" />
      <div className="max-w-4xl mx-auto space-y-10 pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Events
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Add New <span className="text-blue-600">Event</span></h1>
              <p className="text-gray-500 font-medium tracking-tight">Fill in the details below to create a new event</p>
           </div>

           <div className="hidden md:block">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center shadow-xl shadow-blue-100/50">
                 <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
           </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-50/50 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/20 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            
            <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
               {/* Basic Details */}
               <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                     <Type className="w-4 h-4 text-blue-600" />
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

               {/* Asset & Personnel */}
               <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-50">
                     <ImageIcon className="w-4 h-4 text-blue-600" />
                     <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Visuals & Personnel</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Image</label>
                        <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-all relative flex flex-col items-center justify-center text-center group">
                           <input
                              type="file"
                              name="image"
                              accept="image/*"
                              onChange={handleChange}
                              className="absolute inset-0 opacity-0 cursor-pointer z-10"
                           />
                           <div className="space-y-2">
                              <ImageIcon className="w-8 h-8 text-blue-200 group-hover:text-blue-600 transition-colors mx-auto" />
                              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                 {eventData.image ? eventData.image.name : "Choose Poster"}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Event Speakers</label>
                        <textarea
                          name="speakers"
                          rows="4"
                          value={eventData.speakers}
                          onChange={handleChange}
                          className="w-full px-8 py-5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 resize-none"
                          placeholder="Comma separated names"
                        />
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
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Brief</label>
                     <textarea
                       name="description"
                       rows="6"
                       value={eventData.description}
                       onChange={handleChange}
                       required
                       className="w-full px-8 py-8 bg-gray-50 border-none rounded-[2.5rem] focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700 leading-relaxed"
                       placeholder="About this event..."
                     />
                  </div>
               </div>

               {/* Action Button */}
               <div className="pt-8 border-t border-gray-50">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-blue-600 text-white font-black rounded-[2rem] shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        SAVING EVENT...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6" />
                        CREATE EVENT
                      </>
                    )}
                  </button>
               </div>
            </form>
        </div>
      </div>
    </FacultyLayout>
  );
}

const Checkpoint = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{text}</span>
  </div>
);

export default FacultyAddEventPage;
