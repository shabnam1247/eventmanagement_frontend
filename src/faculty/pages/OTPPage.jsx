import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw, GraduationCap, Loader2, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function FacultyOTPVerification() {
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
      const response = await axios.post("http://localhost:5000/api/faculty/otpverify", {
        otp: entered
      });

      if (response.status === 200) {
        setStatus("success");
        toast.success("Verification successful!");
        setTimeout(() => {
          navigate('/faculty/login');
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
    setOtp(["", "", "", "", "", ""]);
    setStatus("idle");
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    toast.success("New OTP has been sent to your email.");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-12 relative overflow-hidden">
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
            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-2xl relative group transition-all
               ${status === 'success' ? 'bg-emerald-500 shadow-emerald-100' : 'bg-blue-600 shadow-blue-100'}
            `}>
              {status === 'success' ? <Check className="w-10 h-10 text-white" /> : <ShieldCheck className="w-10 h-10 text-white" />}
              <div className="absolute -top-2 -right-2 bg-white rounded-lg p-1.5 shadow-lg border border-gray-50 text-blue-600">
                 <Zap className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight leading-none">OTP <span className="text-blue-600">Verify</span></h1>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mt-3">Finalizing your registration</p>
            </div>
          </div>
        </div>

        {/* OTP Input Card */}
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-100/50 p-12 relative">
          <div className="text-center mb-10">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-relaxed">
              {status === "success" 
                ? "Account verified successfully!"
                : `Enter the 6-digit code sent to ${email || 'your email'}`
              }
            </p>
          </div>

          {status !== "success" && (
            <div className="space-y-10">
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`
                      w-12 h-16 text-center text-2xl font-black rounded-2xl transition-all border-none
                      ${status === "error" 
                        ? "bg-rose-50 text-rose-600 ring-4 ring-rose-100" 
                        : digit 
                        ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                        : "bg-gray-50 text-gray-800 focus:ring-4 focus:ring-blue-50"}
                    `}
                  />
                ))}
              </div>

              {status === "error" && (
                <div className="flex items-center justify-center gap-2 text-rose-500 font-black text-xs uppercase tracking-widest animate-bounce">
                  <X className="w-4 h-4" />
                  <span>Invalid Code Entered</span>
                </div>
              )}

              <button
                onClick={verifyOtp}
                disabled={otp.join("").length !== 6 || loading}
                className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transition-all hover:-translate-y-1 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Verify OTP
                    <Sparkles className="w-4 h-4 mt-0.5" />
                  </>
                )}
              </button>

              <div className="text-center space-y-4">
                <p className="text-xs font-black text-gray-300 uppercase tracking-widest">
                  Didn't receive code?
                </p>
                
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="flex items-center justify-center gap-2 text-blue-600 font-black text-xs uppercase tracking-widest hover:text-blue-800 transition-colors mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl w-fit mx-auto border border-gray-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      Resend in <span className="text-gray-900">{timer}s</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-8 animate-in fade-in zoom-in duration-500">
              <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100 space-y-4">
                 <p className="text-emerald-600 font-black text-xs uppercase tracking-widest leading-none">Verified!</p>
                 <p className="text-xs font-bold text-emerald-400 uppercase tracking-tight">Redirecting to login in 2 seconds...</p>
              </div>
              <button
                onClick={() => navigate('/faculty/login')}
                className="w-full py-5 bg-emerald-600 text-white font-black rounded-[2rem] uppercase tracking-[0.2em] text-sm shadow-xl shadow-emerald-100 flex items-center justify-center gap-3"
              >
                Go to Login
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Information Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
           <p className="text-xs font-black text-gray-300 uppercase tracking-[0.4em]">EventHub Security Verification</p>
        </div>
      </div>
    </div>
  );
}

