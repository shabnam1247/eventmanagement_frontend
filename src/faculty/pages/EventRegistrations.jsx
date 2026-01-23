import React, { useState } from "react";
import { 
  Search, 
  Eye, 
  Trash2, 
  Download, 
  Filter, 
  ArrowLeft,
  UserCheck,
  Calendar,
  Mail,
  MoreVertical,
  Fingerprint,
  Zap,
  Target
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

  const getStatusConfig = (status) => {
    switch (status) {
      case "confirmed": return { color: "text-emerald-600 bg-emerald-50", icon: <UserCheck className="w-3 h-3" /> };
      case "pending": return { color: "text-amber-600 bg-amber-50", icon: <Zap className="w-3 h-3" /> };
      case "cancelled": return { color: "text-rose-600 bg-rose-50", icon: <Target className="w-3 h-3" /> };
      default: return { color: "text-gray-600 bg-gray-50", icon: <Fingerprint className="w-3 h-3" /> };
    }
  };

  return (
    <FacultyLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="space-y-1">
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Event <span className="text-blue-600">Registrations</span></h1>
              <p className="text-gray-500 font-medium tracking-tight">Monitor real-time event registration traffic and status</p>
           </div>
           
           <button className="flex items-center gap-3 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black shadow-xl shadow-gray-200 transition-all hover:-translate-y-1 active:scale-95">
              <Download className="w-5 h-5" />
              EXPORT LIST
           </button>
        </div>

        {/* Filter Section */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-50/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative group w-full flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by student name, email or event name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
               <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-transparent hover:border-gray-200 transition-all">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent border-none focus:ring-0 font-bold text-xs text-gray-600 uppercase cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="confirmed">Status: Confirmed</option>
                    <option value="pending">Status: Pending</option>
                    <option value="cancelled">Status: Cancelled</option>
                  </select>
               </div>
            </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full">
               <thead>
                 <tr className="bg-gray-50/50">
                    <th className="py-6 px-10 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Sl No.</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Student Details</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Event Details</th>
                    <th className="py-6 px-8 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Registration Status</th>
                    <th className="py-6 px-10 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                 {filteredRegistrations.map((reg, index) => {
                    const status = getStatusConfig(reg.status);
                    return (
                        <tr key={reg.id} className="hover:bg-blue-50/30 transition-all group">
                           <td className="py-8 px-10">
                              <span className="text-xs font-black text-gray-300 tabular-nums">#{index + 1}</span>
                           </td>
                           <td className="py-8 px-8">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    {reg.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{reg.name}</p>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Reg No: {reg.regNo}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="py-8 px-8">
                              <p className="text-sm font-black text-gray-800 uppercase tabular-nums">{reg.event}</p>
                              <div className="flex items-center gap-2 mt-1">
                                 <Calendar className="w-3 h-3 text-gray-300" />
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{reg.date}</span>
                              </div>
                           </td>
                           <td className="py-8 px-8">
                              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm ${status.color}`}>
                                 {status.icon}
                                 {reg.status}
                              </div>
                           </td>
                           <td className="py-8 px-10 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 <button className="p-3 bg-gray-50 text-gray-400 hover:bg-white hover:text-blue-600 hover:shadow-lg rounded-xl transition-all active:scale-90">
                                    <Eye className="w-5 h-5" />
                                 </button>
                                 <button className="p-3 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:shadow-lg rounded-xl transition-all active:scale-90">
                                    <Trash2 className="w-5 h-5" />
                                 </button>
                                 <button className="p-3 bg-gray-50 text-gray-400 hover:bg-gray-100 rounded-xl transition-all">
                                    <MoreVertical className="w-5 h-5" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                    )
                 })}
               </tbody>
             </table>
           </div>

           {/* Table Footer */}
           <div className="p-8 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-6">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                Showing {filteredRegistrations.length} registrations from record
              </p>
              <div className="flex gap-3">
                 <button className="px-6 py-3 bg-gray-50 text-gray-400 font-black text-xs uppercase rounded-xl hover:bg-white hover:shadow-md transition-all">Previous</button>
                 <button className="px-6 py-3 bg-blue-600 text-white font-black text-xs uppercase rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">Next Page</button>
              </div>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
};


export default FacultyRegistrationList;
