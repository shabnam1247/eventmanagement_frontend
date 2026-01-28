import React, { useEffect, useState } from "react";
import { CheckCircle, Calendar, MapPin, Clock, User, Mail, Phone, Building2, GraduationCap, Home, List, Eye } from "lucide-react";
import Header from "../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import confetti from "canvas-confetti";
import { QRCodeSVG } from "qrcode.react";

export default function RegistrationSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Get registration data from navigation state
    const regData = location.state?.registration;
    
    if (!regData) {
      // If no registration data, redirect to events
      navigate('/event');
      return;
    }

    setRegistration(regData);

    // Trigger confetti celebration
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const colors = ['#667eea', '#764ba2', '#f093fb'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }, []);

  if (!registration) {
    return null;
  }

  const eventDate = new Date(registration.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Registration Successful!</h1>
          <p className="text-xl text-gray-600">You're all set for the event</p>
        </div>

        {/* Registration ID & QR Ticket Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* ID Card */}
          <div className="h-full bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-10 text-white text-center shadow-2xl flex flex-col items-center justify-center transform hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/20 transition-all"></div>
            <p className="text-indigo-100 text-xs font-black mb-4 uppercase tracking-[0.3em]">Registration ID</p>
            <div className="bg-white/10 backdrop-blur-md px-4 py-6 rounded-2xl border border-white/20 mb-6 w-full">
              <p className="text-xl md:text-2xl font-mono font-black tracking-widest text-white break-all">
                {registration.id}
              </p>
            </div>
            <p className="text-xs text-indigo-100 font-medium leading-relaxed opacity-80">
              Save this unique identifier for manual check-in verification.
            </p>
          </div>

          {/* QR Card */}
          <div className="h-full bg-white rounded-[2.5rem] p-10 shadow-2xl border border-gray-100 flex flex-col items-center justify-center text-center transform hover:scale-[1.02] transition-transform">
            <div className="bg-gray-50 p-6 rounded-3xl border-2 border-dashed border-indigo-100 mb-6 scale-110">
              <QRCodeSVG 
                value={`REG_TICKET:${registration.id}`} 
                size={140}
                level="H"
                includeMargin={false}
              />
            </div>
            <h3 className="font-black text-gray-900 text-sm mb-2 uppercase tracking-widest">Digital Entry Ticket</h3>
            <p className="text-[10px] text-gray-400 font-bold px-4 leading-relaxed uppercase tracking-widest">
              Scan this QR code at the entrance for instant check-in.
            </p>
          </div>
        </div>

        {/* Event Details Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Event Details
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Event Name</p>
                    <p className="text-gray-900 font-bold">{registration.eventTitle}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date</p>
                    <p className="text-gray-900 font-bold">{eventDate}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Time</p>
                    <p className="text-gray-900 font-bold">{registration.eventTime}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Venue</p>
                    <p className="text-gray-900 font-bold">{registration.eventLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Your Information Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <User className="w-6 h-6" />
              Your Information
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="font-semibold text-gray-900">{registration.firstName} {registration.lastName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900 break-all">{registration.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{registration.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Department</p>
                  <p className="font-semibold text-gray-900">{registration.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-xs text-gray-500">Year</p>
                  <p className="font-semibold text-gray-900">{registration.year}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 rounded-2xl p-6 mb-8 border-l-4 border-yellow-400">
          <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
            ⚠️ Important Information
          </h3>
          <ul className="space-y-2 text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>A confirmation email has been sent to <strong>{registration.email}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Please arrive <strong>15 minutes before</strong> the event starts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Keep your <strong>Registration ID</strong> handy for check-in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>Check your email for complete event details</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate(`/myevents`)}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all shadow-lg"
          >
            <List className="w-5 h-5" />
            View My Events
          </button>

          <button
            onClick={() => navigate('/event')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transform hover:-translate-y-1 transition-all shadow-lg"
          >
            <Eye className="w-5 h-5" />
            Browse More Events
          </button>

          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transform hover:-translate-y-1 transition-all shadow-lg"
          >
            <Home className="w-5 h-5" />
            Go to Home
          </button>
        </div>

        {/* Success Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-lg">
            We're excited to see you at the event! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}
