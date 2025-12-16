import React, { useState, useRef, useEffect } from 'react';
import { Check, X, RefreshCw } from 'lucide-react';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [status, setStatus] = useState('idle');
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);
  const correctOtp = "123456";

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

  const verifyOtp = () => {
    const entered = otp.join("");
    if (entered.length !== 6) {
      setStatus("error");
      return;
    }
    if (entered === correctOtp) {
      setStatus("success");
    } else {
      setStatus("error");
      setTimeout(() => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }, 1000);
    }
  };

  const resendOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    setStatus("idle");
    setTimer(30);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
              status === "success" ? "bg-green-100" : "bg-blue-100"
            }`}>
              {status === "success" ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              )}
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {status === "success" ? "Verified!" : "OTP Verification"}
            </h1>
            
            <p className="text-gray-600">
              {status === "success" 
                ? "Your account has been verified successfully"
                : "Enter the 6-digit code sent to your phone"
              }
            </p>
            
            {status === "idle" && (
              <p className="text-sm text-gray-500 mt-2">
                Demo code: <span className="font-medium text-blue-600">123456</span>
              </p>
            )}
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
                    className={`w-12 h-14 text-center text-2xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      status === "error" 
                        ? "border-red-500 bg-red-50" 
                        : digit 
                        ? "border-blue-500 bg-blue-50" 
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
                disabled={otp.join("").length !== 6}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
              >
                Verify OTP
              </button>

              {/* Resend Section */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                
                {canResend ? (
                  <button
                    onClick={resendOtp}
                    className="flex items-center justify-center gap-2 text-blue-600 font-medium hover:text-blue-800"
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
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 text-blue-600 font-medium hover:text-blue-800"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}