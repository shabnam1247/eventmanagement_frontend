import React, { useState } from 'react';
import { User, Lock, Calendar, Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header';

const Login = () => {
  const [formData, setFormData] = useState({
    registerNumber: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.registerNumber) {
      newErrors.registerNumber = 'Register number is required';
    } else if (!/^[A-Z0-9]{6,12}$/i.test(formData.registerNumber)) {
      newErrors.registerNumber = 'Invalid register number format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      alert(`Welcome ${formData.registerNumber}! Login successful.`);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-5rem)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            {/* Header */}
            <div className="px-8 pt-8 pb-6">
              <div className="flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-800">EventHub</h1>
                  <p className="text-sm text-gray-600">College Event Management</p>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
                <p className="text-gray-600 mt-1">Sign in to your account</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 pb-8">
              {/* Register Number */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Register Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.registerNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter register number"
                  />
                </div>
                {errors.registerNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.registerNumber}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="mb-5">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link would be sent')}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Register Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => alert('Redirect to registration')}
                    className="text-blue-600 font-medium hover:text-blue-800"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              © 2025 EventHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;