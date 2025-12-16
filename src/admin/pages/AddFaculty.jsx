import React, { useState } from "react";
import { User, Mail, Phone, Briefcase, Award, Clock, ArrowLeft } from "lucide-react";
import AdminHeader from "../components/AdminHeader";
import { useNavigate } from "react-router-dom";

function AddFacultyPage() {
  const navigate = useNavigate();
  const [facultyData, setFacultyData] = useState({
    name: "",
    facultyId: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    experience: "",
    status: "active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyData({ ...facultyData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Faculty Added:", facultyData);
    alert("✅ Faculty member added successfully!");
    setFacultyData({
      name: "",
      facultyId: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      experience: "",
      status: "active",
    });
  };

  const departments = [
    "Computer Science",
    "Electronics",
    "Electrical",
    "Mechanical",
    "Civil",
    "BCA",
    "BBA",
    "Commerce",
    "Psychology",
    "Islamic Studies"
  ];

  const designations = [
    "Professor",
    "Associate Professor",
    "Assistant Professor",
    "Lecturer",
    "Senior Lecturer"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Faculty
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Faculty</h1>
          <p className="text-gray-600">Register a new faculty member in the system</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name and Faculty ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={facultyData.name}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter full name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty ID *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="facultyId"
                    value={facultyData.facultyId}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter faculty ID"
                  />
                </div>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={facultyData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="faculty@college.edu"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={facultyData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="9876543210"
                  />
                </div>
              </div>
            </div>

            {/* Department and Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  name="department"
                  value={facultyData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Designation *
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    name="designation"
                    value={facultyData.designation}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="">Select Designation</option>
                    {designations.map((designation, index) => (
                      <option key={index} value={designation}>{designation}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Experience and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience (years) *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="experience"
                    value={facultyData.experience}
                    onChange={handleChange}
                    required
                    min="0"
                    max="50"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter years"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  name="status"
                  value={facultyData.status}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="on-leave">On Leave</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Faculty
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddFacultyPage;