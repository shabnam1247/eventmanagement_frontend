import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  Users,
  TrendingUp,
  MessageSquare,
  Download,
  Filter,
} from "lucide-react";
import AdminHeader from "../components/AdminHeader";

const EventDashboard = () => {
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [dateRange, setDateRange] = useState("month");

  const events = [
    { id: 1, name: "Tech Fest 2024", date: "2024-11-20", registrations: 450, attended: 380, capacity: 500 },
    { id: 2, name: "Cultural Night", date: "2024-11-15", registrations: 320, attended: 295, capacity: 400 },
    { id: 3, name: "Workshop: AI/ML", date: "2024-11-10", registrations: 150, attended: 142, capacity: 150 },
  ];

  const registrationTrend = [
    { date: "Week 1", registrations: 85, attendance: 78 },
    { date: "Week 2", registrations: 120, attendance: 110 },
    { date: "Week 3", registrations: 150, attendance: 142 },
    { date: "Week 4", registrations: 200, attendance: 185 },
  ];

  const eventCategories = [
    { name: "Technical", value: 35, color: "#3b82f6" },
    { name: "Cultural", value: 30, color: "#8b5cf6" },
    { name: "Sports", value: 20, color: "#10b981" },
    { name: "Workshops", value: 15, color: "#f59e0b" },
  ];

  const totalRegistrations = events.reduce((s, e) => s + e.registrations, 0);
  const totalAttendance = events.reduce((s, e) => s + e.attended, 0);
  const avgAttendanceRate = ((totalAttendance / totalRegistrations) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">Event performance and insights</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Events</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{events.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{totalRegistrations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgAttendanceRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">4.2/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Registration Trend */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Registration Trend</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={registrationTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Registrations"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Attendance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Event Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Event Categories</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventCategories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {eventCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Recent Events Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Event Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Registrations</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Attended</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.map((event) => {
                  const rate = ((event.attended / event.registrations) * 100).toFixed(1);
                  return (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{event.name}</td>
                      <td className="py-3 px-4 text-gray-600">{event.date}</td>
                      <td className="py-3 px-4 text-gray-600">{event.registrations}</td>
                      <td className="py-3 px-4 text-gray-600">{event.attended}</td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          rate >= 90 ? "bg-green-100 text-green-800" :
                          rate >= 80 ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {rate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDashboard;