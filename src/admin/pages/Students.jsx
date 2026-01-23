import React, { useState, useEffect } from "react";
import { Search, User, GraduationCap, BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AdminStudentPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/allstudents");
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error(error.response?.data?.message || "Failed to fetch student list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      const res = await axios.put(`http://localhost:5000/api/admin/approveuser/${id}`);
      if (res.data.success) {
        toast.success("Student approved successfully");
        setStudents(prev => 
          prev.map(s => s._id === id ? { ...s, isapproved: true } : s)
        );
      }
    } catch (error) {
      console.error("Error approving student:", error);
      toast.error(error.response?.data?.message || "Failed to approve student");
    } finally {
      setApprovingId(null);
    }
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      (student.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.regno || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = student.isapproved ? "approved" : "pending";
    const matchesStatus = statusFilter === "all" || status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: students.length,
    approved: students.filter(s => s.isapproved).length,
    pending: students.filter(s => !s.isapproved).length
  };

  return (
    <AdminLayout>
      <Toaster position="top-right" />
      
      <div className="py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Student Management</h1>
          <p className="text-gray-500 font-medium tracking-tight">Review and manage student registrations for approvals</p>
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
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Approved</h3>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                 <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Pending Approval</h3>
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
                    placeholder="Search name, email, or regno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-600 font-medium outline-none shadow-sm transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Already Approved</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 text-center">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-400 font-medium tracking-tight">Syncing student database...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Student Information</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Reg No</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Department</th>
                    <th className="py-4 px-6 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="py-4 px-6 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                           <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                             <User className="w-8 h-8 text-gray-200" />
                           </div>
                           <p className="text-gray-400 font-medium italic">No students found matching your criteria.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-blue-50/20 transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                              {student.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">{student.name}</div>
                              <div className="text-xs text-gray-400 font-medium italic">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-700 font-bold">
                          {student.regno || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                          {student.department || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            student.isapproved 
                              ? "bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-50" 
                              : "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-50"
                          }`}>
                            {student.isapproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {!student.isapproved && (
                            <button 
                              onClick={() => handleApprove(student._id)}
                              disabled={approvingId === student._id}
                              className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 ml-auto shadow-md shadow-blue-100"
                            >
                              {approvingId === student._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-4 h-4" />
                              )}
                              APPROVE NOW
                            </button>
                          )}
                          {student.isapproved && (
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
              Showing <span className="text-blue-600 font-bold">{filteredStudents.length}</span> registered students
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudentPanel;