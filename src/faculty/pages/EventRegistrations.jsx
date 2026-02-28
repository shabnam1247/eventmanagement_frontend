import React, { useState, useEffect } from "react";
import { 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  Filter, 
  UserCheck,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  Loader2,
  FileSpreadsheet,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  X,
  Building2,
  Mail,
  Phone,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast from "react-hot-toast";

const FacultyRegistrationList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");
  const [registrations, setRegistrations] = useState([]);
  const [stats, setStats] = useState({ total: 0, attended: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchRegistrations();
    fetchEvents();
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/faculty/registrations");
      if (response.data.success) {
        setRegistrations(response.data.registrations);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/events");
      if (response.data.success) {
        setEvents(response.data.events);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDelete = async (regId) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/api/faculty/registrations/${regId}`);
        if (response.data.success) {
          toast.success("Registration deleted");
          fetchRegistrations();
        }
      } catch (error) {
        toast.error("Failed to delete registration");
      }
    }
  };

  const exportToCSV = () => {
    setExporting(true);
    
    const dataToExport = filteredRegistrations.map(reg => ({
      "First Name": reg.firstName,
      "Last Name": reg.lastName,
      "Email": reg.email,
      "Phone": reg.phone,
      "Department": reg.department,
      "Year": reg.year,
      "Event": reg.eventid?.title || "N/A",
      "Event Date": reg.eventid?.date ? new Date(reg.eventid.date).toLocaleDateString() : "N/A",
      "Registered On": new Date(reg.registeredAt).toLocaleDateString(),
      "Attended": reg.attended ? "Yes" : "No",
      "Attendance Time": reg.attendedAt ? new Date(reg.attendedAt).toLocaleString() : "N/A"
    }));

    // Convert to CSV
    const headers = Object.keys(dataToExport[0] || {});
    const csvContent = [
      headers.join(","),
      ...dataToExport.map(row => 
        headers.map(header => `"${row[header] || ''}"`).join(",")
      )
    ].join("\n");

    // Download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Export complete!");
    setExporting(false);
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = 
      reg.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.eventid?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      (statusFilter === "attended" && reg.attended) ||
      (statusFilter === "pending" && !reg.attended);
    
    const matchesEvent = 
      eventFilter === "all" || 
      reg.eventid?._id === eventFilter;

    return matchesSearch && matchesStatus && matchesEvent;
  });

  const getStatusBadge = (attended) => {
    if (attended) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-100">
          <CheckCircle2 className="w-3 h-3" />
          Attended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-100">
        <Clock className="w-3 h-3" />
        Pending
      </span>
    );
  };

  return (
    <FacultyLayout>
      <div className="py-2">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Event Registrations</h1>
            <p className="text-gray-500 font-medium">Monitor registrations and track attendance across all events</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={fetchRegistrations}
              className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 flex items-center gap-2 font-semibold transition-all active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button 
              onClick={exportToCSV}
              disabled={exporting || filteredRegistrations.length === 0}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-100 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {exporting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileSpreadsheet className="w-4 h-4" />
              )}
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Users className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registrations</p>
              <p className="text-3xl font-black text-gray-900">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Checked In</p>
              <p className="text-3xl font-black text-green-600">{stats.attended}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Clock className="w-7 h-7 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
              <p className="text-3xl font-black text-amber-600">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or event..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-3 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
              />
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-gray-600 font-semibold outline-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="attended">Attended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              
              <select
                value={eventFilter}
                onChange={(e) => setEventFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 bg-white rounded-xl text-gray-600 font-semibold outline-none cursor-pointer max-w-[200px]"
              >
                <option value="all">All Events</option>
                {events.map(event => (
                  <option key={event._id} value={event._id}>{event.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Table Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-400 font-medium">Loading registrations...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Event</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Department</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Registered</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredRegistrations.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                            <UserCheck className="w-8 h-8 text-gray-200" />
                          </div>
                          <p className="text-gray-400 font-medium">No registrations found</p>
                          <p className="text-gray-300 text-sm">Try adjusting your search or filters</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRegistrations.map((reg) => (
                      <tr key={reg._id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                              {reg.firstName?.charAt(0)}{reg.lastName?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {reg.firstName} {reg.lastName}
                              </p>
                              <p className="text-xs text-gray-400 font-medium">{reg.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-gray-800">{reg.eventid?.title || "N/A"}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            <p className="text-[11px] text-gray-400 font-medium">
                              {reg.eventid?.date 
                                ? new Date(reg.eventid.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
                                : "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-gray-300" />
                            {reg.department}
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5">Year {reg.year}</p>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                          {new Date(reg.registeredAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-6">
                          {getStatusBadge(reg.attended)}
                          {reg.attended && reg.attendedAt && (
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(reg.attendedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-1">
                            <button 
                              onClick={() => setSelectedRegistration(reg)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(reg._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
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

          {/* Footer */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredRegistrations.length}</span> of <span className="font-bold">{stats.total}</span> registrations
            </p>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Registration Details</h3>
              <button 
                onClick={() => setSelectedRegistration(null)}
                className="p-2 bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {selectedRegistration.firstName?.charAt(0)}{selectedRegistration.lastName?.charAt(0)}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">
                    {selectedRegistration.firstName} {selectedRegistration.lastName}
                  </h4>
                  {getStatusBadge(selectedRegistration.attended)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Email</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRegistration.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRegistration.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Department & Year</p>
                    <p className="text-sm font-medium text-gray-800">{selectedRegistration.department} - Year {selectedRegistration.year}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-[10px] font-bold text-blue-400 uppercase">Event</p>
                    <p className="text-sm font-medium text-blue-800">{selectedRegistration.eventid?.title || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              {selectedRegistration.comments && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                  <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Comments</p>
                  <p className="text-sm text-amber-800">{selectedRegistration.comments}</p>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedRegistration(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedRegistration._id);
                    setSelectedRegistration(null);
                  }}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </FacultyLayout>
  );
};

export default FacultyRegistrationList;
