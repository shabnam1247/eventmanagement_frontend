import React, { useState } from "react";
import Header from "../components/Header";
import { ArrowLeft } from "lucide-react";

const EventRegistration = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    year: "",
    event: "",
    comments: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const departments = [
    "Computer Science",
    "Bachelor Of Computer Application",
    "Bachelor Of Business Administration",
    "Bachelor Of Commerce",
    "Geography",
    "Psychology",
    "Microbiology",
    "Islamic Studies"
  ];

  const events = [
    "Tech Symposium 2025",
    "AI & Cloud Workshop",
    "Annual Cultural Fest",
    "Music Night",
    "Coding Club Hackathon",
    "Photography Exhibition",
    "Cleanliness Drive",
    "Blood Donation Camp",
    "Inter-College Basketball",
    "Annual Sports Day"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            Event Registration
          </h1>
          <p className="text-blue-100">
            Fill in your details to register for the event
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            ✅ Registration successful! We'll send you a confirmation email shortly.
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="+91 98765 43210"
              />
            </div>

            {/* Department & Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <select
                  name="year"
                  required
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Event Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Event <span className="text-red-500">*</span>
              </label>
              <select
                name="event"
                required
                value={formData.event}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choose an event</option>
                {events.map((event, index) => (
                  <option key={index} value={event}>{event}</option>
                ))}
              </select>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any special requirements or questions..."
                rows="3"
              />
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                required
                checked={formData.terms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
                I agree to the terms and conditions <span className="text-red-500">*</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register Now
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>You'll receive a confirmation email within 24 hours.</p>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;