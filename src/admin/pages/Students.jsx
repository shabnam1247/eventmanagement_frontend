import React, { useState, useEffect } from "react";
import { Search, User, GraduationCap, BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
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

  console.log("students");
  

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleApprove = async (id) => {
    try {
      setApprovingId(id);
      const res = await axios.put(`http://localhost:5000/api/admin/approveuser/${id}`);
      if (res.data.succes) {
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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Management</h1>
          <p className="text-gray-600">Review and manage student registrations</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Registered</h3>
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Approved</h3>
              <GraduationCap className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Pending Approval</h3>
              <BookOpen className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200 bg-gray-50/50">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search name, email, or regno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p>Fetching student data...</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Info</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reg. No</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-6 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                              {student.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-xs text-gray-500">{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {student.regno || "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {student.department || "N/A"}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            student.isapproved 
                              ? "bg-green-100 text-green-800 border border-green-200" 
                              : "bg-amber-100 text-amber-800 border border-amber-200"
                          }`}>
                            {student.isapproved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {!student.isapproved && (
                            <button 
                              onClick={() => handleApprove(student._id)}
                              disabled={approvingId === student._id}
                              className="px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                            >
                              {approvingId === student._id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle className="w-3 h-3" />
                              )}
                              Approve
                            </button>
                          )}
                          {student.isapproved && (
                            <span className="text-green-600 text-xs font-medium inline-flex items-center">
                               <CheckCircle className="w-3 h-3 mr-1" /> Approved
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing {filteredStudents.length} registered students
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudentPanel;