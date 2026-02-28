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
  Clock, 
  Plus, 
  Trash2, 
  ListOrdered 
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

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

  // Event Schedule State
  const [schedule, setSchedule] = useState([]);
  const [newScheduleItem, setNewScheduleItem] = useState({ time: "", title: "" });

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
          
          // Load existing schedule
          if (event.eventScheduletime && Array.isArray(event.eventScheduletime)) {
            setSchedule(event.eventScheduletime);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        toast.error("Failed to load event details");
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

  // Schedule Management Functions
  const addScheduleItem = () => {
    if (newScheduleItem.time && newScheduleItem.title) {
      setSchedule([...schedule, { ...newScheduleItem }]);
      setNewScheduleItem({ time: "", title: "" });
    } else {
      toast.error("Please fill both time and session title");
    }
  };

  const removeScheduleItem = (index) => {
    setSchedule(schedule.filter((_, i) => i !== index));
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

      // Append schedule as JSON string
      if (schedule.length > 0) {
        formData.append("eventScheduletime", JSON.stringify(schedule));
      }

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
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      
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
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Update Event</h1>
          <p className="text-gray-500 font-medium text-lg">You are updating: <span className="text-blue-600 font-black">"{eventData.title}"</span></p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/20 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Main Details Section */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Event Title</label>
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
                   <Calendar className="w-3.5 h-3.5" /> Event Date
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
                   <Clock className="w-3.5 h-3.5" /> Event Time
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
                   <MapPin className="w-3.5 h-3.5" /> Location
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Specific Venue</label>
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Event Category</label>
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Max Participants</label>
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

            {/* Status and Speakers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Event Status</label>
                <select
                  name="status"
                  value={eventData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-black text-blue-600 cursor-pointer"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Active / Ongoing</option>
                  <option value="pastevents">Past / Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Speakers (Comma separated)</label>
                <input
                  type="text"
                  name="speakers"
                  value={eventData.speakers}
                  onChange={handleChange}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-700"
                  placeholder="e.g., John Doe, Jane Smith"
                />
              </div>
            </div>

            {/* ============ EVENT SCHEDULE SECTION ============ */}
            <div className="space-y-4 p-6 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-[2rem] border border-blue-100">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <ListOrdered className="w-4 h-4" /> Event Schedule (Timeline)
              </label>
              <p className="text-sm text-gray-500 -mt-2">Add or modify sessions and their scheduled times</p>
              
              {/* Schedule Display */}
              {schedule.length > 0 && (
                <div className="space-y-3 mb-4">
                  {schedule.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{item.title}</p>
                          <p className="text-sm text-blue-600 font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {item.time}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeScheduleItem(index)}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Schedule Item */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newScheduleItem.time}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, time: e.target.value })}
                  className="w-full sm:w-32 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="10:00 AM"
                />
                <input
                  type="text"
                  value={newScheduleItem.title}
                  onChange={(e) => setNewScheduleItem({ ...newScheduleItem, title: e.target.value })}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Session title (e.g., Introduction to MERN Stack)"
                />
                <button
                  type="button"
                  onClick={addScheduleItem}
                  className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              
              {schedule.length === 0 && (
                <p className="text-xs text-gray-400 italic text-center py-4">No sessions added yet. Add your event timeline above.</p>
              )}
            </div>
            {/* ============ END EVENT SCHEDULE ============ */}

            {/* Image Overlay */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                 <ImageIcon className="w-3.5 h-3.5" /> Event Image
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
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Event Description</label>
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
                    UPDATE EVENT
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
           <p className="text-xs font-bold uppercase tracking-widest">Faculty portal • Secure access</p>
        </div>
      </div>
    </FacultyLayout>
  );
}

export default FacultyEditEventPage;
