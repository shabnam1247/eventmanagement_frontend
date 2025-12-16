import React, { useState } from "react";
import { Search, Eye, Trash2, Download, Filter, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyHeader from "../components/FacultyHeader";

const FacultyRegistrationList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const registrations = [
    {
      id: 1,
      name: "John Doe",
      email: "john@gmail.com",
      event: "Tech Innovators Summit",
      date: "2025-11-10",
      status: "confirmed",
      regNo: "CS2025001"
    },
    {
      id: 2,
      name: "Aisha Khan",
      email: "aisha@gmail.com",
      event: "AI Workshop",
      date: "2025-11-12",
      status: "pending",
      regNo: "EC2025012"
    },
    {
      id: 3,
      name: "Rahul Mehta",
      email: "rahul@gmail.com",
      event: "Hackathon 2025",
      date: "2025-11-08",
      status: "cancelled",
      regNo: "ME2025023"
    },
  ];

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.event.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FacultyHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Registration List</h1>
          <p className="text-gray-600">View and manage all event registrations</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search registrations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">#</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Reg. No</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Event</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRegistrations.map((reg, index) => (
                  <tr key={reg.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-600">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">{reg.name}</td>
                    <td className="py-3 px-4 text-gray-600">{reg.regNo}</td>
                    <td className="py-3 px-4 text-gray-600">{reg.email}</td>
                    <td className="py-3 px-4 text-gray-900">{reg.event}</td>
                    <td className="py-3 px-4 text-gray-600">{reg.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reg.status)}`}>
                        {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
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
              Showing {filteredRegistrations.length} of {registrations.length} registrations
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

export default FacultyRegistrationList;