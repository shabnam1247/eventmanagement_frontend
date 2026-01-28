import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState("list"); // 'list' or 'chat'
    const [faculties, setFaculties] = useState([]);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const socket = useRef(null);
    const scrollRef = useRef(null);

    const studentData = JSON.parse(localStorage.getItem("userData") || "{}");
    const studentId = studentData._id;

    useEffect(() => {
        if (studentId) {
            socket.current = io("http://localhost:5000");
            socket.current.emit("join_room", studentId);

            socket.current.on("receive_message", (data) => {
                setMessages((prev) => [...prev, data]);
            });

            return () => {
                socket.current.disconnect();
            };
        }
    }, [studentId]);

    useEffect(() => {
        if (isOpen && view === "list") {
            fetchFaculties();
        }
    }, [isOpen, view]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchFaculties = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/users/faculties");
            if (response.data.success) {
                setFaculties(response.data.faculties);
            }
        } catch (error) {
            console.error("Error fetching faculties:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (facultyId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/chat/messages/${studentId}/${facultyId}`);
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSelectFaculty = (faculty) => {
        setSelectedFaculty(faculty);
        setView("chat");
        fetchMessages(faculty._id);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedFaculty) return;

        const messageData = {
            senderId: studentId,
            senderModel: "Users",
            receiverId: selectedFaculty._id,
            receiverModel: "Faculty",
            message: newMessage,
        };

        socket.current.emit("send_message", messageData);
        // Optimistic update
        setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);
        setNewMessage("");
    };

    const toggleChat = () => {
        if (!studentId) {
            toast.error("Please login to chat with faculty");
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[9999]">
            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 transform hover:scale-110 active:scale-95 ${
                    isOpen ? "bg-red-500 rotate-90" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
                {isOpen ? <X className="text-white w-8 h-8" /> : <MessageCircle className="text-white w-8 h-8" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-blue-500 border-2 border-white items-center justify-center text-[10px] text-white font-bold">1</span>
                    </span>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 text-white shrink-0">
                        {view === "chat" ? (
                            <div className="flex items-center gap-3">
                                <button onClick={() => setView("list")} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold">
                                    {selectedFaculty?.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm tracking-tight">{selectedFaculty?.name}</h3>
                                    <p className="text-[10px] text-blue-100 uppercase font-black tracking-widest">{selectedFaculty?.department}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
                                        Faculty Support <Sparkles className="w-5 h-5 text-amber-300" />
                                    </h3>
                                    <p className="text-blue-100 text-xs font-medium">Ask questions to your department faculty</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                        {view === "list" ? (
                            <div className="space-y-3">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center h-full pt-20">
                                        <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Connecting to Staff...</p>
                                    </div>
                                ) : faculties.length === 0 ? (
                                    <div className="text-center pt-20">
                                        <p className="text-gray-400 italic">No faculty members online currently</p>
                                    </div>
                                ) : (
                                    faculties.map((fac) => (
                                        <button
                                            key={fac._id}
                                            onClick={() => handleSelectFaculty(fac)}
                                            className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all flex items-center gap-4 group"
                                        >
                                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {fac.name.charAt(0)}
                                            </div>
                                            <div className="text-left">
                                                <h4 className="font-bold text-gray-900 text-sm">{fac.name}</h4>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{fac.department}</p>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${msg.sender === studentId || msg.senderId === studentId ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium shadow-sm ${
                                                msg.sender === studentId || msg.senderId === studentId
                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                            }`}
                                        >
                                            {msg.message}
                                            <p className={`text-[9px] mt-1 opacity-60 ${msg.sender === studentId || msg.senderId === studentId ? "text-right" : "text-left"}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    {view === "chat" && (
                        <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                            <form onSubmit={handleSendMessage} className="flex gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-100 outline-none font-medium"
                                />
                                <button
                                    type="submit"
                                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ChatWidget;
