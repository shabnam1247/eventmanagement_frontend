import React, { useState } from "react";
import { User, Mail, Phone, Lock, ArrowLeft, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
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
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.facultyId.trim()) {
      newErrors.facultyId = "Faculty ID is required";
    } else if (!facultyIdRegex.test(formData.facultyId)) {
      newErrors.facultyId = "Format: FAC followed by 4 digits (e.g., FAC1001)";
    }
    if (!formData.department) {
      newErrors.department = "Department is required";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Registration Data:", formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/faculty/login');
      }, 2000);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/faculty/login')}
          className="flex items-center gap-2 text-green-600 hover:text-green-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </button>

        {/* Registration Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Faculty Register</h1>
                <p className="text-sm text-green-600">Create your faculty account</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm">Register to access the faculty portal</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              ✓ Registration successful! Redirecting to login...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="faculty@college.edu"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Faculty ID and Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Faculty ID *
                </label>
                <input
                  type="text"
                  name="facultyId"
                  value={formData.facultyId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.facultyId ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="FAC1001"
                />
                {errors.facultyId && (
                  <p className="mt-1 text-xs text-red-600">{errors.facultyId}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.department ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Department</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Minimum 6 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Register as Faculty
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/faculty/login')}
                className="text-green-600 font-medium hover:text-green-800"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2025 EventHub Faculty Portal • Authorized registration only</p>
        </div>
      </div>
    </div>
  );
}