import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft, User, Loader2, Sparkles, ClipboardCheck, Clock } from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import { useNavigate } from "react-router-dom";
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
    fetchCategories();
  }, []);

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

      const res = await axios.post("http://localhost:5000/api/faculty/eventcreate", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("New event published successfully!");
        navigate("/faculty/events");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FacultyLayout>
      <Toaster position="top-right" />
      
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
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Create New Event</h1>
          <p className="text-gray-500 font-medium text-lg">Publish a new event for your students</p>
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
                  <ClipboardCheck className="w-4 h-4" /> Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 text-lg placeholder:text-gray-300"
                  placeholder="Enter event name..."
                />
              </div>
            </div>

            {/* Date and Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                   <Calendar className="w-4 h-4" /> Event Date
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
                   <Clock className="w-4 h-4" /> Event Time
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
                   <MapPin className="w-4 h-4" /> Location
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Event Category</label>
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Max Participants</label>
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

            {/* Speakers */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <User className="w-4 h-4" /> Event Speakers
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

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                 <ImageIcon className="w-4 h-4" /> Event Poster
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
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Event Description</label>
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
                    PUBLISHING EVENT...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6" />
                    PUBLISH EVENT
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

export default FacultyAddEventPage;
