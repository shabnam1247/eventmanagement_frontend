import React from "react";
import { Users, Calendar, Bell, MessageSquare, BarChart, Settings, Target } from "lucide-react";
import Header from "../components/Header";

export default function AboutPage() {
  const services = [
    {
      title: "Students",
      icon: <Users className="w-6 h-6" />,
      items: ["Explore upcoming events", "Register instantly", "Receive reminders", "View schedules"]
    },
    {
      title: "Faculty",
      icon: <Calendar className="w-6 h-6" />,
      items: ["Create and manage events", "Track participation", "Communicate with students", "Manage event details"]
    },
    {
      title: "Administrators",
      icon: <Settings className="w-6 h-6" />,
      items: ["Approve & monitor events", "Manage accounts", "Send announcements", "Access analytics"]
    }
  ];

  const features = [
    { icon: <Calendar className="w-5 h-5" />, title: "Event Management", desc: "Organize and schedule all campus events" },
    { icon: <Bell className="w-5 h-5" />, title: "Real-Time Notifications", desc: "Stay updated with instant alerts" },
    { icon: <MessageSquare className="w-5 h-5" />, title: "Chat System", desc: "Communicate with event organizers" },
    { icon: <BarChart className="w-5 h-5" />, title: "Analytics", desc: "Track event participation and engagement" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            About EventHub
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            College Event Management System
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <p className="text-gray-700 leading-relaxed">
            EventHub is a unified digital platform designed to simplify and modernize how events are managed across the campus. 
            From technical workshops and cultural programs to seminars and sports activities, the system brings every event 
            into one organized space—making participation easier, communication faster, and management more efficient.
          </p>
        </div>

        {/* Our Purpose */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Purpose</h2>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <p className="text-gray-700 text-center">
              Our goal is to transform the traditional event-handling process into a smooth, digital experience. 
              We aim to reduce paperwork, eliminate communication gaps, and provide students, faculty, and 
              administrators with a reliable and intuitive system.
            </p>
          </div>
        </div>

        {/* Who We Serve */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Who We Serve</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    index === 0 ? 'bg-blue-100 text-blue-600' :
                    index === 1 ? 'bg-purple-100 text-purple-600' :
                    'bg-indigo-100 text-indigo-600'
                  }`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <ul className="space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What The System Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                  <div className="text-gray-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Vision */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Vision</h2>
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-lg">
              We envision a campus where events are more engaging, communication is effortless, 
              and participation is accessible to every student.
            </p>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📧</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Email</p>
                <p className="text-gray-600">support@collegeevents.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-lg">📍</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Location</p>
                <p className="text-gray-600">IT Department, Campus Block A</p>
              </div>
            </div>
          </div>
          <p className="text-center text-gray-600">
            For support or feature requests, reach out anytime.
          </p>
        </div>
      </div>
    </div>
  );
}