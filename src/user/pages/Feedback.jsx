import React, { useState } from "react";
import { MessageSquare, Star, Send, CheckCircle, User, Mail, Phone } from "lucide-react";
import Header from "../components/Header";

const FeedbackForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    rating: 0,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message || formData.rating === 0) {
      alert("Please fill all required fields");
      return;
    }

    setSubmitted(true);
    
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        rating: 0,
        message: "",
      });
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Feedback</h1>
          </div>
          <p className="text-gray-600">
            We value your feedback to improve our services
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {!submitted ? (
              <>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Share Your Feedback
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                          className="p-1"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= formData.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Write your feedback here..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Submit Feedback
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Thank You!
                </h3>
                <p className="text-gray-600">
                  Your feedback has been submitted successfully.
                </p>
              </div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Why Your Feedback Matters
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Improve Services</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Your feedback helps us enhance our services and user experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Quality Check</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    We use ratings to maintain and improve service quality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Quick Response</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    We review all feedback and respond to important issues promptly.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-8 pt-6 border-t border-blue-200">
              <h3 className="font-medium text-gray-900 mb-3">Need Help?</h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Email: support@college.edu</p>
                <p className="text-sm text-gray-600">Phone: +91 7994 188918</p>
                <p className="text-sm text-gray-600">Hours: Mon-Fri, 9AM-5PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;