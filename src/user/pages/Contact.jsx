import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import Header from '../components/Header';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Visit Us",
      details: "Ajas College, Perinthalmanna, Malappuram, Kerala"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Call Us",
      details: "+91 7994 188918"
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Us",
      details: "mail@ajascollege.ac.in"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have any questions or need further information about our events? 
            We'd love to hear from you!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <div className="text-blue-600">
                        {info.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {info.title}
                      </h3>
                      <p className="text-gray-600">
                        {info.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">
                  Working Hours
                </h3>
                <div className="text-gray-600 space-y-1">
                  <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                  <p>Saturday: 9:00 AM - 1:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter subject"
                  />
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
                    rows="5"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Type your message here..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Map Placeholder */}
            <div className="mt-8 bg-gray-200 rounded-xl p-4 text-center">
              <div className="h-48 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <p className="text-gray-700 font-medium">College Location Map</p>
                  <p className="text-sm text-gray-600">Ajas College, Perinthalmanna</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}