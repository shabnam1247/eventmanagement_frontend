import React, { useState } from "react";
import { Search, Plus, Calendar, MapPin, Users, Eye, Edit, Trash2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { useNavigate } from "react-router-dom";

const AdminEventPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate('/admin/addevent');
  };

  const events = [
    {
      id: 1,
      name: "Tech Conference 2024",
      date: "2024-12-15",
      location: "San Francisco, CA",
      attendees: 450,
      status: "upcoming",
      category: "Technology",
    },
    {
      id: 2,
      name: "Product Launch Event",
      date: "2024-11-20",
      location: "New York, NY",
      attendees: 200,
      status: "ongoing",
      category: "Business",
    },
    {
      id: 3,
      name: "Marketing Summit",
      date: "2024-11-05",
      location: "Austin, TX",
      attendees: 320,
      status: "completed",
      category: "Marketing",
    },
    {
      id: 4,
      name: "Developer Meetup",
      date: "2024-12-01",
      location: "Seattle, WA",
      attendees: 150,
      status: "upcoming",
      category: "Technology",
    },
    {
      id: 5,
      name: "Design Workshop",
      date: "2024-10-28",
      location: "Los Angeles, CA",
      attendees: 85,
      status: "completed",
      category: "Design",
    },
  ];

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-blue-100 text-blue-800";
      case "ongoing": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Management</h1>
          <p className="text-gray-600">Manage and monitor all events</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{events.length}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Upcoming</h3>
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {events.filter(e => e.status === "upcoming").length}
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Attendees</h3>
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {events.reduce((sum, e) => sum + e.attendees, 0)}
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Completed</h3>
              <Calendar className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {events.filter(e => e.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Event
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Event Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Location</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Attendees</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-medium">{event.name}</td>
                    <td className="py-3 px-4 text-gray-600">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {event.location}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        {event.attendees}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{event.category}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventPanel;