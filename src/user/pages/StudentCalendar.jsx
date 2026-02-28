import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Search, 
  Filter,
  Sparkles,
  ArrowRight,
  Loader2,
  CalendarDays,
  Target,
  Activity
} from 'lucide-react';
import Header from '../components/Header';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const StudentCalendar = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const categoryColors = {
    'Webinar': 'bg-blue-500',
    'Workshop': 'bg-amber-500',
    'Seminar': 'bg-purple-500',
    'Conference': 'bg-emerald-500',
    'Guest Lecture': 'bg-rose-500',
    'General': 'bg-gray-500',
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const generateGCalUrl = (event) => {
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description || `Join us for ${event.title}!`);
    const location = encodeURIComponent(event.venue || "Campus Hall");
    
    // Format dates for Google: YYYYMMDDTHHMMSSZ
    const date = new Date(evtDateToISO(event.date, event.timing));
    const startDate = date.toISOString().replace(/-|:|\.\d\d\d/g, "");
    
    // Default to 1 hour event
    const endDate = new Date(date.getTime() + 60 * 60 * 1000)
      .toISOString()
      .replace(/-|:|\.\d\d\d/g, "");

    return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${title}&details=${details}&location=${location}&dates=${startDate}/${endDate}`;
  };

  const evtDateToISO = (dateStr, timeStr) => {
    const baseDate = new Date(dateStr).toISOString().split('T')[0];
    const time = timeStr ? (timeStr.includes(':') ? timeStr : "10:00") : "10:00";
    return `${baseDate}T${time}:00`;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/users/events");
      if (response.data.success) {
        setEvents(response.data.events);
        const uniqueCats = [...new Set(response.data.events.map(e => e.category))];
        setCategories(uniqueCats);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast.error("Unable to load event calendar");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
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

  const filteredEvents = events.filter(evt => {
    const matchesCategory = filterCategory === "all" || evt.category === filterCategory;
    const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCalendar = () => {
    const days = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
        cells.push(<div key={`empty-${i}`} className="h-32 md:h-40 bg-gray-50/30 border-b border-r border-gray-100"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      cells.push(
        <div
          key={day}
          className={`h-32 md:h-40 border-b border-r border-gray-100 p-2 md:p-3 relative group transition-all duration-300 hover:bg-indigo-50/30 ${isToday ? 'bg-indigo-50/20' : 'bg-white'}`}
        >
          <div className={`text-xs font-bold mb-2 flex items-center justify-between ${isToday ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'}`}>
            <span>{String(day).padStart(2, '0')}</span>
            {isToday && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>}
          </div>
          
          <div className="space-y-1 overflow-y-auto max-h-[80px] md:max-h-[100px] no-scrollbar">
            {dayEvents.map(evt => (
              <div
                key={evt._id}
                onClick={() => navigate(`/eventdetails/${evt._id}`)}
                className={`${categoryColors[evt.category] || categoryColors['General']} text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded-md truncate cursor-pointer hover:scale-[1.03] transition-transform`}
                title={evt.title}
              >
                {evt.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return cells;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Academic Calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Header */}
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                     <CalendarIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-full">Official Timeline</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-black text-gray-950 tracking-tighter uppercase leading-none">
                  Academic <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent underline decoration-indigo-100 underline-offset-8">Calendar</span>
               </h1>
               <p className="text-gray-500 mt-6 max-w-lg font-medium leading-relaxed">Stay updated with all campus activities, workshops, and seminars. Plan your participation in advance.</p>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white p-3 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-indigo-100/20 flex items-center justify-between min-w-[320px] md:min-w-[400px]">
               <button onClick={handlePrevMonth} className="p-3 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all active:scale-90">
                  <ChevronLeft className="w-6 h-6" />
               </button>
               <div className="text-center px-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Current Period</p>
                  <h2 className="text-xl md:text-2xl font-black text-gray-950 uppercase tracking-tighter">
                    {monthNames[currentDate.getMonth()]} <span className="text-indigo-600">{currentDate.getFullYear()}</span>
                  </h2>
               </div>
               <button onClick={handleNextMonth} className="p-3 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-2xl transition-all active:scale-90">
                  <ChevronRight className="w-6 h-6" />
               </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
            {/* Main Calendar View */}
            <div className="lg:col-span-8 space-y-8">
               {/* Search & Filter Bar */}
               <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1 group">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-indigo-600 transition-colors" />
                     <input 
                        type="text" 
                        placeholder="Search events name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-50 transition-all font-bold text-gray-700 placeholder:text-gray-300"
                     />
                  </div>
                  <div className="flex items-center gap-2 px-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                     <Filter className="w-4 h-4 text-gray-400" />
                     <select 
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer min-w-[120px]"
                     >
                        <option value="all">Categories</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                     </select>
                  </div>
               </div>

               {/* Calendar Grid */}
               <div className="bg-white rounded-[3rem] border-4 border-white shadow-2xl shadow-indigo-100/30 overflow-hidden">
                  <div className="grid grid-cols-7 bg-indigo-600/5 border-b border-indigo-100">
                     {daysOfWeek.map(day => (
                        <div key={day} className="py-5 text-[10px] font-black text-indigo-400 text-center uppercase tracking-[0.2em]">{day}</div>
                     ))}
                  </div>
                  <div className="grid grid-cols-7 bg-white">
                     {renderCalendar()}
                  </div>
               </div>
            </div>

            {/* Sidebar Agenda */}
            <div className="lg:col-span-4 space-y-8 h-full">
               <div className="bg-white rounded-[3rem] p-8 border border-gray-100 shadow-xl shadow-indigo-100/20 flex flex-col h-full min-h-[600px]">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-gray-950 tracking-tighter uppercase italic">Day <span className="text-indigo-600">Agenda</span></h3>
                     <Activity className={`w-5 h-5 text-indigo-400 ${filteredEvents.length > 0 ? 'animate-pulse' : ''}`} />
                  </div>

                  <div className="space-y-5 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     {filteredEvents
                        .sort((a, b) => new Date(a.date) - new Date(b.date))
                        .filter(evt => new Date(evt.date) >= new Date()) // Only future events
                        .slice(0, 10)
                        .map(evt => (
                           <div 
                              key={evt._id} 
                              onClick={() => navigate(`/eventdetails/${evt._id}`)}
                              className="group p-5 bg-gray-50 hover:bg-indigo-600 rounded-[2rem] transition-all duration-300 cursor-pointer border border-transparent hover:border-indigo-400 shadow-sm hover:shadow-xl hover:shadow-indigo-200"
                           >
                              <div className="flex items-center gap-5">
                                 <div className={`w-14 h-14 rounded-2xl ${categoryColors[evt.category] || categoryColors['General']} shadow-lg flex flex-col items-center justify-center text-white shrink-0 transition-transform group-hover:scale-110`}>
                                    <span className="text-[8px] font-black uppercase opacity-60 leading-none mb-1">
                                       {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-xl font-black">{new Date(evt.date).getDate()}</span>
                                 </div>
                                 <div className="flex-1 overflow-hidden">
                                    <h4 className="text-base font-black text-gray-900 group-hover:text-white transition-colors uppercase tracking-tight line-clamp-1">{evt.title}</h4>
                                    <div className="flex items-center gap-3 mt-1.5 overflow-hidden">
                                       <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 group-hover:text-indigo-100 uppercase transition-colors shrink-0">
                                          <Clock className="w-3 h-3" /> {evt.timing}
                                       </span>
                                       <span className="flex items-center gap-1 text-[9px] font-bold text-gray-400 group-hover:text-indigo-100 uppercase transition-colors line-clamp-1">
                                          <MapPin className="w-3 h-3" /> {evt.venue}
                                       </span>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(generateGCalUrl(evt), '_blank');
                                      }}
                                      className="p-3 bg-indigo-50 group-hover:bg-white/20 text-indigo-600 group-hover:text-white rounded-2xl transition-all shadow-sm hover:scale-110 active:scale-95"
                                      title="Sync to Google Calendar"
                                    >
                                      <CalendarIcon className="w-4 h-4" />
                                    </button>
                                    <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                                 </div>
                              </div>
                           </div>
                        ))}
                     
                     {filteredEvents.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                           <CalendarDays className="w-16 h-16 text-gray-200" />
                           <p className="text-xs font-black text-gray-400 uppercase tracking-widest">No matching activities found for this period</p>
                        </div>
                     )}
                  </div>

                  {/* Highlights Footer */}
                  <div className="mt-8 pt-8 border-t border-gray-100">
                     <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 blur-2xl rounded-full -mr-10 -mt-10"></div>
                        <div className="flex items-center gap-3 mb-3 relative z-10">
                           <Sparkles className="w-5 h-5" />
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Monthly Stats</span>
                        </div>
                        <div className="flex items-center justify-between relative z-10">
                           <div>
                              <p className="text-3xl font-black tracking-tighter">{events.length}</p>
                              <p className="text-[9px] font-bold uppercase opacity-70">Events Listed</p>
                           </div>
                           <div className="text-right">
                              <p className="text-3xl font-black tracking-tighter">{categories.length}</p>
                              <p className="text-[9px] font-bold uppercase opacity-70">Categories</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default StudentCalendar;