import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  Edit2, 
  Trash2, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  Activity,
  CalendarDays
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import toast from "react-hot-toast";

const FacultyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([
    { id: 1, title: "Mission Alignment: Tech Fest", date: "2024-11-20", time: "10:00", type: "meeting", description: "Finalizing coordinates for the upcoming tech expo." },
    { id: 2, title: "Kinetic Workshop: AI/ML", date: "2024-11-15", time: "14:00", type: "workshop", description: "Intensive training module on neural networks." },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "meeting",
  });

  const eventTypes = {
    meeting: { color: "bg-blue-600 shadow-blue-100", label: "Meeting", ring: "ring-blue-500" },
    deadline: { color: "bg-rose-600 shadow-rose-100", label: "Deadline", ring: "ring-rose-500" },
    class: { color: "bg-emerald-600 shadow-emerald-100", label: "Class", ring: "ring-emerald-500" },
    workshop: { color: "bg-amber-600 shadow-amber-100", label: "Workshop", ring: "ring-amber-500" },
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const daysInMonth = (date) => 
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date) => 
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (delta) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
    );
  };

  const handleDateClick = (day) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    const dateStr = selected.toISOString().split("T")[0];
    setFormData({
      ...formData,
      date: dateStr,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingEvent) {
      setEvents(events.map(evt => 
        evt.id === editingEvent.id ? { ...formData, id: evt.id } : evt
      ));
      toast.success("Event updated successfully!");
      setEditingEvent(null);
    } else {
      setEvents([...events, { ...formData, id: Date.now() }]);
      toast.success("Event added to calendar!");
    }

    resetForm();
  };

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setFormData(evt);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter(evt => evt.id !== id));
      toast.success("Event removed successfully.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "meeting",
    });
    setShowModal(false);
    setEditingEvent(null);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(evt => evt.date === dateStr);
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const cells = [];

    // Empty cells for previous month padding
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-40 border-b border-r border-gray-100 bg-gray-50/10"></div>);
    }

    // Days in current month
    for (let day = 1; day <= days; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      cells.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-40 border-b border-r border-gray-100 p-3 cursor-pointer hover:bg-blue-50/20 transition-all relative group ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}
        >
          <div className={`text-xs font-black mb-2 ${isToday ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>{String(day).padStart(2, '0')}</div>
          <div className="space-y-1 overflow-y-auto max-h-[100px] no-scrollbar">
            {dayEvents.map(evt => (
              <div
                key={evt.id}
                className={`${eventTypes[evt.type].color} text-white text-[9px] font-black px-2 py-1.5 rounded-lg truncate shadow-sm uppercase tracking-tighter`}
              >
                {evt.title}
              </div>
            ))}
          </div>
          {isToday && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
               <Activity className="w-2.5 h-2.5 text-blue-500 animate-pulse" />
               <span className="text-[8px] font-black text-blue-500 uppercase">Today</span>
            </div>
          )}
        </div>
      );
    }

    return cells;
  };

  const filteredEvents = events.filter(evt => {
    const matchesType = filterType === "all" || evt.type === filterType;
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <FacultyLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Events <span className="text-blue-600">Calendar</span></h1>
              <p className="text-gray-500 font-medium">Keep track of all your upcoming events, meetings, and academic milestones</p>
           </div>
           
           <button
            onClick={() => setShowModal(true)}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            ADD NEW EVENT
          </button>
        </div>

        {/* Search & Navigation */}
        <div className="flex flex-col lg:flex-row gap-6">
           {/* Search Card */}
           <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/80 flex-1 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative group flex-1">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                 <input
                   type="text"
                   placeholder="Search for events..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                 />
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                 <Filter className="w-4 h-4 text-gray-400" />
                 <select
                   value={filterType}
                   onChange={(e) => setFilterType(e.target.value)}
                   className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer"
                 >
                   <option value="all">All Types</option>
                   {Object.entries(eventTypes).map(([key, type]) => (
                     <option key={key} value={key}>{type.label}</option>
                   ))}
                 </select>
              </div>
           </div>

           {/* Month Navigator */}
           <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/80 flex items-center gap-8 justify-between">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
              >
                 <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-center">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Active View</p>
                 <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">
                   {monthNames[currentDate.getMonth()]} <span className="text-blue-600">{currentDate.getFullYear()}</span>
                 </h2>
              </div>
              <button 
                onClick={() => changeMonth(1)}
                className="p-3 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all active:scale-90"
              >
                 <ChevronRight className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* calendar Container */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden">
           <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/50">
              {daysOfWeek.map(day => (
                <div key={day} className="py-6 font-black text-[10px] text-gray-400 text-center tracking-[0.2em]">
                   {day}
                </div>
              ))}
           </div>
           <div className="grid grid-cols-7 bg-white">
              {renderCalendar()}
           </div>
        </div>

        {/* list View Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Event list */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-lg font-black text-gray-900 tracking-tight uppercase">Upcoming <span className="text-blue-600">Events</span></h3>
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Events: {filteredEvents.length}</span>
              </div>
              
              <div className="space-y-4">
                 {filteredEvents
                   .sort((a, b) => new Date(a.date) - new Date(b.date))
                   .slice(0, 5)
                   .map(evt => (
                     <div key={evt.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex items-center justify-between group hover:-translate-y-1 transition-all">
                        <div className="flex items-center gap-6">
                           <div className={`w-16 h-16 rounded-2xl ${eventTypes[evt.type].color} flex flex-col items-center justify-center text-white shadow-lg`}>
                              <span className="text-[9px] font-black uppercase opacity-60 leading-none mb-1">
                                {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-xl font-black leading-none">{evt.date.split('-')[2]}</span>
                           </div>
                           <div>
                              <h4 className="text-lg font-black text-gray-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors">{evt.title}</h4>
                              <div className="flex items-center gap-4 mt-2">
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                                    <Clock className="w-3.5 h-3.5" /> {evt.time}
                                 </div>
                                 <div className="w-1 h-1 rounded-full bg-gray-200"></div>
                                 <div className="flex items-center gap-1 text-[10px] font-black text-blue-400 uppercase">
                                    <Layers className="w-3.5 h-3.5" /> {eventTypes[evt.type].label}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleEdit(evt)} className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg rounded-xl transition-all active:scale-90">
                              <Edit2 className="w-4 h-4" />
                           </button>
                           <button onClick={() => handleDelete(evt.id)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-lg rounded-xl transition-all active:scale-90">
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                   ))}
                 {filteredEvents.length === 0 && (
                   <div className="bg-white/50 rounded-[2rem] border-2 border-dashed border-gray-100 py-16 text-center">
                       <CalendarDays className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                       <p className="text-xs font-black text-gray-300 uppercase tracking-widest">No events found in this period</p>
                   </div>
                 )}
              </div>
           </div>

           {/* Stats Sidebar */}
           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-blue-100">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                 <div>
                    <h4 className="text-xl font-black tracking-tighter uppercase relative z-10">Calendar <span className="text-blue-400">Stats</span></h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 relative z-10">System Status: Active</p>
                 </div>
                 
                 <div className="space-y-6 relative z-10">
                    <StatusProgress label="Schedule Completion" value={98} color="bg-blue-500" />
                    <StatusProgress label="Event Density" value={65} color="bg-amber-500" />
                    <StatusProgress label="Engagement Rate" value={22} color="bg-emerald-500" />
                 </div>
                 
                 <div className="bg-white/5 rounded-2xl p-4 backdrop-blur-sm relative z-10">
                    <p className="text-[10px] font-bold text-gray-300 leading-relaxed italic">
                       "Organizing events is the first step towards academic excellence and community engagement."
                    </p>
                 </div>
              </div>

              <div className="bg-blue-50 rounded-[2rem] p-6 flex items-center gap-4 border border-blue-100">
                 <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Helpful Tip</p>
                    <p className="text-[9px] font-bold text-blue-400 uppercase mt-0.5">Click any date to add a new event!</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[60] animate-in fade-in transition-all">
          <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] overflow-hidden scale-in animate-in zoom-in-[0.95]">
            <div className="flex justify-between items-center p-8 border-b border-gray-50">
               <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">
                    {editingEvent ? "Edit" : "New"} <span className="text-blue-600">Event</span>
                  </h3>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Provide event details and schedule</p>
               </div>
               <button onClick={resetForm} className="p-4 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                 <X className="w-6 h-6" />
               </button>
            </div>
            
            <div className="p-8 space-y-8">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                    placeholder="Enter event name"
                  />
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date</label>
                     <input
                       type="date"
                       value={formData.date}
                       onChange={(e) => setFormData({...formData, date: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Time</label>
                     <input
                       type="time"
                       value={formData.time}
                       onChange={(e) => setFormData({...formData, time: e.target.value})}
                       className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                     {Object.entries(eventTypes).map(([key, type]) => (
                        <button
                          key={key}
                          onClick={() => setFormData({...formData, type: key})}
                          className={`
                            p-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase
                            ${formData.type === key 
                              ? `bg-gray-900 border-gray-900 text-white shadow-xl scale-105` 
                              : `bg-white border-gray-100 text-gray-400 hover:border-blue-200`}
                          `}
                        >
                           {type.label}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300 resize-none"
                    rows="3"
                    placeholder="Provide some details..."
                  />
               </div>

               <button
                 onClick={handleSubmit}
                 className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all"
               >
                 {editingEvent ? "Save Changes" : "Create Event"}
               </button>
            </div>
          </div>
        </div>
      )}
    </FacultyLayout>
  );
};

const StatusProgress = ({ label, value, color }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
       <span className="text-gray-400">{label}</span>
       <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
       <div 
         className={`h-full ${color} transition-all duration-1000`} 
         style={{ width: `${value}%` }}
       ></div>
    </div>
  </div>
);


export default FacultyCalendar;
