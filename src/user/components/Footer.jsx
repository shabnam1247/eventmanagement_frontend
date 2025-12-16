import React from 'react'
import { FaFacebookF, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaEnvelope, 
  FaPhone,  FaMapMarkerAlt,
  FaUniversity, } from 'react-icons/fa'

function Footer() {
  return (
    <div>
        <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* College Info */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaUniversity className="text-white text-2xl" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Al Jamia</h3>
                  <p className="text-cyan-300">Arts & Science College</p>
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                Perinthalmanna, Poopalam Valambur (P.O), Malappuram Dt, Kerala, India, Pin-679325
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-cyan-400" />
                  <a href="mailto:artscollege@aljamia.net" className="text-gray-300 hover:text-white">
                    artscollege@aljamia.net
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaPhone className="text-cyan-400" />
                  <a href="tel:+917994188918" className="text-gray-300 hover:text-white">
                    +91 7994 188918
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-cyan-400" />
                  <span className="text-gray-300">University of Calicut Affiliated</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Quick Links</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <ul className="space-y-3">
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">University of Calicut</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Exam Notifications</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">University Results</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">MHRD India</a></li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3">
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Admission</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">IQAC</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Faculties</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-cyan-400 transition-colors">Contact Us</a></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Social & Newsletter */}
            <div>
              <h4 className="text-xl font-bold mb-6 text-white">Stay Connected</h4>
              <p className="text-gray-300 mb-6">
                Subscribe to get updates on upcoming events and college news.
              </p>
              <div className="flex gap-2 mb-8">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-shadow">
                  Subscribe
                </button>
              </div>
              <div className="flex gap-4">
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-cyan-600 transition-colors">
                  <FaFacebookF />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <FaInstagram />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <FaLinkedinIn />
                </a>
                <a href="#" className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 md:mb-0">
              © 2025 Al Jamia Arts & Science College. All Rights Reserved.
              <a href="#" className="text-cyan-400 hover:text-cyan-300 ml-2">
                Privacy Policy
              </a>
            </p>
            <div className="flex items-center gap-6">
              <span className="text-gray-400">NAAC Accredited</span>
              <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-sm font-semibold">
                ISO 9001:2015 Certified
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer