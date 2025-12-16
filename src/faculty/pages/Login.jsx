import React, { useState } from "react";
import { Lock, Mail, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FacultyLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (email === "faculty@example.com" && password === "faculty123") {
        navigate("/faculty/events"); // Redirect to faculty panel
      } else {
        setError("Invalid credentials. Please try again.");
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
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
          <p className="text-gray-600">Sign in to access the faculty dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Faculty Login</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="faculty@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your password"
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Demo: faculty@example.com / faculty123
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Notice */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <GraduationCap className="w-4 h-4 text-green-600" />
              <span>For faculty members only. Contact admin for access.</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 EventHub Faculty Portal • v2.0</p>
          <p className="mt-1 text-xs">Authorized faculty access only</p>
        </div>
      </div>
    </div>
  );
};

export default FacultyLogin;