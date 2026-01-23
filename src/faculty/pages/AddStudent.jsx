import React, { useState } from "react";
import { 
  User, 
  GraduationCap, 
  Mail, 
  Phone, 
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Send,
  Loader2,
  BookOpen,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FacultyLayout from "../components/FacultyLayout";
import toast from "react-hot-toast";

function FacultyAddStudentPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: "",
    registerNo: "",
    department: "",
    year: "",
    email: "",
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Student Added:", studentData);
      toast.success("Student added successfully!");
      navigate("/faculty/students");
    } catch (error) {
      toast.error("Failed to add student. Please try again.");
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
    <FacultyLayout>
       <div className="max-w-4xl mx-auto space-y-10">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="space-y-1">
              <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] mb-4 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Students
              </button>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">Add New <span className="text-blue-600">Student</span></h1>
              <p className="text-gray-500 font-medium">Create a new student profile for event tracking</p>
           </div>

           <div className="hidden md:block">
              <div className="w-20 h-20 bg-blue-50 rounded-[2rem] flex items-center justify-center border border-blue-100 shadow-inner">
                 <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
           </div>
        </div>

        {/* Form Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Form Section */}
           <div className="lg:col-span-2">
              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-50/50 p-10">
                 <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Student Identity */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Personal Details</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Full Name</label>
                             <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                  type="text"
                                  name="name"
                                  value={studentData.name}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                  placeholder="John Doe"
                                />
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Registration Number</label>
                             <div className="relative group">
                                <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                  type="text"
                                  name="registerNo"
                                  value={studentData.registerNo}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                  placeholder="CS-2025-001"
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Academic Details</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Department</label>
                             <div className="relative group">
                                <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                                <select
                                  name="department"
                                  value={studentData.department}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 appearance-none"
                                >
                                  <option value="">Select Department</option>
                                  {departments.map((dept, index) => (
                                    <option key={index} value={dept}>{dept}</option>
                                  ))}
                                </select>
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Current Year</label>
                             <div className="relative group">
                                <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                                <select
                                  name="year"
                                  value={studentData.year}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 appearance-none"
                                >
                                  <option value="">Select Year</option>
                                  <option value="1st Year">1st Year</option>
                                  <option value="2nd Year">2nd Year</option>
                                  <option value="3rd Year">3rd Year</option>
                                  <option value="4th Year">4th Year</option>
                                </select>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6">
                       <div className="flex items-center gap-3 pb-2 border-b border-gray-50">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Information</span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Email Address</label>
                             <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                  type="email"
                                  name="email"
                                  value={studentData.email}
                                  onChange={handleChange}
                                  required
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                  placeholder="student@example.com"
                                />
                             </div>
                          </div>
                          
                          <div className="space-y-2">
                             <label className="text-xs font-black text-gray-900 uppercase tracking-tight ml-1">Phone Number</label>
                             <div className="relative group">
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                  type="tel"
                                  name="phone"
                                  value={studentData.phone}
                                  onChange={handleChange}
                                  required
                                  pattern="[0-9]{10}"
                                  className="w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-blue-100 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                                  placeholder="10-digit number"
                                />
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Action Hub */}
                    <div className="pt-4">
                       <button
                         type="submit"
                         disabled={loading}
                         className={`
                           w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all
                           ${loading 
                             ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                             : 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xl shadow-blue-100 hover:-translate-y-1 active:scale-[0.98]'}
                         `}
                       >
                         {loading ? (
                           <>
                             <Loader2 className="w-5 h-5 animate-spin" />
                             Saving...
                           </>
                         ) : (
                           <>
                             <Send className="w-5 h-5" />
                             Add Student
                           </>
                         )}
                       </button>
                    </div>
                 </form>
              </div>
           </div>

           {/* Sidebar Guide */}
           <div className="space-y-8">
              <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white space-y-6 relative overflow-hidden shadow-2xl shadow-blue-200">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -mr-16 -mt-16"></div>
                 <h4 className="text-xl font-black tracking-tighter uppercase relative z-10">Guide <span className="text-blue-400">Brief</span></h4>
                 <div className="space-y-4 relative z-10">
                    <Checkpoint text="Unique registration number" />
                    <Checkpoint text="Correct department mapping" />
                    <Checkpoint text="Valid email contact" />
                 </div>
                 <div className="pt-4 relative z-10">
                    <p className="text-[10px] font-bold text-gray-400 uppercase leading-relaxed">
                       Once added, students can immediately register for events using their new profile.
                    </p>
                 </div>
              </div>

              <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white text-center space-y-4 shadow-xl shadow-blue-100">
                 <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
                    <Sparkles className="w-8 h-8 text-white" />
                 </div>
                 <div>
                    <p className="text-xs font-black uppercase tracking-widest text-blue-100">Quick Setup</p>
                    <p className="text-[10px] text-blue-200 font-bold mt-1">Student profiles are automatically verified upon creation.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </FacultyLayout>
  );
}

const Checkpoint = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{text}</span>
  </div>
);

export default FacultyAddStudentPage;
