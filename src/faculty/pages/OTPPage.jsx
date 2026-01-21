import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw, GraduationCap, Loader2 } from 'lucide-react';
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
        toast.success("Email verified successfully!");
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
    // Note: Implementing resend logic if backend supports it
    // For now, reset UI state
    setOtp(["", "", "", "", "", ""]);
    setStatus("idle");
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
    toast.success("New OTP requested. Please check your email.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EventHub</h1>
              <p className="text-sm text-green-600 font-medium">Faculty Portal</p>
            </div>
          </div>
        </div>

        {/* OTP Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              status === "success" ? "bg-green-100" : "bg-green-100"
            }`}>
              {status === "success" ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "success" ? "Verified!" : "OTP Verification"}
            </h1>
            
            <p className="text-gray-600">
              {status === "success" 
                ? "Your faculty account has been verified"
                : `Enter the 6-digit code sent to ${email || 'your email'}`
              }
            </p>
          </div>

          {/* OTP Input Section */}
          {status !== "success" && (
            <>
              <div className="flex justify-center gap-3 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      status === "error" 
                        ? "border-red-500 bg-red-50" 
                        : digit 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Error Message */}
              {status === "error" && (
                <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                  <X className="w-4 h-4" />
                  <span className="text-sm">Invalid OTP. Please try again.</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={otp.join("").length !== 6 || loading}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="flex items-center justify-center gap-2 text-green-600 font-medium hover:text-green-800"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend OTP
                  </button>
                ) : (
                  <p className="text-sm text-gray-600">
                    Resend in <span className="font-medium">{timer}s</span>
                  </p>
                )}
              </div>
            </>
          )}

          {/* Success State */}
          {status === "success" && (
            <div className="text-center">
              <p className="text-green-600 font-medium mb-4">Redirecting to login...</p>
              <button
                onClick={() => navigate('/faculty/login')}
                className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 EventHub Faculty Portal • OTP Security</p>
        </div>
      </div>
    </div>
  );
}