import React, { useState } from 'react';
import { User, Lock, Calendar, Eye, EyeOff, Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '', // Email or Register Number
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.identifier) newErrors.identifier = 'Email or Register number is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", formData);
      if (response.status === 200) {
        toast.success("Welcome back! Login successful.");
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      if (message.includes("Email not verified")) {
        const email = error.response?.data?.email;
        setTimeout(() => navigate("/otp", { state: { email } }), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Header />
      
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float delay-2000"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float delay-4000"></div>
        </div>

        <div className="w-full max-w-5xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-blur-in">
          
          {/* Left Side: Illustration & Branding */}
          <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white relative h-full">
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-2xl font-bold tracking-tight uppercase italic">EventHub</span>
              </div>
              
              <h2 className="text-5xl font-bold mb-6 leading-tight">
                Unlock Your <br />
                <span className="text-cyan-400 italic">Campus</span> Life.
              </h2>
              <p className="text-indigo-100/80 text-lg font-medium max-w-md leading-relaxed">
                Connect with organizers, discover technical workshops, and earn verified certificates all in one place.
              </p>
            </div>

            <div className="relative z-10 animate-fade-in-up animate-delay-200">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className={`w-10 h-10 rounded-full border-2 border-indigo-900 bg-gray-200 overflow-hidden`}>
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-cyan-300">Join 12k+ Students</span>
                </div>
                <p className="text-xs text-indigo-200 font-medium">Verified platform for Al Jamia Arts & Science College events.</p>
              </div>
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <div className="text-center lg:text-left mb-10 animate-fade-in-up">
              <div className="lg:hidden flex justify-center mb-6">
                 <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-200">
                   <Calendar className="w-8 h-8 text-white" />
                 </div>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" /> Student Portal
              </div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back!</h1>
              <p className="text-gray-500 font-medium tracking-tight">Enter your credentials to access your dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5 animate-fade-in-up animate-delay-100">
                {/* Identifier Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email or Register No.</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-semibold tracking-tight text-gray-900 ${
                        errors.identifier ? 'border-red-500' : 'border-transparent'
                      }`}
                      placeholder="e.g. REG12345"
                    />
                  </div>
                  {errors.identifier && <p className="text-[10px] text-red-600 font-bold uppercase tracking-wider ml-1">{errors.identifier}</p>}
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider hover:underline">Forgot?</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-2xl focus:bg-white focus:border-indigo-600 outline-none transition-all font-semibold tracking-tight text-gray-900 ${
                        errors.password ? 'border-red-500' : 'border-transparent'
                      }`}
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-[10px] text-red-600 font-black uppercase tracking-wider ml-1">{errors.password}</p>}
                </div>
              </div>

              <div className="pt-2 animate-fade-in-up animate-delay-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-70 group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      SIGN IN TO PORTAL
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center pt-4 animate-fade-in-up animate-delay-300">
                <p className="text-sm font-bold text-gray-500 tracking-tight">
                  New student to EventHub?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/userregister')}
                    className="text-indigo-600 hover:text-indigo-800 transition-colors font-bold border-b-2 border-indigo-100 hover:border-indigo-600 pb-0.5"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>

            <div className="mt-auto pt-10 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-fade-in-up animate-delay-400">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Secure Campus Authentication System
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
