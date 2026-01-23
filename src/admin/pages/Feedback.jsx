import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Calendar, User, Mail, Loader2, AlertCircle } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import axios from "axios";
import toast from "react-hot-toast";

const AdminFeedbackList = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/feedbacks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.success) {
        setFeedbacks(response.data.feedbacks);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3 font-sans tracking-tight">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            Student Feedback
          </h1>
          <p className="text-gray-500 font-medium tracking-tight">Direct suggestions and reviews from the student community</p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl p-20 text-center border-2 border-dashed border-gray-100 italic">
            <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-400 mb-2">No Feedback Yet</h2>
            <p className="text-gray-400">Feedback submitted by users will appear here once available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback._id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-yellow-50 px-3 py-1.5 rounded-xl border border-yellow-100">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <blockquote className="text-gray-700 leading-relaxed font-medium italic mb-8 relative">
                    <span className="text-4xl text-blue-100 absolute -top-4 -left-4">"</span>
                    {feedback.message}
                    <span className="text-4xl text-blue-100 absolute -bottom-8 -right-4">"</span>
                  </blockquote>
                </div>

                <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-100">
                      {feedback.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{feedback.name}</h4>
                      <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1 font-sans italic">
                        <Mail className="w-3 h-3" />
                        {feedback.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminFeedbackList;
