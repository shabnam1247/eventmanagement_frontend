import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus, Trash2 } from 'lucide-react';
import Header from '../components/Header';

const StudentCalendar = () => {
  const [currentYear, setCurrentYear] = useState(2024);
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    '2024-11-27': { title: "Thanksgiving", description: "Thanksgiving Day celebration", icon: "🦃" },
    '2024-11-28': { title: "Black Friday", description: "Shopping day with deals", icon: "🛍️" },
    '2024-11-15': { title: "Tech Fest", description: "College tech festival", icon: "💻" },
  });

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDateKey = (day) => {
    const month = (currentMonth + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${currentYear}-${month}-${dayStr}`;
  };

  const hasEvent = (day) => {
    if (!day) return false;
    const dateKey = getDateKey(day);
    return events[dateKey] !== undefined;
  };

  const getEvent = (day) => {
    if (!day) return null;
    const dateKey = getDateKey(day);
    return events[dateKey];
  };

  const handleDeleteEvent = () => {
    if (selectedDate) {
      const dateKey = getDateKey(selectedDate);
      const newEvents = { ...events };
      delete newEvents[dateKey];
      setEvents(newEvents);
      setSelectedDate(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Academic Calendar</h1>
          <p className="text-gray-600">View and manage your events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {months[currentMonth]} {currentYear}
                  </h2>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add Event
                </button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    className={`min-h-20 p-2 border border-gray-100 rounded-lg cursor-pointer transition-colors ${
                      !day
                        ? 'bg-transparent'
                        : selectedDate === day
                        ? 'bg-blue-50 border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {day && (
                      <>
                        <div className="flex justify-between items-start">
                          <span className={`text-sm ${
                            selectedDate === day 
                              ? 'font-semibold text-blue-600' 
                              : 'text-gray-700'
                          }`}>
                            {day}
                          </span>
                          {hasEvent(day) && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        
                        {/* Event Preview */}
                        {hasEvent(day) && (
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs">{getEvent(day).icon}</span>
                              <span className="text-xs font-medium text-gray-700 truncate">
                                {getEvent(day).title}
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Event Details Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedDate 
                    ? `${months[currentMonth]} ${selectedDate}, ${currentYear}`
                    : 'Select a Date'
                  }
                </h2>
              </div>

              {selectedDate ? (
                getEvent(selectedDate) ? (
                  <div>
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{getEvent(selectedDate).icon}</span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getEvent(selectedDate).title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {getEvent(selectedDate).description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleDeleteEvent}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Event
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No events scheduled</p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Add Event
                    </button>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a date to view events</p>
                </div>
              )}

              {/* Upcoming Events */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {Object.entries(events)
                    .slice(0, 3)
                    .map(([date, event]) => (
                      <div key={date} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                        <span className="text-lg">{event.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{event.title}</p>
                          <p className="text-xs text-gray-500">{date}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;