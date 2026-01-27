import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Plus, 
  X, 
  Edit2, 
  Eye, 
  Filter, 
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Layers,
  Activity,
  CalendarDays,
  MapPin,
  Loader2
} from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const FacultyCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const eventTypes = {
    'Webinar': { color: "bg-blue-500 shadow-blue-100", label: "Webinar" },
    'Workshop': { color: "bg-amber-500 shadow-amber-100", label: "Workshop" },
    'Seminar': { color: "bg-purple-500 shadow-purple-100", label: "Seminar" },
    'Conference': { color: "bg-emerald-500 shadow-emerald-100", label: "Conference" },
    'Guest Lecture': { color: "bg-rose-500 shadow-rose-100", label: "Guest Lecture" },
    'General': { color: "bg-gray-500 shadow-gray-100", label: "General" },
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users/events");
      if (response.data.success) {
        setEvents(response.data.events);
        
        // Extract unique categories for filter
        const uniqueCats = [...new Set(response.data.events.map(e => e.category))];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Failed to load events for calendar");
    } finally {
      setLoading(false);
    }
  };

  const daysInMonth = (date) => 
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const firstDayOfMonth = (date) => 
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (delta) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1)
    );
  };

  const getEventsForDate = (day) => {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dateStr = `${currentDate.getFullYear()}-${formattedMonth}-${formattedDay}`;
    
    return events.filter(evt => {
      const evtDate = new Date(evt.date).toISOString().split('T')[0];
      return evtDate === dateStr;
    });
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const cells = [];

    // Empty cells for previous month padding
    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-44 border-b border-r border-gray-100 bg-gray-50/10"></div>);
    }

    // Days in current month
    for (let day = 1; day <= days; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      cells.push(
        <div
          key={day}
          className={`h-44 border-b border-r border-gray-100 p-3 hover:bg-blue-50/20 transition-all relative group ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}
        >
          <div className={`text-xs font-black mb-2 ${isToday ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>{String(day).padStart(2, '0')}</div>
          <div className="space-y-1.5 overflow-y-auto max-h-[110px] no-scrollbar">
            {dayEvents.map(evt => (
              <div
                key={evt._id}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/faculty/event/${evt._id}`);
                }}
                className={`${eventTypes[evt.category]?.color || eventTypes['General'].color} text-white text-[9px] font-black px-2 py-1.5 rounded-lg truncate shadow-sm cursor-pointer hover:scale-105 active:scale-95 transition-all uppercase tracking-tighter`}
                title={evt.title}
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
    const matchesCategory = filterCategory === "all" || evt.category === filterCategory;
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <FacultyLayout>
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Live Calendar...</p>
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Events <span className="text-blue-600">Calendar</span></h1>
              <p className="text-gray-500 font-medium">Visualization of all scheduled events and academic milestones</p>
           </div>
           
           <button
            onClick={() => navigate("/faculty/addevent")}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all hover:-translate-y-1 active:scale-95"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            CREATE NEW EVENT
          </button>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col xl:flex-row gap-6">
           {/* Search & Filter Card */}
           <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/80 flex-1 flex flex-col md:flex-row gap-4 items-center">
              <div className="relative group flex-1 w-full">
                 <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                 <input
                   type="text"
                   placeholder="Search events by name..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                 />
              </div>
              <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all w-full md:w-auto">
                 <Filter className="w-4 h-4 text-gray-400" />
                 <select
                   value={filterCategory}
                   onChange={(e) => setFilterCategory(e.target.value)}
                   className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer min-w-[120px]"
                 >
                   <option value="all">All Categories</option>
                   {categories.map(cat => (
                     <option key={cat} value={cat}>{cat}</option>
                   ))}
                 </select>
              </div>
           </div>

           {/* Navigation Control Card */}
           <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/80 flex items-center gap-8 justify-between lg:min-w-[400px]">
              <button 
                onClick={() => changeMonth(-1)}
                className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              >
                 <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="text-center">
                 <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none mb-1">Timeline View</p>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase whitespace-nowrap">
                   {monthNames[currentDate.getMonth()]} <span className="text-blue-600">{currentDate.getFullYear()}</span>
                 </h2>
              </div>
              <button 
                onClick={() => changeMonth(1)}
                className="p-4 bg-gray-50 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
              >
                 <ChevronRight className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* The Grid Component */}
        <div className="bg-white rounded-[3.5rem] border-4 border-white shadow-2xl shadow-blue-50 overflow-hidden">
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

        {/* Bottom Panel: agenda & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
           {/* Daily Agenda / Upcoming List */}
           <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between px-4">
                 <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">Upcoming <span className="text-blue-600">Agenda</span></h3>
                 <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                   {filteredEvents.length} Events Found
                 </span>
              </div>
              
              <div className="space-y-4">
                 {filteredEvents
                   .sort((a, b) => new Date(a.date) - new Date(b.date))
                   .filter(evt => new Date(evt.date) >= new Date()) // Only future events
                   .slice(0, 6)
                   .map(evt => (
                     <div 
                      key={evt._id} 
                      onClick={() => navigate(`/faculty/event/${evt._id}`)}
                      className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-6 group hover:-translate-y-1 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-6">
                           <div className={`w-16 h-16 rounded-[1.5rem] ${eventTypes[evt.category]?.color || eventTypes['General'].color} flex flex-col items-center justify-center text-white shadow-lg shrink-0`}>
                              <span className="text-[9px] font-black uppercase opacity-60 leading-none mb-1">
                                {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                              </span>
                              <span className="text-2xl font-black leading-none">{new Date(evt.date).getDate()}</span>
                           </div>
                           <div className="space-y-1.5">
                              <h4 className="text-xl font-black text-gray-900 tracking-tight uppercase group-hover:text-blue-600 transition-colors line-clamp-1">{evt.title}</h4>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                    <Clock className="w-3.5 h-3.5" /> {evt.timing}
                                 </div>
                                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase">
                                    <MapPin className="w-3.5 h-3.5" /> {evt.venue}
                                 </div>
                                 <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${eventTypes[evt.category]?.color.replace('bg-', 'text-').replace(' shadow-', '')}`}>
                                    <Layers className="w-3.5 h-3.5" /> {evt.category}
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                           <button className="p-4 bg-gray-50 text-gray-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl transition-all shadow-sm">
                              <Eye className="w-5 h-5" />
                           </button>
                        </div>
                     </div>
                   ))}
              </div>
           </div>

           {/* Insights Card */}
           <div className="space-y-6">
              <div className="bg-gray-900 rounded-[3rem] p-10 text-white space-y-8 relative overflow-hidden shadow-2xl shadow-blue-200">
                 <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/30 blur-[80px] rounded-full -mr-20 -mt-20 animate-pulse"></div>
                 
                 <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mb-6">
                       <CalendarIcon className="w-6 h-6" />
                    </div>
                    <h4 className="text-2xl font-black tracking-tighter uppercase">Activity <span className="text-blue-400">Insights</span></h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Analytics for {monthNames[currentDate.getMonth()]}</p>
                 </div>
                 
                 <div className="space-y-8 relative z-10">
                    <div className="flex items-end gap-3">
                       <span className="text-5xl font-black tracking-tighter text-white">{events.length}</span>
                       <span className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Total Events</span>
                    </div>

                    <div className="space-y-6">
                       <Metric label="Scheduled Volume" value={82} color="bg-blue-500" />
                       <Metric label="Venue Occupancy" value={45} color="bg-rose-500" />
                       <Metric label="Global Outreach" value={12} color="bg-blue-200" />
                    </div>
                 </div>
              </div>

              {/* Tips Section */}
              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative group overflow-hidden shadow-xl shadow-blue-100 cursor-pointer" onClick={() => navigate("/faculty/events")}>
                 <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 <div className="flex items-center gap-4 relative z-10">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shrink-0">
                       <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                       <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Advanced View</p>
                       <h5 className="text-lg font-black tracking-tight uppercase">Manage all content</h5>
                    </div>
                 </div>
                 <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-widest">Go to list view</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

const Metric = ({ label, value, color }) => (
  <div className="space-y-2.5">
    <div className="flex justify-between items-center text-[10px] font-black tracking-widest uppercase">
       <span className="text-gray-500">{label}</span>
       <span className="text-white">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
       <div 
         className={`h-full ${color} transition-all duration-1000 ease-out`} 
         style={{ width: `${value}%` }}
       ></div>
    </div>
  </div>
);

export default FacultyCalendar;
