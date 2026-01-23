import React, { useState } from "react";
import { Lock, Mail, GraduationCap, Loader2, ShieldCheck, Zap, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const FacultyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/faculty/login", {
        email,
        password
      });

      if (response.status === 200) {
        toast.success("Login Successful!");
        localStorage.setItem("facultyData", JSON.stringify(response.data.faculty));
        setTimeout(() => {
          navigate("/faculty/dashboard");
        }, 1500);
      }
    } catch (error) {
      console.error("Login error:", error);
      const message = error.response?.data?.message || "Authentication Failed";
      toast.error(message);
      if (message.includes("Email not verified")) {
        setTimeout(() => {
          navigate("/faculty/otp", { state: { email } });
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 relative overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
         <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-[120px] opacity-60"></div>
         <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-50 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="w-full max-w-[480px] relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex flex-col items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-100 relative group transition-all hover:scale-105">
              <GraduationCap className="w-10 h-10 text-white" />
              <div className="absolute -top-2 -right-2 bg-white rounded-lg p-1.5 shadow-lg border border-gray-50">
                 <Zap className="w-4 h-4 text-blue-600 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">Faculty <span className="text-blue-600">Login</span></h1>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-3">Access your faculty dashboard</p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-12 relative">
           <div className="absolute top-6 right-8 opacity-20">
              <ShieldCheck className="w-12 h-12 text-blue-600" />
           </div>

           <form onSubmit={handleSubmit} className="space-y-8">
            {/* Form Fields */}
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      color="blue"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                      placeholder="faculty@university.edu"
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-[1.5rem] focus:ring-4 focus:ring-blue-50 transition-all font-bold text-gray-800 placeholder:text-gray-300"
                      placeholder="********"
                    />
                  </div>
                  <div className="flex justify-end mt-2">
                    <button type="button" className="text-xs font-black text-blue-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Forgot Password?</button>
                  </div>
               </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <Sparkles className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-10 text-center">
              <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/faculty/register')}
                  className="text-blue-600 hover:text-blue-800 font-black ml-1"
                >
                  Register Now
                </button>
              </p>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-8 border-t border-gray-50">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs font-black uppercase tracking-widest">System online: Secure connection established.</span>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="mt-12 text-center">
           <p className="text-xs font-black text-gray-300 uppercase tracking-[0.4em]">EventHub Faculty Portal</p>
           <div className="flex items-center justify-center gap-4 mt-6 opacity-20 italic font-medium text-gray-900 text-xs">
              <span>Secure Login</span>
              <span>•</span>
              <span>Privacy Protected</span>
           </div>
        </div>
      </div>
    </div>
  );
};


export default FacultyLogin;
