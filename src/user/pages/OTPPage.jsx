import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw, Calendar, Loader2, Sparkles, ShieldCheck, ArrowRight, Mail } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || "";

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setStatus("idle");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const entered = otp.join("");
    if (entered.length !== 6) {
      setStatus("error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/otpverify", {
        otp: entered
      });

      if (response.data.success) {
        setStatus("success");
        toast.success("Account verified successfully!");
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error("OTP Verification error:", error);
      setStatus("error");
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/resend-otp", {
        email: email
      });

      if (response.data.success) {
        setOtp(["", "", "", "", "", ""]);
        setStatus("idle");
        setTimer(30);
        setCanResend(false);
        inputRefs.current[0]?.focus();
        toast.success("New OTP sent to your email!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 relative overflow-hidden">
      
      {/* Animated Background Orbs (Consistent with Login/Register) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float opacity-50"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-2000 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-100/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse opacity-30"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-blur-in">
          
          <div className="p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-10 animate-fade-in-up">
              <div className={`w-20 h-20 mx-auto rounded-[2rem] flex items-center justify-center mb-6 shadow-xl transition-all duration-500 scale-110 ${
                status === "success" 
                  ? "bg-emerald-500 text-white shadow-emerald-200 rotate-0" 
                  : "bg-indigo-600 text-white shadow-indigo-200"
              }`}>
                {status === "success" ? (
                  <Check className="w-10 h-10" />
                ) : (
                  <Mail className="w-10 h-10" />
                )}
              </div>

              <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-3">
                <Sparkles className="w-3 h-3" /> Secure Access
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
                {status === "success" ? "Access Granted!" : "Verify Your Account"}
              </h1>
              
              <p className="text-gray-500 font-medium tracking-tight px-4 leading-relaxed">
                {status === "success" 
                  ? "Authentication successful! Redirecting to your dashboard..."
                  : <>We've sent a 6-digit code to <span className="text-indigo-600 font-bold">{email || 'your email'}</span>. Please enter it below.</>
                }
              </p>
            </div>

            {/* OTP Input Section */}
            {status !== "success" && (
              <div className="space-y-8">
                <div className="flex justify-center gap-2 sm:gap-4 animate-fade-in-up animate-delay-100">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                      className={`w-12 sm:w-14 h-16 sm:h-20 text-center text-3xl font-bold rounded-2xl border-2 transition-all duration-300 outline-none ${
                        status === "error" 
                          ? "border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-100" 
                          : digit 
                          ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-100" 
                          : "border-gray-100 bg-gray-50 text-gray-900 focus:border-indigo-400 focus:bg-white focus:shadow-xl focus:shadow-indigo-50"
                      }`}
                    />
                  ))}
                </div>

                {/* Error/Status Bar */}
                <div className="h-6 flex items-center justify-center animate-fade-in-up animate-delay-200">
                  {status === "error" ? (
                    <div className="flex items-center gap-2 text-red-500 font-bold text-[10px] uppercase tracking-widest">
                      <X className="w-3 h-3" /> Invalid code. Please verify and try again
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Enter the 6-digit security code
                    </div>
                  )}
                </div>

                {/* Verify Button */}
                <div className="animate-fade-in-up animate-delay-300">
                  <button
                    onClick={verifyOtp}
                    disabled={otp.join("").length !== 6 || loading}
                    className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 group"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        VERIFY & PROCEED
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Resend Section */}
                <div className="text-center animate-fade-in-up animate-delay-400 pt-4">
                   {canResend ? (
                    <button
                      onClick={resendOtp}
                      className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-800 transition-colors border-b-2 border-indigo-50 hover:border-indigo-600 pb-0.5"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Resend Verification Code
                    </button>
                  ) : (
                    <p className="text-sm font-bold text-gray-400 tracking-tight">
                      Request new code in <span className="text-indigo-600">{timer}s</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Success State */}
            {status === "success" && (
              <div className="text-center animate-scale-in pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95"
                >
                  Return to Sign In
                </button>
              </div>
            )}

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest animate-fade-in-up animate-delay-500">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Verified Multi-Layer Security
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
