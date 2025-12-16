import React from "react";
import { User, Mail, GraduationCap, Calendar, Award } from "lucide-react";
import Header from "../components/Header";

const StudentProfilePage = () => {
  const student = {
    name: "Safna K",
    email: "safna123@gmail.com",
    department: "Computer Science",
    year: "3rd Year",
    registerNo: "CS20230045",
    phone: "+91 98765 43210",
    events: [
      { id: 1, title: "Tech Innovators Summit", date: "Nov 15, 2025", status: "completed" },
      { id: 2, title: "AI & Robotics Workshop", date: "Oct 12, 2025", status: "completed" },
      { id: 3, title: "Open Mic Coding Challenge", date: "Aug 05, 2025", status: "completed" },
      { id: 4, title: "Cultural Fest 2025", date: "Feb 21, 2025", status: "registered" },
    ],
    stats: {
      totalEvents: 8,
      participated: 3,
      upcoming: 1
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">View and manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 mb-4">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <User className="w-16 h-16 text-blue-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-gray-600">{student.department}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{student.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{student.year} • {student.registerNo}</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Event Stats</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Events</span>
                  <span className="font-semibold text-gray-900">{student.stats.totalEvents}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Participated</span>
                  <span className="font-semibold text-green-600">{student.stats.participated}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Upcoming</span>
                  <span className="font-semibold text-blue-600">{student.stats.upcoming}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Events</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  View All Events
                </button>
              </div>

              {/* Events List */}
              <div className="space-y-4">
                {student.events.length > 0 ? (
                  student.events.map((event) => (
                    <div
                      key={event.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-gray-900">{event.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {event.status === 'completed' ? 'Completed' : 'Registered'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No events participated yet</p>
                    <p className="text-sm text-gray-400 mt-1">Register for events to see them here</p>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Update Profile
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;