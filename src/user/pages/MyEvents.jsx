import React, { useState, useEffect } from "react";
import { 
  Calendar, MapPin, Clock, Users, ArrowRight, Loader2, 
  Trash2, QrCode as QrIcon, X, CheckCircle2, AlertCircle
} from "lucide-react";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";

export default function MyEvents() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [regToCancel, setRegToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      toast.error("Please login to view your events");
      navigate("/login");
      return;
    }
    const user = JSON.parse(userData);
    setUserId(user._id);
    fetchRegistrations(user._id);
  }, []);

  const fetchRegistrations = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/users/registrations/${id}`);
      if (response.data.success) {
        setRegistrations(response.data.registrations);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
      toast.error("Failed to load your events");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQr = (reg) => {
    setSelectedReg(reg);
    setShowQrModal(true);
  };

  const handleOpenCancel = (reg) => {
    setRegToCancel(reg);
    setShowCancelModal(true);
  };

  const handleCancelRegistration = async () => {
    if (!regToCancel) return;
    try {
      setCancelling(true);
      const response = await axios.delete(`http://localhost:5000/api/users/registrations/${regToCancel._id}`);
      if (response.data.success) {
        toast.success("Registration cancelled successfully");
        setRegistrations(registrations.filter(r => r._id !== regToCancel._id));
        setShowCancelModal(false);
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      toast.error(error.response?.data?.message || "Failed to cancel registration");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      <Toaster position="top-right" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              My <span className="text-indigo-600">Events</span>
            </h1>
            <p className="text-gray-500 mt-1">Manage your event registrations and check-ins</p>
          </div>
          <Link
            to="/event"
            className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all shadow-md active:scale-95"
          >
            Explore More Events
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 mt-10">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No registered events yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't registered for any events yet. Browse our events and join the excitement!
            </p>
            <Link
              to="/event"
              className="inline-flex items-center px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Browse Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {registrations.map((reg) => (
              <div 
                key={reg._id} 
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Placeholder or Actual Image */}
                <div className="relative h-48 bg-gray-200">
                   <img 
                    src={reg.event?.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop&q=60"} 
                    alt={reg.event?.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
                      reg.event?.status === 'upcoming' 
                        ? 'bg-green-500/90 text-white' 
                        : reg.event?.status === 'ongoing'
                        ? 'bg-blue-500/90 text-white'
                        : 'bg-gray-500/90 text-white'
                    }`}>
                      {reg.event?.status?.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[10px] font-black tracking-widest text-indigo-600 uppercase">
                      {reg.event?.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-1">
                    {reg.event?.title}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">
                      <Calendar className="w-4 h-4 mr-3 shrink-0" />
                      <span className="font-medium">
                        {new Date(reg.event?.date).toLocaleDateString('en-US', {
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-3 shrink-0" />
                      <span className="font-medium">{reg.event?.timing}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-3 shrink-0" />
                      <span className="font-medium line-clamp-1">{reg.event?.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleOpenQr(reg)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-all duration-300"
                    >
                      <QrIcon className="w-4 h-4" />
                      QR Ticket
                    </button>
                    <button
                      onClick={() => navigate(`/eventdetails/${reg.event._id}`)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 text-gray-600 rounded-2xl font-bold hover:bg-gray-100 transition-all duration-300"
                    >
                      Details
                    </button>
                  </div>

                  {reg.event?.status === 'upcoming' && (
                    <button
                      onClick={() => handleOpenCancel(reg)}
                      className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 text-red-100 hover:text-red-600 bg-red-600 hover:bg-red-50 rounded-2xl font-bold transition-all duration-300 border border-transparent hover:border-red-100 group/cancel"
                    >
                      <Trash2 className="w-4 h-4" />
                      Cancel Registration
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Modal */}
      {showQrModal && selectedReg && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowQrModal(false)}></div>
            <div className="bg-white rounded-[40px] shadow-2xl relative z-10 w-full max-w-sm overflow-hidden transform animate-in fade-in zoom-in duration-300">
              <div className="bg-indigo-600 p-8 text-center text-white relative">
                 <button 
                  onClick={() => setShowQrModal(false)}
                  className="absolute top-4 right-4 p-2 bg-indigo-500 hover:bg-indigo-400 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold mb-1">Entry Ticket</h3>
                <p className="text-indigo-100 text-sm">Present this QR code at the entrance</p>
              </div>
              
              <div className="p-8 text-center">
                <div className="bg-white p-4 rounded-3xl shadow-inner inline-block border-4 border-indigo-50 mb-6">
                  <QRCodeSVG 
                    value={`REG_TICKET:${selectedReg._id}`} 
                    size={180}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
                
                <h4 className="font-bold text-gray-900 text-lg mb-1">{selectedReg.event?.title}</h4>
                <p className="text-gray-500 text-sm mb-6 uppercase tracking-widest font-black text-[10px] bg-gray-50 py-1 px-3 rounded-full inline-block">
                  Reg ID: {selectedReg._id}
                </p>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
                  >
                    Download / Save Ticket
                  </button>
                  <button
                    onClick={() => setShowQrModal(false)}
                    className="w-full py-2.5 text-gray-500 font-bold hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && regToCancel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}></div>
            <div className="bg-white rounded-3xl shadow-2xl relative z-10 w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
               <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Cancel Registration?</h3>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Are you sure you want to cancel your registration for <span className="font-bold text-gray-900">"{regToCancel.event?.title}"</span>? This action cannot be undone.
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                  >
                    No, Keep it
                  </button>
                  <button
                    onClick={handleCancelRegistration}
                    disabled={cancelling}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {cancelling ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Yes, Cancel"
                    )}
                  </button>
                </div>
            </div>
          </div>
      )}
    </div>
  );
}
