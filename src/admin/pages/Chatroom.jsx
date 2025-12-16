import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Users, Search, Send, MoreVertical, Menu } from 'lucide-react';

const AdminChatroomApp = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const [contacts] = useState([
    { id: 0, name: 'Nancy Fernandez', lastMsg: 'Hi Admin!', time: '2:45 PM', unread: true },
    { id: 1, name: 'Jonathan Griffin', lastMsg: 'Question about event', time: '1:30 PM', unread: false },
    { id: 2, name: 'Gertrude Weber', lastMsg: 'Thanks for the help', time: '12:15 PM', unread: false },
  ]);

  const [chatMessages] = useState({
    0: [
      { id: 1, sender: 'Nancy', text: 'Hi! I have a question about the event.', time: '2:40 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'Hello! How can I help you?', time: '2:42 PM', isOwn: true },
    ],
    1: [
      { id: 1, sender: 'Jonathan', text: 'When is the registration deadline?', time: '1:25 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'Registration closes on November 25th.', time: '1:28 PM', isOwn: true },
    ],
    2: [
      { id: 1, sender: 'Gertrude', text: 'Thank you for your assistance!', time: '12:15 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'You\'re welcome! Let me know if you need anything else.', time: '12:20 PM', isOwn: true },
    ]
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: message,
      time: currentTime,
      isOwn: true
    };

    // In a real app, you would update the state here
    console.log('New message:', newMessage);
    setMessage('');
  };

  const currentMessages = chatMessages[selectedChat] || [];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-16 bg-blue-600 flex flex-col items-center py-4">
        <div className="mb-8">
          <MessageCircle className="w-6 h-6 text-white" />
        </div>
        <div className="space-y-6">
          <MessageCircle className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
          <Users className="w-5 h-5 text-white/80 hover:text-white cursor-pointer" />
        </div>
      </div>

      {/* Contact List */}
      <div className="w-80 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Messages</h2>
            <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              New Chat
            </button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats"
              className="w-full pl-10 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedChat(contact.id)}
              className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 ${
                selectedChat === contact.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {contact.name.charAt(0)}
                </span>
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {contact.name}
                  </span>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-xs text-gray-600 truncate">{contact.lastMsg}</p>
              </div>
              
              {contact.unread && (
                <div className="ml-2 w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <span className="text-xs font-medium text-gray-700">
                {contacts.find(c => c.id === selectedChat)?.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">
                {contacts.find(c => c.id === selectedChat)?.name}
              </h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
          <MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                  msg.isOwn 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-xs mt-1 ${
                    msg.isOwn ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`px-4 py-2 rounded-r-lg ${
                message.trim()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChatroomApp;