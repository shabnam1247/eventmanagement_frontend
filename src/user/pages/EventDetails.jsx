import React from "react";
import { Calendar, MapPin, Clock, Users, ArrowLeft } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function EventDetails() {
  const navigate = useNavigate();
  
  const event = {
    title: "Tech Innovators Summit 2025",
    date: "November 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "TechPark Auditorium, Bangalore",
    description:
      "Join the biggest technology event of the year where industry leaders, innovators, and developers come together to share ideas, launch projects, and explore the future of AI and software development.",
    image:
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?auto=format&fit=crop&w=1600&q=80",
    schedule: [
      { time: "09:00 AM", activity: "Opening Ceremony" },
      { time: "10:00 AM", activity: "Keynote by Elon Dsouza" },
      { time: "11:30 AM", activity: "Panel: Future of AI" },
      { time: "01:00 PM", activity: "Networking Lunch" },
      { time: "02:30 PM", activity: "Tech Demos & Startup Pitches" },
      { time: "04:00 PM", activity: "Closing Remarks" },
    ],
    speakers: [
      {
        name: "Elon Dsouza",
        title: "CEO, FutureTech Labs",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        name: "Dr. Riya Nair",
        title: "AI Researcher, DeepVision",
        img: "https://randomuser.me/api/portraits/women/65.jpg",
      },
      {
        name: "Arjun Patel",
        title: "CTO, InnovateX",
        img: "https://randomuser.me/api/portraits/men/44.jpg",
      },
    ],
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="h-64 md:h-80 overflow-hidden">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{event.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Venue</p>
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRegister}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Register Now
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Description & Schedule */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About the Event</h2>
              <p className="text-gray-600 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* Schedule Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Event Schedule</h2>
              </div>
              
              <div className="space-y-4">
                {event.schedule.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-20 flex-shrink-0">
                      <span className="font-medium text-gray-900">{item.time}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-800">{item.activity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Speakers */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Speakers</h2>
              </div>
              
              <div className="space-y-6">
                {event.speakers.map((speaker, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <img
                      src={speaker.img}
                      alt={speaker.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{speaker.name}</h3>
                      <p className="text-sm text-gray-600">{speaker.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Date: {event.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Time: {event.time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700">Venue: {event.location}</span>
                </div>
              </div>
              
              <button
                onClick={handleRegister}
                className="w-full mt-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register for Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}