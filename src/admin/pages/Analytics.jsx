import React, { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  TrendingUp,
  Activity,
  UserCheck
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import toast from 'react-hot-toast';
import StatCard from '../components/Statscard';

const EventDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    pastEvents: 0,
    totalStudents: 0,
    totalFaculties: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    totalCategories: 0,
    eventCategories: [],
    latestRegistrations: [],
    popularEvents: [],
    totalAttendance: 0,
    avgAttendanceRate: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const token = localStorage.getItem("adminToken");

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setDashboard(response.data.stats);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const {
    totalEvents,
    upcomingEvents,
    pastEvents,
    totalUsers,
    totalRegistrations,
    totalAttendance,
    avgAttendanceRate,
    eventCategories,
    latestRegistrations,
    popularEvents
  } = dashboard;

  return (
    <AdminLayout>
      <div className="py-2">
        <h1 className="text-3xl font-bold mb-6">Overview</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Events"
            value={totalEvents || 0}
            icon={<Calendar className="w-8 h-8 text-blue-500" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Total Registrations"
            value={totalRegistrations || 0}
            icon={<Users className="w-8 h-8 text-green-500" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Total Attendance"
            value={totalAttendance || 0}
            icon={<UserCheck className="w-8 h-8 text-purple-500" />}
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Attendance Rate"
            value={`${avgAttendanceRate || 0}%`}
            icon={<TrendingUp className="w-8 h-8 text-orange-500" />}
            bgColor="bg-orange-50"
          />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Upcoming Events"
            value={upcomingEvents || 0}
            icon={<Activity className="w-6 h-6 text-indigo-500" />}
            bgColor="bg-indigo-50"
          />
          <StatCard
            title="Past Events"
            value={pastEvents || 0}
            icon={<Calendar className="w-6 h-6 text-gray-500" />}
            bgColor="bg-gray-50"
          />
          <StatCard
            title="Total Users"
            value={totalUsers || 0}
            icon={<Users className="w-6 h-6 text-pink-500" />}
            bgColor="bg-pink-50"
          />
        </div>

        {/* Events by Category & Popular Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Events by Category */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 font-sans">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Events by Category</h2>
            <div className="space-y-3">
              {eventCategories && eventCategories.length > 0 ? (
                eventCategories.map((cat, index) => (
                  <div key={index} className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 transition-colors group">
                    <span className="font-medium capitalize text-gray-600 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-wide">{cat._id || 'Uncategorized'}</span>
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                      {cat.count}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No category data available</p>
              )}
            </div>
          </div>

          {/* Popular Events */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Top Popular Events</h2>
            <div className="space-y-3">
              {popularEvents && popularEvents.length > 0 ? (
                popularEvents.map((event, index) => (
                  <div key={event._id} className="border-b border-gray-50 pb-3 last:border-0 hover:bg-gray-50 p-3 rounded-xl transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{event.title}</p>
                        <p className="text-xs text-gray-400 font-medium">Rank #{index + 1} • Top Engagement</p>
                      </div>
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">
                        {event.regCount} registrations
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">No popular events yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Recent Registrations</h2>
            <button className="text-blue-600 text-sm font-bold hover:text-blue-700 transition-colors tracking-tight">VIEW ALL DASHBOARD &rarr;</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Event</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {latestRegistrations && latestRegistrations.length > 0 ? (
                  latestRegistrations.map((reg) => (
                    <tr key={reg._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-blue-100">
                            {reg.userid?.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 leading-tight">{reg.userid?.name || 'Unknown User'}</p>
                            <p className="text-xs text-gray-400 font-medium">{reg.userid?.email || 'No Email'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-semibold">
                        {reg.eventid?.title || 'Unknown Event'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                        {reg.registeredAt ? new Date(reg.registeredAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-50">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400 italic">
                      No recent registrations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EventDashboard;