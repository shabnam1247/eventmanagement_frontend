import React, { useState } from "react";
import { User, Mail, Phone, Lock, ArrowLeft, GraduationCap, School, BookOpen, Loader2, Sparkles, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phonenumber: "",
    regno: "",
    department: "",
    year: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const departments = [
    "Computer Science", "Electronics", "Electrical", "Mechanical", "Civil",
    "BCA", "BBA", "Commerce", "Psychology", "Islamic Studies"
  ];

  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim()) newErrors.name = "Required";
    if (!formData.email.trim() || !emailRegex.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.phonenumber.trim()) newErrors.phonenumber = "Required";
    if (!formData.regno.trim()) newErrors.regno = "Required";
    if (!formData.department) newErrors.department = "Required";
    if (!formData.year) newErrors.year = "Required";
    if (formData.password.length < 6) newErrors.password = "Min 6 chars";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:5000/api/users/register", formData);
        if (response.status === 201) {
          toast.success("Account created! Verifying email...");
          setTimeout(() => navigate('/otp', { state: { email: formData.email } }), 1500);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
        {/* Orbs - Live Background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-2000 opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-30"></div>
        </div>

        <div className="w-full max-w-6xl flex flex-col lg:flex-row bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-blur-in">
          
          {/* Left: Info Section */}
          <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 text-white relative h-auto">
            <div className="absolute inset-0 bg-black/10"></div>
            
            <div className="relative z-10">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-indigo-200 hover:text-white transition-colors font-bold text-sm mb-12 group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Return to Campus Portal
              </button>
              
              <h2 className="text-4xl font-bold mb-6 leading-tight animate-fade-in-up">
                Start Your <span className="text-cyan-400 italic">Journey</span> with us.
              </h2>
              
              <div className="space-y-6">
                {[
                  "One-click registration for all events",
                  "Automated session reminders",
                  "Downloadable participation certificates",
                  "Direct chat with coordinators"
                ].map((text, i) => (
                  <div key={i} className={`flex items-start gap-3 animate-fade-in-up animate-delay-${(i+1)*100}`}>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium text-indigo-100/90">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-12 animate-fade-in-up animate-delay-500">
               <div className="p-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/10">
                 <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">Student Testimonial</p>
                 <p className="text-sm italic font-medium text-indigo-100 leading-relaxed mb-4">
                   "The event registration is so smooth! I never miss any technical workshops now."
                 </p>
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-indigo-500 border border-white/20"></div>
                   <span className="text-xs font-bold whitespace-nowrap">Sarah J. - CS Department</span>
                 </div>
               </div>
            </div>
          </div>

          {/* Right: Registration Form */}
          <div className="flex-1 p-8 md:p-12 lg:p-14">
            <div className="mb-10 animate-fade-in-up">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" /> New Registration
              </div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Create Student Account</h1>
              <p className="text-gray-500 font-medium tracking-tight">Enter your details to join the college event network</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto max-h-[60vh] lg:max-h-none pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="md:col-span-2 space-y-2 animate-fade-in-up animate-delay-100">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      name="name"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-semibold text-gray-900 ${errors.name ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="md:col-span-2 space-y-2 animate-fade-in-up animate-delay-200">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">College Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      type="email"
                      name="email"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 ${errors.email ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="rahul@college.edu"
                    />
                  </div>
                </div>

                {/* Reg No */}
                <div className="space-y-2 animate-fade-in-up animate-delay-300">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Register No.</label>
                  <div className="relative group">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      name="regno"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 ${errors.regno ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="REG12345"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2 animate-fade-in-up animate-delay-300">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      name="phonenumber"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 ${errors.phonenumber ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {/* Department */}
                <div className="space-y-2 animate-fade-in-up animate-delay-400">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Department</label>
                  <div className="relative group">
                    <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <select
                      name="department"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 appearance-none ${errors.department ? 'border-red-500' : 'border-transparent'}`}
                    >
                      <option value="">Select Dept</option>
                      {departments.map((dept) => <option key={dept} value={dept}>{dept}</option>)}
                    </select>
                  </div>
                </div>

                {/* Year */}
                <div className="space-y-2 animate-fade-in-up animate-delay-400">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Current Year</label>
                  <div className="relative group">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <select
                      name="year"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 appearance-none ${errors.year ? 'border-red-500' : 'border-transparent'}`}
                    >
                      <option value="">Select Year</option>
                      {years.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                {/* Password */}
                <div className="md:col-span-2 space-y-2 animate-fade-in-up animate-delay-500">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Set Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-indigo-600" />
                    <input
                      type="password"
                      name="password"
                      onChange={handleChange}
                      className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-bold text-gray-900 ${errors.password ? 'border-red-500' : 'border-transparent'}`}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 animate-fade-in-up animate-delay-500">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "CREATE ACCESS ACCOUNT"}
                </button>
              </div>

              <div className="text-center animate-fade-in-up animate-delay-500">
                <p className="text-sm font-bold text-gray-500 tracking-tight">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors font-black border-b-2 border-indigo-100 p-0.5"
                  >
                    Sign In instead
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-fade-in-up animate-delay-500">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Encrypted student data protection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}