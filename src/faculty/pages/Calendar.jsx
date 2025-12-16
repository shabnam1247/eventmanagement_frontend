import React, { useState } from "react";
import { Calendar, Plus, X, Edit2, Trash2, Filter, Search } from "lucide-react";

const FacultyCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
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
    meeting: { color: "bg-blue-500", label: "Meeting" },
    deadline: { color: "bg-red-500", label: "Deadline" },
    class: { color: "bg-green-500", label: "Class" },
    workshop: { color: "bg-purple-500", label: "Workshop" },
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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
    setFormData({
      ...formData,
      date: selected.toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.date || !formData.time) {
      alert("Please fill required fields");
      return;
    }

    if (editingEvent) {
      setEvents(events.map(evt => 
        evt.id === editingEvent.id ? { ...formData, id: evt.id } : evt
      ));
      setEditingEvent(null);
    } else {
      setEvents([...events, { ...formData, id: Date.now() }]);
    }

    resetForm();
  };

  const handleEdit = (evt) => {
    setEditingEvent(evt);
    setFormData(evt);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(evt => evt.id !== id));
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
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    ).toISOString().split("T")[0];
    return events.filter(evt => evt.date === dateStr);
  };

  const renderCalendar = () => {
    const days = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push(<div key={`empty-${i}`} className="h-24 border"></div>);
    }

    for (let day = 1; day <= days; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      cells.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 border p-2 cursor-pointer hover:bg-gray-50 ${isToday ? 'bg-blue-50' : ''}`}
        >
          <div className="font-medium text-gray-900">{day}</div>
          <div className="space-y-1 mt-1">
            {dayEvents.slice(0, 2).map(evt => (
              <div
                key={evt.id}
                className={`${eventTypes[evt.type].color} text-white text-xs px-2 py-1 rounded truncate`}
              >
                {evt.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Faculty Calendar</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Event
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="all">All Events</option>
                {Object.entries(eventTypes).map(([key, type]) => (
                  <option key={key} value={key}>{type.label}</option>
                ))}
              </select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => changeMonth(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Previous
          </button>
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={() => changeMonth(1)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Next
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-7 border-b">
            {daysOfWeek.map(day => (
              <div key={day} className="p-3 font-medium text-gray-700 text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {renderCalendar()}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {filteredEvents
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map(evt => (
                <div key={evt.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 ${eventTypes[evt.type].color} rounded-full`}></div>
                    <div>
                      <div className="font-medium text-gray-900">{evt.title}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(evt.date).toLocaleDateString()} • {evt.time}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(evt)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(evt.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            {filteredEvents.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No events found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEvent ? "Edit Event" : "Add Event"}
              </h3>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Event description"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {Object.entries(eventTypes).map(([key, type]) => (
                    <option key={key} value={key}>{type.label}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSubmit}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {editingEvent ? "Update Event" : "Add Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyCalendar;