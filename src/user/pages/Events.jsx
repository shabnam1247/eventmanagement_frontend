import React, { useState } from "react";
import { 
  Search, 
  Calendar, 
  MapPin, 
  Filter, 
  ChevronDown, 
  Users,
  Award,
  Music,
  BookOpen,
  Trophy,
  Sparkles,
  Eye
} from "lucide-react";
import Header from "../components/Header";
import image1 from "../../assets/eventimage1.jpg"
import { useNavigate } from "react-router-dom";

const eventsData = [
  {
    id: 1,
    title: "Tech Symposium 2025",
    date: "2025-11-05",
    time: "9:00 AM - 5:00 PM",
    venue: "Auditorium Block A",
    category: "upcoming",
    type: "tech",
    image: image1,
    description: "A national-level tech fest showcasing innovation and research.",
    seats: 45,
    totalSeats: 200,
    registered: 155
  },
  {
    id: 2,
    title: "Cultural Fest",
    date: "2025-11-12",
    time: "6:00 PM - 10:00 PM",
    venue: "Open Stage",
    category: "upcoming",
    type: "cultural",
    image: image1,
    description: "Dance, music, and cultural events from all departments.",
    seats: 120,
    totalSeats: 300,
    registered: 180
  },
  {
    id: 3,
    title: "Annual Quiz Competition",
    date: "2025-12-22",
    time: "2:00 PM - 6:00 PM",
    venue: "Seminar Hall",
    category: "upcoming",
    type: "academic",
    image: image1,
    description: "Annual inter-departmental quiz competition.",
    seats: 30,
    totalSeats: 100,
    registered: 70
  },
  {
    id: 4,
    title: "Sports Meet",
    date: "2025-09-22",
    time: "8:00 AM - 6:00 PM",
    venue: "College Ground",
    category: "past",
    type: "sports",
    image: image1,
    description: "Annual inter-departmental sports competition.",
    seats: 0,
    totalSeats: 500,
    registered: 500
  },
  {
    id: 5,
    title: "Union Inauguration",
    date: "2025-09-27",
    time: "4:00 PM - 8:00 PM",
    venue: "College Auditorium",
    category: "past",
    type: "cultural",
    image: image1,
    description: "Inauguration, dance, music from all departments.",
    seats: 0,
    totalSeats: 400,
    registered: 400
  },
  {
    id: 6,
    title: "Seminar on AI & ML",
    date: "2025-10-15",
    time: "10:00 AM - 4:00 PM",
    venue: "Conference Hall",
    category: "upcoming",
    type: "tech",
    image: image1,
    description: "Machine learning, internship, certification.",
    seats: 86,
    totalSeats: 150,
    registered: 64
  },
  {
    id: 7,
    title: "Graduation Ceremony",
    date: "2025-12-07",
    time: "3:00 PM - 7:00 PM",
    venue: "Main Auditorium",
    category: "past",
    type: "academic",
    image: image1,
    description: "An inspiring event celebrating graduates' hard work and accomplishments.",
    seats: 0,
    totalSeats: 600,
    registered: 600
  },
];

const typeIcons = {
  tech: <Sparkles className="w-4 h-4" />,
  cultural: <Music className="w-4 h-4" />,
  academic: <BookOpen className="w-4 h-4" />,
  sports: <Trophy className="w-4 h-4" />
};

const EventPage = () => {
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const navigate = useNavigate();

  const handleViewMore = (id) => {
    navigate(`/eventdetails/${id}`);
  }

  const handleRegister = (id) => {
    navigate(`/register?event=${id}`);
  }

  const filteredEvents = eventsData.filter((event) => {
    const matchesCategory = filter === "all" || event.category === filter;
    const matchesType = typeFilter === "all" || event.type === typeFilter;
    const matchesSearch = 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesType && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "date") return new Date(a.date) - new Date(b.date);
    if (sortBy === "seats") return a.seats - b.seats;
    return 0;
  });

  const categories = [
    { id: "all", name: "All Events", count: eventsData.length },
    { id: "upcoming", name: "Upcoming", count: eventsData.filter(e => e.category === "upcoming").length },
    { id: "past", name: "Past Events", count: eventsData.filter(e => e.category === "past").length }
  ];

  const eventTypes = [
    { id: "all", name: "All Types", icon: <Filter className="w-4 h-4" /> },
    { id: "tech", name: "Tech", icon: typeIcons.tech },
    { id: "cultural", name: "Cultural", icon: typeIcons.cultural },
    { id: "academic", name: "Academic", icon: typeIcons.academic },
    { id: "sports", name: "Sports", icon: typeIcons.sports }
  ];

  const getStatusColor = (category) => {
    return category === "upcoming" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
  };

  const getStatusText = (category) => {
    return category === "upcoming" ? "Upcoming" : "Completed";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Discover Campus Events
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Explore, register, and participate in exciting college events
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search events by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Category Filters */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Status</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setFilter(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    filter === cat.id
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-blue-300"
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 text-sm opacity-80">
                    ({cat.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Type Filters */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by Type</h3>
            <div className="flex flex-wrap gap-2">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setTypeFilter(type.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    typeFilter === type.id
                      ? "bg-purple-600 text-white shadow-md"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-purple-300"
                  }`}
                >
                  {type.icon}
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="lg:w-64">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                <option value="date">Date (Soonest First)</option>
                <option value="seats">Available Seats</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Event Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.category)}`}>
                        {getStatusText(event.category)}
                      </span>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {typeIcons[event.type]}
                      <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">
                        {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Event Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="text-sm">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-red-500" />
                        <span className="text-sm">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-green-500" />
                        <span className="text-sm">
                          {event.registered} registered • {event.seats} seats available
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Registration Progress</span>
                        <span>{Math.round((event.registered / event.totalSeats) * 100)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(event.registered / event.totalSeats) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleViewMore(event.id)}
                        className="flex-1 py-2.5 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      {event.category === "upcoming" && event.seats > 0 ? (
                        <button
                          onClick={() => handleRegister(event.id)}
                          className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:shadow-md transition-all"
                        >
                          Register Now
                        </button>
                      ) : (
                        <button
                          disabled
                          className="flex-1 py-2.5 bg-gray-300 text-gray-500 font-medium rounded-lg cursor-not-allowed"
                        >
                          Registration Closed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your filters or search term to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      
    </div>
  );
};

export default EventPage;