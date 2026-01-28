import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaPaperPlane, 
  FaClock, 
  FaGlobe, 
  FaInfoCircle
} from 'react-icons/fa';
import Header from '../components/Header';
import Footer from '../components/Footer';
import toast from 'react-hot-toast';

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
    console.log('Form submitted:', formData);
    toast.success('Message sent! Our team will contact you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactCards = [
    {
      icon: <FaMapMarkerAlt />,
      title: "Our Campus",
      details: "Poopalam, Valambur P.O., Perinthalmanna, Malappuram, Kerala - 679325",
      color: "from-blue-500 to-cyan-500",
      link: "https://maps.google.com/maps?q=Al%20Jamia%20Arts%20and%20Science%20College%20Perinthalmanna"
    },
    {
      icon: <FaPhone />,
      title: "Call Us",
      details: "+91 4933 227 918, +91 7994 188 918",
      color: "from-purple-500 to-pink-500",
      link: "tel:+914933227918"
    },
    {
      icon: <FaEnvelope />,
      title: "Email Us",
      details: "artscollege@aljamia.net, mail@ajascollege.ac.in",
      color: "from-green-500 to-emerald-500",
      link: "mailto:artscollege@aljamia.net"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* Hero Section - Matching Home.jsx style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 py-20 px-4">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-cyan-300 rounded-full text-sm font-semibold mb-6 tracking-wider uppercase">
            CONTACT US
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Get in <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto font-medium">
            Have questions about our events or programs? We're here to help you throughout your campus journey.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {contactCards.map((card, index) => (
                <a 
                  key={index}
                  href={card.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 flex items-start gap-4 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} text-white text-xl group-hover:scale-110 transition-transform`}>
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{card.title}</h3>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{card.details}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Working Hours - Dark Style matching Stats section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full"></div>
               <h3 className="flex items-center gap-2 text-xl font-bold mb-6">
                 <FaClock className="text-cyan-400" /> Working Hours
               </h3>
               <div className="space-y-4 font-medium">
                 <div className="flex justify-between border-b border-white/10 pb-3">
                   <span className="text-gray-400">Monday - Friday</span>
                   <span>9 AM - 5 PM</span>
                 </div>
                 <div className="flex justify-between border-b border-white/10 pb-3">
                   <span className="text-gray-400">Saturday</span>
                   <span>9 AM - 1 PM</span>
                 </div>
                 <div className="flex justify-between text-pink-400 pb-1">
                   <span className="opacity-80">Sunday</span>
                   <span className="font-bold">CLOSED</span>
                 </div>
               </div>
               <div className="mt-8 flex items-center gap-3 text-xs text-gray-400 font-bold tracking-widest uppercase">
                 <FaGlobe className="text-emerald-400" /> IST Standard Time
               </div>
            </div>
          </div>

          {/* Right Column: Form & Map */}
          <div className="lg:col-span-8 space-y-8">
            {/* Real Map Integration */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-3 h-[400px]">
              <iframe
                title="College Location"
                src="https://maps.google.com/maps?q=Al%20Jamia%20Arts%20and%20Science%20College%20Perinthalmanna&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="rounded-2xl border-0"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

            {/* Premium Form */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
              <div className="inline-flex py-1 px-3 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold mb-4 uppercase tracking-wider">
                Send a Message
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">How can we help you?</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Enter your email"
                      className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Enter subject"
                    className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Tell us more about your inquiry..."
                    className="w-full px-6 py-5 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all font-medium resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-10 py-4 bg-gradient-to-r from-indigo-900 to-purple-900 text-white font-bold rounded-2xl hover:shadow-2xl transform hover:-translate-y-1 transition-all flex items-center gap-3"
                >
                  <FaPaperPlane className="text-sm" />
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
