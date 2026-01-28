import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Image as ImageIcon, ArrowLeft, User, Loader2, Info, Edit3, Save, Clock, Plus, Trash2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function EditEventPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [faculties, setFaculties] = useState([]);
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
    speakers: "",
    status: "upcoming"
  });
  
  const [existingImage, setExistingImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [eventSchedule, setEventSchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", title: "" });

  const handleAddScheduleItem = () => {
    if (newScheduleItem.time.trim() && newScheduleItem.title.trim()) {
      setEventSchedule([...eventSchedule, { ...newScheduleItem }]);
      setNewScheduleItem({ time: "", title: "" });
    }
  };

  const handleRemoveScheduleItem = (index) => {
    setEventSchedule(eventSchedule.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const facRes = await axios.get("http://localhost:5000/api/admin/faculties");
        if (facRes.data.success) {
          setFaculties(facRes.data.faculties);
        }

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
            organizer: event.organizer?._id || event.organizer || "",
            speakers: event.speakers ? (Array.isArray(event.speakers) ? event.speakers.join(', ') : event.speakers) : "",
            status: event.status || "upcoming"
          });
          setExistingImage(event.image || "");
          setEventSchedule(event.eventScheduletime || []);
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load event details");
        navigate("/admin/events");
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

      const res = await axios.put(`http://localhost:5000/api/admin/eventedit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (res.data.success) {
        toast.success("Event updated successfully!");
        navigate("/admin/events");
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
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

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
          Cancel Editing
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 mb-6">
             <Edit3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Modify Event Instance</h1>
          <p className="text-gray-500 font-medium text-lg">You are updating: <span className="text-blue-600 font-black">"{eventData.title}"</span></p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Main Details Section */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Master Title</label>
              <input
                type="text"
                name="title"
                value={eventData.title}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 text-lg"
                placeholder="Enter event title"
              />
            </div>

            {/* Date and Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Calendar className="w-3.5 h-3.5" /> Scheduled Date
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Edit3 className="w-3.5 h-3.5 invisible" /> Active Window (Time)
                </label>
                <input
                  type="text"
                  name="timing"
                  value={eventData.timing}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="e.g., 10:00 AM - 4:00 PM"
                />
              </div>
            </div>

            {/* Location and Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <MapPin className="w-3.5 h-3.5" /> Primary Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={eventData.location}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="Enter location"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Specific Room/Hall</label>
                <input
                  type="text"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="e.g., Main Auditorium"
                />
              </div>
            </div>

            {/* Category and Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Global Classification</label>
                <select
                  name="category"
                  value={eventData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Attendee Limit</label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={eventData.maxParticipants}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="Enter max seats"
                />
              </div>
            </div>

            {/* Status and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Publication Status</label>
                <select
                  name="status"
                  value={eventData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-black text-blue-600 cursor-pointer"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Active / Ongoing</option>
                  <option value="completed">Past / Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <User className="w-3.5 h-3.5" /> Assigned Faculty Lead
                </label>
                <select
                  name="organizer"
                  value={eventData.organizer}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Select Organizer (Optional)</option>
                  {faculties.map((faculty) => (
                    <option key={faculty._id} value={faculty._id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Speakers */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Speakers (Comma separated list)</label>
              <input
                type="text"
                name="speakers"
                value={eventData.speakers}
                onChange={handleChange}
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-700"
                placeholder="e.g., John Doe, Jane Smith"
              />
            </div>

            {/* Event Schedule Timeline */}
            <div className="space-y-4">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
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
                    placeholder="Activity Title"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddScheduleItem}
                  className="px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 font-bold text-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  Add Slot
                </button>
              </div>

              {/* Schedule Items List */}
              {eventSchedule.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 border border-gray-100">
                  {eventSchedule.map((item, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 group hover:border-blue-200 transition-all"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">{item.time}</span>
                        <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
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

            {/* Image Overlay */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                 <ImageIcon className="w-3.5 h-3.5" /> Media Asset (Thumbnail)
              </label>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {existingImage && !eventData.image && (
                  <div className="relative group w-full md:w-48 h-32 flex-shrink-0">
                    <img 
                      src={existingImage} 
                      alt="Current" 
                      className="w-full h-full object-cover rounded-2xl border border-gray-100 shadow-sm"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-2 rounded-b-2xl">
                       <p className="text-[10px] text-white font-black text-center uppercase tracking-tighter">Current Live Image</p>
                    </div>
                  </div>
                )}
                <div className="flex-1 w-full bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200 hover:border-blue-400 transition-all relative">
                   <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <div className="text-center">
                     <ImageIcon className="w-10 h-10 text-blue-200 mx-auto mb-2" />
                     <p className="text-sm font-bold text-gray-400">
                       {eventData.image ? eventData.image.name : "Replace existing image or drag here"}
                     </p>
                     <p className="text-[10px] text-gray-300 font-medium italic mt-2">Maximum file size: 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Final Narration */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Event Narration / Mission</label>
              <textarea
                name="description"
                rows="6"
                value={eventData.description}
                onChange={handleChange}
                required
                className="w-full px-6 py-6 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all font-medium text-gray-700 leading-relaxed"
                placeholder="Update the event story..."
              />
            </div>

            {/* Form Footer */}
            <div className="pt-6 border-t border-gray-50 flex flex-col md:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-5 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    SYNCING CHANGES...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6" />
                    UPDATE GLOBAL EVENT
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-5 bg-gray-50 text-gray-500 font-bold rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-lg"
              >
                DISCARD
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-12 text-center text-gray-300 flex items-center justify-center gap-2">
           <Info className="w-4 h-4" />
           <p className="text-xs font-bold uppercase tracking-widest">Administrator override portal • Secure access</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default EditEventPage;
