import React, { useState } from "react";
import { 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  Filter, 
  UserCheck,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";

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
      case "confirmed": return "bg-green-50 text-green-600 border-green-100";
      case "pending": return "bg-blue-50 text-blue-600 border-blue-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <FacultyLayout>
      <div className="py-2">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Event Registrations</h1>
            <p className="text-gray-500 font-medium tracking-tight">Monitor student registrations across all events</p>
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
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Main Table Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Information</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Event Details</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Registration Date</th>
                  <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                  <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                          <UserCheck className="w-8 h-8 text-gray-200" />
                        </div>
                        <p className="text-gray-400 font-medium italic">No registrations found matching your filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-blue-50/20 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-bold shadow-sm">
                            {reg.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                              {reg.name}
                            </p>
                            <p className="text-xs text-gray-400 font-medium italic">{reg.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <p className="text-sm font-bold text-gray-800">{reg.event}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight italic">
                            {new Date(reg.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-medium">
                        {new Date(reg.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(reg.status)}`}>
                          {reg.status}
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

          {/* Footer Card */}
          <div className="p-6 bg-gray-50/30 border-t border-gray-50 italic">
            <p className="text-sm text-gray-500 font-medium">
              A total of <span className="text-blue-600 font-bold">{filteredRegistrations.length}</span> students are currently registered for your events.
            </p>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyRegistrationList;
