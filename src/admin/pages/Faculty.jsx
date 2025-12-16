import React, { useState } from "react";
import { Search, Plus, User, Briefcase, BookOpen, Eye, Edit, Trash2 } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { useNavigate } from "react-router-dom";

const FacultyPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const navigate = useNavigate();

  const handleAddClick = () => {
    navigate("/admin/addfaculty");
  };

  const facultyMembers = [
    {
      id: 1,
      name: "Dr. Anitha M",
      empId: "FAC1001",
      department: "Computer Science",
      email: "anitha.cs@college.edu",
      phone: "9876543210",
      status: "Active",
    },
    {
      id: 2,
      name: "Prof. Ravi Kumar",
      empId: "FAC1002",
      department: "Electronics",
      email: "ravi.ec@college.edu",
      phone: "9876501234",
      status: "Active",
    },
    {
      id: 3,
      name: "Dr. Meena R",
      empId: "FAC1003",
      department: "Mechanical",
      email: "meena.me@college.edu",
      phone: "9887765432",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Prof. Suresh B",
      empId: "FAC1004",
      department: "Computer Science",
      email: "suresh.cs@college.edu",
      phone: "9812345678",
      status: "Active",
    },
  ];

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faculty.empId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept =
      departmentFilter === "all" || faculty.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Faculty Management</h1>
          <p className="text-gray-600">Manage and monitor faculty information</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Total Faculty</h3>
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{facultyMembers.length}</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Active</h3>
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {facultyMembers.filter(f => f.status === "Active").length}
            </p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-600">Inactive</h3>
              <BookOpen className="w-5 h-5 text-gray-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {facultyMembers.filter(f => f.status === "Inactive").length}
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl border border-gray-200">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search faculty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full sm:w-64"
                  />
                </div>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Departments</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Mechanical">Mechanical</option>
                </select>
              </div>
              
              <button
                onClick={handleAddClick}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Faculty
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Emp. ID</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Department</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Email</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Phone</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredFaculty.map((faculty) => (
                  <tr key={faculty.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{faculty.empId}</td>
                    <td className="py-3 px-4 text-gray-900">{faculty.name}</td>
                    <td className="py-3 px-4 text-gray-600">{faculty.department}</td>
                    <td className="py-3 px-4 text-gray-600">{faculty.email}</td>
                    <td className="py-3 px-4 text-gray-600">{faculty.phone}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        faculty.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {faculty.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600">
                          <Edit className="w-4 h-4" />
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
              Showing {filteredFaculty.length} of {facultyMembers.length} faculty
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

export default FacultyPanel;