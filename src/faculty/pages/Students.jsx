import React, { useState } from "react";
import { 
  Search, 
  Plus, 
  User, 
  GraduationCap, 
  BookOpen, 
  Eye, 
  Edit, 
  Trash2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";

const FacultyStudentPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/faculty/addstudent");
  };

  const students = [
    {
      id: 1,
      name: "Safna K",
      regno: "CS2025001",
      department: "Computer Science",
      year: "3rd Year",
      email: "safna@gmail.com",
      status: "Active",
    },
    {
      id: 2,
      name: "Rahul R",
      regno: "EC2025012",
      department: "Electronics",
      year: "2nd Year",
      email: "rahulr@gmail.com",
      status: "Active",
    },
    {
      id: 3,
      name: "Anjali M",
      regno: "ME2025023",
      department: "Mechanical",
      year: "4th Year",
      email: "anjalim@gmail.com",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Vijay K",
      regno: "CS2025040",
      department: "Computer Science",
      year: "1st Year",
      email: "vijayk@gmail.com",
      status: "Active",
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regno.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || student.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const stats = {
    total: students.length,
    active: students.filter(s => s.status === "Active").length,
    inactive: students.filter(s => s.status === "Inactive").length
  };

  return (
    <FacultyLayout>
      <div className="py-2">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 font-sans tracking-tight">Student Management</h1>
            <p className="text-gray-500 font-medium tracking-tight">Manage and monitor all student registrations</p>
          </div>
          
          <button
            onClick={handleAddClick}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex items-center gap-2 shadow-sm font-bold transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            ADD STUDENT
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Students</h3>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                 <User className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Active</h3>
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                 <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Inactive</h3>
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                 <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stats.inactive}</p>
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
                    placeholder="Search by name or registration number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-gray-600 font-medium outline-none shadow-sm transition-all"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
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
                    <tr key={student.id} className="hover:bg-blue-50/20 transition-colors group">
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
                        {student.regno}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium">
                        <div>{student.department}</div>
                        <div className="text-xs text-gray-400">{student.year}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          student.status === "Active" 
                            ? "bg-green-50 text-green-600 border border-green-100 shadow-sm shadow-green-50" 
                            : "bg-amber-50 text-amber-600 border border-amber-100 shadow-sm shadow-amber-50"
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-1">
                          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all shadow-sm">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all shadow-sm">
                            <Edit className="w-4 h-4" />
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

          <div className="p-6 bg-gray-50/30 border-t border-gray-50 italic">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="text-blue-600 font-bold">{filteredStudents.length}</span> registered students
            </p>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

export default FacultyStudentPanel;
