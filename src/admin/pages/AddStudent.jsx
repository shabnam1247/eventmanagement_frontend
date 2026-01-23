import React, { useState } from "react";
import { User, GraduationCap, Mail, Phone, ArrowLeft, UserPlus, ShieldCheck, Lock, Loader2 } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

function AddStudentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    registerNo: "",
    department: "",
    year: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/admin/addstudent", {
        ...studentData,
        regno: studentData.registerNo,
        phonenumber: studentData.phone
      });
      if (res.data.success) {
        toast.success("Student account provisioned successfully!");
        setStudentData({
          name: "",
          registerNo: "",
          department: "",
          year: "",
          email: "",
          password: "",
          phone: "",
        });
        setTimeout(() => navigate("/admin/students"), 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to onboard student");
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
    "Commerce"
  ];

  return (
    <AdminLayout>
      <Toaster position="top-right" />
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
             <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Onboard Student</h1>
          <p className="text-gray-500 font-medium">Provision a new student account within the institutional ecosystem</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-50 border border-gray-100 p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl -mr-24 -mt-24"></div>
          
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                 <User className="w-3.5 h-3.5" /> Identity (Full Name)
              </label>
              <input
                type="text"
                name="name"
                value={studentData.name}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 text-lg placeholder:text-gray-300"
                placeholder="Ex: Alexander Pierce"
              />
            </div>

            {/* Register Number and Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <GraduationCap className="w-3.5 h-3.5" /> Registry / Registration ID
                </label>
                <input
                  type="text"
                  name="registerNo"
                  value={studentData.registerNo}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Ex: 2021CS001"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Lock className="w-3.5 h-3.5" /> Security Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={studentData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="Minimum 6 chars"
                />
              </div>
            </div>

            {/* Department and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Academic Department</label>
                <select
                  name="department"
                  value={studentData.department}
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
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1">Enrollment Maturity</label>
                <select
                  name="year"
                  value={studentData.year}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 cursor-pointer"
                >
                  <option value="">Current Standing</option>
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior)</option>
                </select>
              </div>
            </div>

            {/* Email and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Mail className="w-3.5 h-3.5" /> Internal Communication (Email)
                </label>
                <input
                  type="email"
                  name="email"
                  value={studentData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="student@events.university.edu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-1 flex items-center gap-2">
                   <Phone className="w-3.5 h-3.5" /> Emergency Contact
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={studentData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                  placeholder="987xxxxxxx"
                />
              </div>
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
                   <ShieldCheck className="w-6 h-6" />
                )}
                {loading ? "PROVISIONING..." : "LEGALIZE STUDENT REGISTRY"}
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

export default AddStudentPage;