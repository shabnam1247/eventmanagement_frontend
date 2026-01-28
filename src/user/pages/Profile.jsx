import React, { useState, useEffect } from "react";
import { 
  FaUser, 
  FaEnvelope, 
  FaGraduationCap, 
  FaCalendarAlt, 
  FaAward, 
  FaPhone, 
  FaEdit, 
  FaKey, 
  FaSignOutAlt, 
  FaCamera,
  FaCheckCircle,
  FaClock,
  FaUserGraduate,
  FaIdCard,
  FaArrowRight
} from "react-icons/fa";
import { Loader2 } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const StudentProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: "",
    phonenumber: "",
    department: "",
    year: ""
  });
  
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }
    const loggedInUser = JSON.parse(userData);
    fetchProfile(loggedInUser._id);
    fetchRegistrations(loggedInUser._id);
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);
      if (response.data.success) {
        setUser(response.data.user);
        setProfileForm({
          name: response.data.user.name || "",
          phonenumber: response.data.user.phonenumber || "",
          department: response.data.user.department || "",
          year: response.data.user.year || ""
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile details");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/registrations/${userId}`);
      if (response.data.success) {
        setRegistrations(response.data.registrations);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/users/profile/${user._id}`, profileForm);
      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUser(response.data.user);
        
        // Update local storage as well
        const userData = JSON.parse(localStorage.getItem("userData"));
        localStorage.setItem("userData", JSON.stringify({ ...userData, ...response.data.user }));
        
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/users/profile/${user._id}/change-password`, {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      if (response.data.success) {
        toast.success("Password changed successfully!");
        setShowPasswordModal(false);
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      {/* Profile Header Background */}
      <div className="h-48 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 relative">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-500 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-100/50 border border-gray-100 p-8 text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors"></div>
              
              <div className="relative mb-6">
                <div className="w-36 h-36 mx-auto rounded-[2rem] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-full rounded-[1.8rem] bg-white flex items-center justify-center overflow-hidden">
                    <FaUserGraduate className="w-16 h-16 text-indigo-600" />
                  </div>
                </div>
                <button className="absolute bottom-1 right-1/2 translate-x-12 translate-y-1 w-10 h-10 bg-white shadow-lg rounded-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all border border-gray-100">
                  <FaCamera className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-indigo-600 font-bold text-sm tracking-widest uppercase mb-6">{user?.department || "Department Not Set"}</p>

              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="bg-indigo-50 p-3 rounded-2xl">
                  <p className="text-xs font-black text-indigo-400 uppercase mb-1">Total</p>
                  <p className="text-lg font-black text-indigo-900">{registrations.length}</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-2xl">
                  <p className="text-xs font-black text-purple-400 uppercase mb-1">Active</p>
                  <p className="text-lg font-black text-purple-900">
                    {registrations.filter(r => r.event?.status === 'upcoming').length}
                  </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-2xl">
                  <p className="text-xs font-black text-emerald-400 uppercase mb-1">Done</p>
                  <p className="text-lg font-black text-emerald-900">
                    {registrations.filter(r => r.event?.status === 'completed').length}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-left">
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                    <FaIdCard />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Register No</p>
                    <p className="text-sm font-bold text-gray-700">{user?.regno || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                    <FaEnvelope />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-sm font-bold text-gray-700 truncate">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-transparent hover:border-indigo-100 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                    <FaPhone />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-bold text-gray-700">{user?.phonenumber || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-3">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
                >
                  <FaEdit /> Edit Profile
                </button>
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                >
                  <FaKey /> Change Password
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* My Registrations Section */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 md:p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recent <span className="text-indigo-600">Events</span></h2>
                  <p className="text-gray-400 font-medium">Your event participation history</p>
                </div>
                <button 
                  onClick={() => navigate('/myevents')}
                  className="px-6 py-2.5 bg-indigo-50 text-indigo-600 rounded-full font-bold text-sm hovre:bg-indigo-100 transition-all flex items-center gap-2"
                >
                  Manage All <FaCalendarAlt className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-4">
                {registrations.length > 0 ? (
                  registrations.slice(0, 4).map((reg) => (
                    <div 
                      key={reg._id}
                      className="group flex flex-col md:flex-row items-start md:items-center gap-4 p-5 rounded-3xl border border-gray-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all"
                    >
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                         <img 
                          src={reg.event?.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800"} 
                          alt={reg.event?.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded-full">
                            {reg.event?.category}
                          </span>
                          <span className="text-[10px] font-black text-gray-400 flex items-center gap-1">
                            <FaClock className="w-2 h-2" /> {reg.event?.timing}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">{reg.event?.title}</h3>
                        <p className="text-gray-500 text-sm font-medium flex items-center gap-1 mt-1">
                          <FaCalendarAlt className="w-3 h-3 opacity-50" /> 
                          {new Date(reg.event?.date).toLocaleDateString('en-US', { day:'numeric', month:'short', year:'numeric' })}
                        </p>
                      </div>
                      <div className="shrink-0 flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] ${
                          reg.event?.status === 'upcoming' 
                            ? 'bg-amber-100 text-amber-600' 
                            : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {reg.event?.status === 'upcoming' ? 'Registered' : 'Completed'}
                        </span>
                        <button 
                          onClick={() => navigate(`/eventdetails/${reg.event?._id}`)}
                          className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
                        >
                          <FaArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-100 rounded-[2rem]">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <FaAward className="w-8 h-8" />
                    </div>
                    <p className="text-gray-500 font-bold mb-2">No event records found</p>
                    <button onClick={() => navigate('/event')} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Register for your first event</button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions / Info Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-[2rem] p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span className="p-2 bg-white/10 rounded-lg"><FaAward className="text-amber-400" /></span> 
                  My Certificates
                </h3>
                <p className="text-indigo-200 text-sm mb-6 leading-relaxed">View and download certificates for events you've successfully completed.</p>
                <button className="px-6 py-3 bg-white text-indigo-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all">
                  Open Vault
                </button>
              </div>
              <div className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-3xl group-hover:bg-emerald-100 transition-colors"></div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><FaCheckCircle /></span> 
                  Profile Verification
                </h3>
                <div className="flex items-center gap-2 text-emerald-600 font-bold mb-6">
                   <FaCheckCircle className="w-4 h-4" /> 
                   <span className="text-sm">Account Verified</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Your identity has been verified by the college administration office.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditing(false)}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl relative z-10 w-full max-w-lg p-8 md:p-12 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Edit <span className="text-indigo-600">Profile</span></h2>
            <p className="text-gray-400 font-medium mb-8">Update your basic academic information</p>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                <input 
                  type="text" 
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({...profileForm, name: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Phone Number</label>
                <input 
                  type="text" 
                  value={profileForm.phonenumber}
                  onChange={(e) => setProfileForm({...profileForm, phonenumber: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Department</label>
                  <input 
                    type="text" 
                    value={profileForm.department}
                    onChange={(e) => setProfileForm({...profileForm, department: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  />
                </div>
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Year</label>
                  <select 
                    value={profileForm.year}
                    onChange={(e) => setProfileForm({...profileForm, year: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Save Changes</button>
                <button type="button" onClick={() => setIsEditing(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
          <div className="bg-white rounded-[3rem] shadow-2xl relative z-10 w-full max-w-lg p-8 md:p-12 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-black text-gray-900 mb-2">Secure <span className="text-indigo-600">Account</span></h2>
            <p className="text-gray-400 font-medium mb-8">Update your login password regularly for safety</p>

            <form onSubmit={handleChangePassword} className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Old Password</label>
                <input 
                  type="password" 
                  value={passwordForm.oldPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  required
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 group-focus-within:text-indigo-600 transition-colors">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 transition-all font-bold text-gray-700"
                  required
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all">Update Password</button>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default StudentProfilePage;