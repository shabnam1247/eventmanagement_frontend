import React, { useState, useEffect, useRef } from "react";
import { Search, Send, User, MessageSquare, Loader2, Sparkles, Clock, CheckCheck } from "lucide-react";
import FacultyLayout from "../components/FacultyLayout";
import { io } from "socket.io-client";
import axios from "axios";
import toast from "react-hot-toast";

const FacultyChat = () => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const socket = useRef(null);
    const scrollRef = useRef(null);

    const facultyData = JSON.parse(localStorage.getItem("facultyData") || "{}");
    const facultyId = facultyData._id;

    useEffect(() => {
        if (facultyId) {
            socket.current = io("http://localhost:5000");
            socket.current.emit("join_room", facultyId);

            socket.current.on("receive_message", (data) => {
                // If the message is from the currently selected student, add it to messages
                if (selectedChat && data.sender === selectedChat.id) {
                    setMessages((prev) => [...prev, data]);
                } else {
                    // Update the chat list to show unread or latest message
                    fetchRecentChats();
                    toast(`New message from student!`, { icon: '💬' });
                }
            });

            fetchRecentChats();

            return () => {
                socket.current.disconnect();
            };
        }
    }, [facultyId, selectedChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchRecentChats = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/chat/chats/${facultyId}?role=Faculty`);
            if (response.data.success) {
                setChats(response.data.chats);
            }
        } catch (error) {
            console.error("Error fetching chats:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (studentId) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/chat/messages/${facultyId}/${studentId}`);
            if (response.data.success) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const handleSelectChat = (chat) => {
        setSelectedChat(chat);
        fetchMessages(chat.id);
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedChat) return;

        const messageData = {
            senderId: facultyId,
            senderModel: "Faculty",
            receiverId: selectedChat.id,
            receiverModel: "Users",
            message: newMessage,
        };

        socket.current.emit("send_message", messageData);
        setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);
        setNewMessage("");
    };

    const filteredChats = chats.filter(chat => 
        chat.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <FacultyLayout>
            <div className="h-[calc(100vh-120px)] flex gap-6">
                {/* Left: Chat List */}
                <div className="w-96 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-6 border-b border-gray-50 bg-white">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3 mb-6">
                            Student <span className="text-blue-600">Queries</span>
                        </h2>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-100 transition-all font-medium text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        ) : filteredChats.length === 0 ? (
                            <div className="text-center py-20">
                                <MessageSquare className="w-12 h-12 text-gray-100 mx-auto mb-4" />
                                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">No conversations yet</p>
                            </div>
                        ) : (
                            filteredChats.map((chat) => (
                                <button
                                    key={chat.id}
                                    onClick={() => handleSelectChat(chat)}
                                    className={`w-full p-4 rounded-3xl transition-all flex items-center gap-4 group ${
                                        selectedChat?.id === chat.id ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "bg-white hover:bg-gray-50 text-gray-600"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                                        selectedChat?.id === chat.id ? "bg-white/20" : "bg-blue-50 text-blue-600"
                                    }`}>
                                        {chat.name?.charAt(0)}
                                    </div>
                                    <div className="text-left flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <h4 className={`font-bold text-sm truncate ${selectedChat?.id === chat.id ? "text-white" : "text-gray-900"}`}>
                                                {chat.name}
                                            </h4>
                                            <span className={`text-[9px] font-bold ${selectedChat?.id === chat.id ? "text-blue-100" : "text-gray-400"}`}>
                                                {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className={`text-xs truncate ${selectedChat?.id === chat.id ? "text-blue-100/80" : "text-gray-400"}`}>
                                            {chat.lastMessage}
                                        </p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Right: Chat Window */}
                <div className="flex-1 bg-white rounded-[2.5rem] shadow-lg border border-gray-100 flex flex-col overflow-hidden">
                    {selectedChat ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-50">
                                        {selectedChat.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 tracking-tight">{selectedChat.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Student Profile</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-all">
                                        <Clock className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Chat Messages */}
                            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/30">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.sender === facultyId || msg.senderId === facultyId ? "justify-end" : "justify-start"}`}>
                                        <div className="flex flex-col gap-1 max-w-[70%]">
                                            <div className={`p-4 rounded-[2rem] text-sm font-medium shadow-sm leading-relaxed ${
                                                msg.sender === facultyId || msg.senderId === facultyId
                                                    ? "bg-blue-600 text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 rounded-tl-none border border-gray-100"
                                            }`}>
                                                {msg.message}
                                            </div>
                                            <div className={`flex items-center gap-2 px-2 ${msg.sender === facultyId || msg.senderId === facultyId ? "justify-end" : "justify-start"}`}>
                                                <span className="text-[10px] text-gray-400 font-bold">
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {msg.sender === facultyId && <CheckCheck className="w-3 h-3 text-blue-500" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>

                            {/* Chat Input */}
                            <div className="p-6 bg-white border-t border-gray-50">
                                <form onSubmit={handleSendMessage} className="flex gap-4">
                                    <input 
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your response here..."
                                        className="flex-1 bg-gray-50 border-none rounded-3xl px-8 py-5 text-sm font-bold focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                                    />
                                    <button 
                                        type="submit"
                                        className="p-5 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all text-lg"
                                    >
                                        <Send className="w-6 h-6" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-20 text-center">
                            <div className="w-32 h-32 bg-blue-50 rounded-[40px] flex items-center justify-center mb-8 rotate-12 transition-transform hover:rotate-0 duration-500">
                                <Sparkles className="w-16 h-16 text-blue-600" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Select a conversation</h3>
                            <p className="max-w-md text-gray-400 font-medium leading-relaxed">
                                Click on a student on the left to start answering their questions and managing their experience.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </FacultyLayout>
    );
};

export default FacultyChat;
