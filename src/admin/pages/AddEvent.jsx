import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft, User, Loader2, Sparkles, ClipboardCheck, Clock, Plus, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AddEventPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
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
    organizer: "",
    speakers: ""
  });
  const [eventSchedule, setEventSchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", title: "" });

  const handleAddScheduleItem = () => {
    if (newScheduleItem.time.trim() && newScheduleItem.title.trim()) {
      setEventSchedule([...eventSchedule, { ...newScheduleItem }]);
      setNewScheduleItem({ time: "", title: "" });
    } else {
      toast.error("Please enter both time and activity title");
    }
  };

  const handleRemoveScheduleItem = (index) => {
    setEventSchedule(eventSchedule.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchFaculties();
    fetchCategories();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/faculties");
      if (res.data.success) {
        setFaculties(res.data.faculties);
      }
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/categories");
      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

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
      if (eventData.organizer) {
        formData.append("organizer", eventData.organizer);
      }
      if (eventData.speakers) {
        formData.append("speakers", eventData.speakers);
      }
      if (eventData.image) {
        formData.append("image", eventData.image);
      }
      if (eventSchedule.length > 0) {
        formData.append("eventScheduletime", JSON.stringify(eventSchedule));
      }

      const res = await axios.post("http://localhost:5000/api/admin/eventcreate", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("New event published successfully!");
        navigate("/admin/events");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      
      <div className="py-2 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-bold group transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Return to Management
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 mb-6">
             <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create Global Event</h1>
          <p className="text-gray-500 font-medium text-lg">Launch a new experience for the student community</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50/30 rounded-full -ml-16 -mb-16 blur-3xl"></div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Main Details Section */}
            <div className="grid grid-cols-1 gap-8 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4" /> Event Branding Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 text-lg placeholder:text-gray-300"
                  placeholder="Enter a catchy event name..."
                />
              </div>
            </div>

            {/* Date and Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Calendar className="w-4 h-4" /> Launch Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={eventData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Operations Window
                </label>
                <input
                  type="text"
                  name="timing"
                  value={eventData.timing}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="e.g., 09:00 AM - 05:00 PM"
                />
              </div>
            </div>

            {/* Location and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <MapPin className="w-4 h-4" /> Campus Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="e.g., Block A, Main Campus"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Sparkles className="w-4 h-4" /> Specific Venue
                </label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="e.g., Seminar Hall II"
                />
              </div>
            </div>

            {/* Category and Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Category</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Select a Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Attendance Limit</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={eventData.maxParticipants}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Number of seats..."
                />
              </div>
            </div>

            {/* Organizer and Speakers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <User className="w-4 h-4" /> Event Lead / Organizer
                </label>
                <select
                  name="organizer"
                  value={eventData.organizer}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Assigned Faculty (Optional)</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <User className="w-4 h-4" /> Keynote Speakers
                </label>
                <input
                  type="text"
                  name="speakers"
                  value={eventData.speakers}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Comma separated list..."
                />
              </div>
            </div>

            {/* Event Schedule Timeline */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-4 h-4" /> Event Schedule Timeline
              </label>
              
              {/* Add New Schedule Item */}
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={newScheduleItem.time}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm"
                    placeholder="Time (e.g., 09:00 AM)"
                  />
                </div>
                <div className="flex-[2]">
                  <input
                    type="text"
                    value={newScheduleItem.title}
                    onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300 text-sm"
                    placeholder="Activity Title (e.g., Registration & Welcome)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddScheduleItem}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Schedule Items List */}
              {eventSchedule.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                    Schedule Items ({eventSchedule.length})
                  </p>
                  {eventSchedule.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{item.time}</span>
                        <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScheduleItem(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <ImageIcon className="w-4 h-4" /> Promotional Visual Overlay
              </label>
              <div className="group relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full px-6 py-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] focus:outline-none focus:border-blue-400 transition-all font-bold text-gray-400 text-center cursor-pointer hover:bg-white hover:border-blue-200"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none group-hover:scale-105 transition-transform">
                   <ImageIcon className="w-10 h-10 text-blue-200 mb-2" />
                   <p className="text-sm font-bold text-gray-400">{eventData.image ? eventData.image.name : "Drag & Drop cover image or click to browse"}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Extended Narration / Itinerary</label>
              <textarea
                name="description"
                rows="6"
                value={eventData.description}
                onChange={handleChange}
                required
                className="w-full px-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700 placeholder:text-gray-300 leading-relaxed"
                placeholder="What is this event about? Write a compelling story..."
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg lg:text-xl tracking-tighter"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    PUBLISHING ASSETS...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    PUBLISH GLOBAL EVENT
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}



export default AddEventPage;