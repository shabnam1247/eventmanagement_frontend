import React, { useState } from "react";
import { User, Mail, Phone, Briefcase, Award, Clock, ArrowLeft, ShieldPlus, Landmark, Lock, Loader2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AddFacultyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [facultyData, setFacultyData] = useState({
    name: "",
    facultyId: "",
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/addfaculty", {
        ...facultyData,
        phonenumber: facultyData.phone // Mapping frontend field name to backend expectation
      });
      if (res.data.success) {
        toast.success("Faculty member registered successfully!");
        setFacultyData({
          name: "",
          facultyId: "",
          email: "",
          password: "",
          phone: "",
          department: "",
          designation: "",
          experience: "",
          status: "active",
        });
        setTimeout(() => navigate("/admin/faculty"), 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add faculty member");
    } finally {
      setLoading(false);
    }
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
    <AdminLayout>
      <div className="py-2 max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Personnel Management
        </button>

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-[2rem] shadow-xl shadow-blue-100 mb-6">
             <Landmark className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Register Faculty</h1>
          <p className="text-gray-500 font-medium">Onboard new academic leadership with administrative privileges</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/10 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name and Faculty ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <User className="w-3.5 h-3.5" /> Direct Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={facultyData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Ex: Dr. Sarah Smith"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Briefcase className="w-3.5 h-3.5" /> Staff Serial / Faculty ID
                </label>
                <input
                  type="text"
                  name="facultyId"
                  value={facultyData.facultyId}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Ex: FAC-00921"
                />
              </div>
            </div>

            {/* Email and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Mail className="w-3.5 h-3.5" /> Academic Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={facultyData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="faculty@university.edu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5" /> Identity Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={facultyData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            {/* Phone and Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Phone className="w-3.5 h-3.5" /> Mobile Interface
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={facultyData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                  placeholder="Digits only..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                   <Clock className="w-3.5 h-3.5" /> Experience Factor (Years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={facultyData.experience}
                  onChange={handleChange}
                  required
                  min="0"
                  max="50"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800"
                />
              </div>
            </div>

            {/* Department and Designation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Managed Department</label>
                <select
                  name="department"
                  value={facultyData.department}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Select Domain</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Award className="w-3.5 h-3.5" /> Academic Rank
                </label>
                <select
                  name="designation"
                  value={facultyData.designation}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Select Designation</option>
                  {designations.map((designation, index) => (
                    <option key={index} value={designation}>{designation}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Presence Status</label>
              <select
                name="status"
                value={facultyData.status}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-100 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-black text-blue-600 cursor-pointer"
              >
                <option value="active">Active Service</option>
                <option value="on-leave">Sabbatical / Leave</option>
                <option value="inactive">Deactivated</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50"
              >
                {loading ? (
                   <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                   <ShieldPlus className="w-6 h-6" />
                )}
                {loading ? "PROCESSING..." : "LEGALIZE FACULTY CREDENTIALS"}
              </button>
            </div>
          </form>
        </div>
        
        <div className="mt-8 text-center">
           <p className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Confidential Data Infrastructure • Event Hub Admin</p>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AddFacultyPage;