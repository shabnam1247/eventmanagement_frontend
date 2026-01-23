import React, { useState, useEffect } from "react";
import { Search, Eye, Trash2, Download, Filter, Loader2, UserCheck } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RegistrationList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/registrations");
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch registrations");
      toast.error("Failed to load registration data");
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.eventid?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reg.eventid?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming": return "bg-green-50 text-green-600 border-green-100";
      case "ongoing": return "bg-blue-50 text-blue-600 border-blue-100";
      case "pastevents": return "bg-gray-50 text-gray-600 border-gray-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="py-2">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Event Registrations</h1>
            <p className="text-gray-500 font-medium tracking-tight">Detailed log of all student sign-ups across all events</p>
          </div>
          
          <button className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 shadow-sm font-bold transition-all active:scale-95">
            <Download className="w-5 h-5" />
            EXPORT TO CSV
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student name, email, or event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                />
              </div>
              <div className="flex items-center gap-3">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-600 font-bold outline-none shadow-sm"
                >
                  <option value="all">Every Event Status</option>
                  <option value="upcoming">Upcoming Events</option>
                  <option value="ongoing">Active Events</option>
                  <option value="pastevents">Completed Events</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-400 font-medium tracking-tight italic">Gathering registration documents...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <p className="text-red-500 font-bold mb-4">{error}</p>
              <button 
                onClick={fetchRegistrations}
                className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-bold"
              >
                RETRY CONNECTION
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Information</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Target Event</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Enroll Date</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Event State</th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                         <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                             <UserCheck className="w-8 h-8 text-gray-200" />
                           </div>
                           <p className="text-gray-400 font-medium italic">No registrations found matching your filters.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg, index) => (
                      <tr key={reg._id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="py-4 px-6">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold shadow-sm">
                                 {reg.firstName?.charAt(0)}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                                  {reg.firstName} {reg.lastName}
                                </p>
                                <p className="text-xs text-gray-400 font-medium italic">{reg.email}</p>
                              </div>
                           </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-bold">
                          {reg.department}
                        </td>
                        <td className="py-4 px-6">
                           <p className="text-sm font-bold text-gray-800">{reg.eventid?.title || "N/A"}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">Date: {formatDate(reg.eventid?.date)}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {reg.registeredAt ? formatDate(reg.registeredAt) : formatDate(reg.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(reg.eventid?.status)}`}>
                            {reg.eventid?.status || "N/A"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all shadow-sm">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer Card */}
          <div className="p-6 bg-gray-50/30 border-t border-gray-50 italic">
            <p className="text-sm text-gray-500 font-medium">
              A total of <span className="text-blue-600 font-bold">{filteredRegistrations.length}</span> students are currently registered for upcoming activities.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegistrationList;