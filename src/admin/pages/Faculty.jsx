import React, { useState, useEffect } from "react";
import { Search, User, Briefcase, BookOpen, CheckCircle, XCircle, Loader2, GraduationCap } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const FacultyPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/allfaculties");
      if (res.data.success) {
        setFacultyMembers(res.data.faculties);
      }
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast.error(error.response?.data?.message || "Failed to fetch faculty members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      const res = await axios.put(`http://localhost:5000/api/admin/approvefaculty/${id}`);
      if (res.data.success) {
        toast.success("Faculty approved successfully");
        setFacultyMembers(prev => 
          prev.map(f => f._id === id ? { ...f, isapproved: true } : f)
        );
      }
    } catch (error) {
      console.error("Error approving faculty:", error);
      toast.error(error.response?.data?.message || "Failed to approve faculty");
    } finally {
      setApprovingId(null);
    }
  };

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesSearch =
      (faculty.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (faculty.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = faculty.isapproved ? "approved" : "pending";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: facultyMembers.length,
    approved: facultyMembers.filter(f => f.isapproved).length,
    pending: facultyMembers.filter(f => !f.isapproved).length
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Faculty Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Approve and verify faculty members to manage events</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Registered</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                 <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active Members</h3>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                 <Briefcase className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pending Access</h3>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                 <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by faculty name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-600 font-bold outline-none shadow-sm"
                >
                  <option value="all">All Access levels</option>
                  <option value="pending">Waiting Approval</option>
                  <option value="approved">Granted Access</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium tracking-tight">Refreshing faculty records...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Faculty Details</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Verification</th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredFaculty.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                             <GraduationCap className="w-8 h-8 text-gray-200" />
                           </div>
                           <p className="text-gray-400 font-medium italic">No faculty members found matching your search.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredFaculty.map((faculty) => (
                      <tr key={faculty._id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="py-4 px-6 text-gray-900 border-none">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                              {faculty.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">{faculty.name}</div>
                              <div className="text-xs text-gray-400 font-medium italic">{faculty.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            faculty.isapproved 
                              ? "bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-50" 
                              : "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-50"
                          }`}>
                            {faculty.isapproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                           <span className={`inline-flex items-center text-[11px] font-bold uppercase tracking-tighter ${faculty.isVerified ? "text-green-500" : "text-gray-400"}`}>
                             {faculty.isVerified ? (
                               <><CheckCircle className="w-3.5 h-3.5 mr-1" /> Verified</>
                             ) : (
                               <><XCircle className="w-3.5 h-3.5 mr-1" /> Unverified</>
                             )}
                           </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {!faculty.isapproved && (
                            <button 
                              onClick={() => handleApprove(faculty._id)}
                              disabled={approvingId === faculty._id}
                              className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 ml-auto shadow-md shadow-blue-100"
                            >
                              {approvingId === faculty._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              GRANT ACCESS
                            </button>
                          )}
                          {faculty.isapproved && (
                            <div className="flex justify-end pr-2">
                               <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-6 bg-gray-50/30 border-t border-gray-50 italic">
            <p className="text-sm text-gray-500 font-medium">
              A total of <span className="text-blue-600 font-bold">{facultyMembers.length}</span> faculty members registered in the platform.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FacultyPanel;