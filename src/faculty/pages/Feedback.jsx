import React, { useState, useEffect } from "react";
import { MessageSquare, Star, Calendar, Mail, Loader2, AlertCircle } from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import axios from "axios";
import toast from "react-hot-toast";

const FacultyFeedbackList = () => {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  
  const facultyData = JSON.parse(localStorage.getItem("facultyData") || "{}");
  const facultyId = facultyData._id;

  useEffect(() => {
    if (facultyId) {
      fetchFeedbacks();
    } else {
      setLoading(false);
    }
  }, [facultyId]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/faculty/feedbacks?facultyId=${facultyId}`);
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
              star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <FacultyLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
      </FacultyLayout>
    );
  }

  return (
    <FacultyLayout>
      <div className="py-2">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            Event Reviews
          </h1>
          <p className="text-gray-500 font-medium">Hear what students are saying about your events</p>
        </div>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-400 mb-2">No Reviews Yet</h2>
            <p className="text-gray-400">Feedback from your event attendees will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {feedbacks.map((feedback) => (
              <div 
                key={feedback._id} 
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-start mb-6">
                    <div className="bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                      {renderStars(feedback.rating)}
                    </div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Event Reference</p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {feedback.eventTitle}
                    </h3>
                  </div>
                  
                  <blockquote className="text-gray-700 leading-relaxed font-medium italic mb-2 relative">
                    <span className="text-2xl text-blue-100 absolute -top-3 -left-3 opacity-50">"</span>
                    <p className="line-clamp-4 relative z-10">{feedback.message}</p>
                    <span className="text-2xl text-blue-100 absolute -bottom-4 -right-2 opacity-50">"</span>
                  </blockquote>
                </div>

                <div className="bg-gray-50/50 px-8 py-5 border-t border-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-100">
                      {(feedback.name || "S").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{feedback.name || "Verified Student"}</h4>
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
    </FacultyLayout>
  );
};

export default FacultyFeedbackList;
