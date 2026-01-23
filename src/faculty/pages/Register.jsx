import React, { useState } from "react";
import { User, Mail, Phone, Lock, ArrowLeft, GraduationCap, Loader2, Sparkles, ShieldCheck, Zap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function FacultyRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    facultyId: "",
    department: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const facultyIdRegex = /^FAC\d{4}$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "10-digit number required";
    }
    if (!formData.facultyId.trim()) {
      newErrors.facultyId = "Faculty ID is required";
    } else if (!facultyIdRegex.test(formData.facultyId)) {
      newErrors.facultyId = "Use format FACXXXX (e.g. FAC1234)";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Min 6 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/faculty/register", {
          ...formData,
          phonenumber: formData.phone
        });
        
        if (response.status === 201) {
          toast.success("Registration successful! Please verify OTP.");
          setTimeout(() => {
            navigate('/faculty/otp', { state: { email: formData.email } });
          }, 1500);
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.response?.data?.message || "Registration Failed");
      } finally {
        setLoading(false);
      }
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

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[140px] opacity-40"></div>
         <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-30"></div>
      </div>

      <div className="w-full max-w-[540px] relative z-10 space-y-8">
        {/* Navigation */}
        <button
          onClick={() => navigate('/faculty/login')}
          className="group flex items-center gap-3 text-gray-400 hover:text-blue-600 font-black text-[10px] uppercase tracking-[0.3em] transition-all"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Login
        </button>

        {/* Register Card */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-12 relative">
           <div className="absolute top-8 right-10 flex gap-2">
              <ShieldCheck className="w-8 h-8 text-blue-100" />
              <Zap className="w-8 h-8 text-blue-50" />
           </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Faculty <span className="text-blue-600">Register</span></h1>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-3">Create your faculty account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${
                      errors.name ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${
                      errors.email ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                    }`}
                    placeholder="faculty@university.edu"
                  />
                </div>
                {errors.email && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Faculty ID</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="text"
                      name="facultyId"
                      value={formData.facultyId}
                      onChange={handleChange}
                      className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${
                        errors.facultyId ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                      }`}
                      placeholder="FACXXXX"
                    />
                  </div>
                  {errors.facultyId && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.facultyId}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${
                        errors.phone ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                      }`}
                      placeholder="10-digit number"
                    />
                  </div>
                  {errors.phone && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.phone}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                <div className="relative group">
                  <BookOpen className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 appearance-none ${
                        errors.department ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                    }`}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {errors.department && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.department}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-16 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 transition-all font-bold text-gray-800 placeholder:text-gray-300 ${
                      errors.password ? 'ring-4 ring-rose-50' : 'focus:ring-blue-50'
                    }`}
                    placeholder="Min 6 characters"
                  />
                </div>
                {errors.password && <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest ml-2">{errors.password}</p>}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Registering...
                </>
              ) : (
                <>
                  Register
                  <Sparkles className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/faculty/login')}
                className="text-blue-600 hover:text-blue-800 font-black ml-1"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
           <p className="text-xs font-black text-gray-300 uppercase tracking-widest leading-relaxed">
             Authorized Faculty registration only. By registering, you agree to our terms and conditions.
           </p>
        </div>
      </div>
    </div>
  );
}

