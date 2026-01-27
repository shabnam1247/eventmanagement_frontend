import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw, ShieldCheck, Loader2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Toaster position="top-right" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 shadow-sm ${
            status === 'success' ? 'bg-green-600' : 'bg-blue-600'
          }`}>
            {status === 'success' ? 
              <Check className="w-6 h-6 text-white" /> : 
              <ShieldCheck className="w-6 h-6 text-white" />
            }
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
          <p className="text-sm text-gray-600">
            {status === "success" 
              ? "Account verified successfully!"
              : `Enter the 6-digit code sent to ${email || 'your email'}`
            }
          </p>
        </div>

        {/* OTP Input Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {status !== "success" && (
            <div className="space-y-6">
              {/* OTP Inputs */}
              <div className="flex justify-center gap-2 mb-6">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-bold rounded-lg border-2 transition-all focus:outline-none
                      ${status === "error" 
                        ? "border-red-300 bg-red-50 text-red-600" 
                        : digit 
                        ? "border-blue-500 bg-blue-50 text-blue-600" 
                        : "border-gray-300 focus:border-blue-500"}`}
                  />
                ))}
              </div>

              {status === "error" && (
                <div className="flex items-center justify-center gap-2 text-red-600 text-sm">
                  <X className="w-4 h-4" />
                  <span>Invalid code entered</span>
                </div>
              )}

              {/* Verify Button */}
              <button
                onClick={verifyOtp}
                disabled={otp.join("").length !== 6 || loading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </button>

              {/* Resend Section */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
                
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Resend Code
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span>Resend available in {timer}s</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="text-center space-y-4">
              <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                <p className="text-green-600 font-bold mb-2">Verification Complete!</p>
                <p className="text-sm text-green-600">Redirecting to login...</p>
              </div>
              <button
                onClick={() => navigate('/faculty/login')}
                className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Go to Login
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Security code expires in 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
