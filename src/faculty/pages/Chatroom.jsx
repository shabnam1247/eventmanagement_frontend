import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Users, 
  Search, 
  Send, 
  MoreVertical, 
  Menu,
  ShieldCheck,
  Zap,
  Sparkles,
  Paperclip,
  Smile,
  Mic,
  Activity,
  User as UserIcon
} from 'lucide-react';
import FacultyLayout from "../components/FacultyLayout";

const FacultyChatroomApp = () => {
  const [selectedChat, setSelectedChat] = useState(0);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const [contacts] = useState([
    { id: 0, name: 'Nancy Fernandez', lastMsg: 'I have shared the details, thanks.', time: '2:45 PM', unread: true, status: 'online', initials: 'NF' },
    { id: 1, name: 'Jonathan Griffin', lastMsg: 'Is the event confirmed?', time: '1:30 PM', unread: false, status: 'away', initials: 'JG' },
    { id: 2, name: 'Gertrude Weber', lastMsg: 'Working on the budget.', time: '12:15 PM', unread: false, status: 'online', initials: 'GW' },
  ]);

  const [chatMessages] = useState({
    0: [
      { id: 1, sender: 'Nancy Fernandez', text: 'Hi! I have a question about the upcoming event.', time: '2:40 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'Sure, I can help with that. What is it?', time: '2:42 PM', isOwn: true },
    ],
    1: [
      { id: 1, sender: 'Jonathan Griffin', text: 'When is the registrations closing for the workshop?', time: '1:25 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'It will be closed by end of this week.', time: '1:28 PM', isOwn: true },
    ],
    2: [
      { id: 1, sender: 'Gertrude Weber', text: 'I have sent the presentation files.', time: '12:15 PM', isOwn: false },
      { id: 2, sender: 'me', text: 'Got it. Thanks!', time: '12:20 PM', isOwn: true },
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
    console.log('Sending message:', message);
    setMessage('');
  };

  const currentMessages = chatMessages[selectedChat] || [];
  const activeContact = contacts.find(c => c.id === selectedChat);

  return (
    <FacultyLayout>
      <div className="flex h-[calc(100vh-12rem)] bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-gray-50/50 overflow-hidden">
        {/* CHAT SIDEBAR */}
        <div className="w-96 border-r border-gray-100 flex flex-col bg-gray-50/30">
          <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                 <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Faculty <span className="text-blue-600">Chat</span></h2>
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Connect with your team</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                 <Zap className="w-5 h-5 text-blue-600 animate-pulse" />
              </div>
            </div>
            
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-16 pr-6 py-4 bg-white border-none rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-50 transition-all font-bold text-xs text-gray-800 placeholder:text-gray-300 uppercase"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 space-y-2 no-scrollbar">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedChat(contact.id)}
                className={`
                  flex items-center gap-4 p-5 cursor-pointer rounded-[2rem] transition-all group
                  ${selectedChat === contact.id 
                    ? 'bg-white shadow-xl shadow-gray-100 border border-gray-100' 
                    : 'hover:bg-white/60'}
                `}
              >
                <div className="relative">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-lg transition-all
                     ${selectedChat === contact.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-400'}
                   `}>
                     {contact.initials}
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white
                     ${contact.status === 'online' ? 'bg-emerald-500' : 'bg-amber-400'}
                   `}></div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-black text-gray-900 uppercase tracking-tight truncate">
                      {contact.name}
                    </span>
                    <span className="text-[9px] font-black text-gray-300 uppercase">{contact.time}</span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 truncate leading-none uppercase tracking-tight">
                    {contact.lastMsg}
                  </p>
                </div>
                
                {contact.unread && (
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.5)]"></div>
                )}
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-gray-100">
             <div className="bg-blue-600 rounded-2xl p-4 flex items-center gap-4 text-white hover:bg-blue-700 transition-colors cursor-pointer group shadow-lg shadow-blue-100">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                   <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                   <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">New Message</p>
                   <p className="text-[9px] font-bold text-blue-200 uppercase mt-0.5">Start new chat</p>
                </div>
             </div>
          </div>
        </div>

        {/* CHAT INTERFACE */}
        <div className="flex-1 flex flex-col bg-white">
          {/* CHAT HEADER */}
          <div className="px-10 py-8 border-b border-gray-50 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                 <div className="w-16 h-16 rounded-[1.25rem] bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xl border border-blue-100">
                   {activeContact?.initials}
                 </div>
                 <div className="absolute -top-1 -right-1 flex items-center justify-center bg-white rounded-full p-0.5">
                    <Activity className="w-4 h-4 text-emerald-500" />
                 </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                   <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                     {activeContact?.name}
                   </h3>
                   <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black rounded-full uppercase border border-emerald-100">Active</div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Available to chat</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <button className="p-4 text-gray-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all">
                  <ShieldCheck className="w-6 h-6" />
               </button>
               <button className="p-4 text-gray-300 hover:text-gray-900 hover:bg-gray-50 rounded-2xl transition-all">
                  <MoreVertical className="w-6 h-6" />
               </button>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto px-10 py-10 space-y-8 no-scrollbar bg-gray-50/20">
            {currentMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isOwn ? 'items-end' : 'items-start'}`}
              >
                {!msg.isOwn && (
                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] mb-2 ml-4">{msg.sender}</span>
                )}
                <div className={`group relative max-w-[80%] px-8 py-5 rounded-[2.5rem] transition-all
                  ${msg.isOwn 
                    ? 'bg-gray-900 text-white rounded-br-none shadow-2xl shadow-gray-200' 
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-xl shadow-gray-50/50'}
                `}>
                  <p className={`text-sm font-bold leading-relaxed ${msg.isOwn ? 'text-gray-100' : 'text-gray-600'}`}>
                     {msg.text}
                  </p>
                  <div className={`text-[8px] font-black mt-3 uppercase tracking-widest opacity-40
                    ${msg.isOwn ? 'text-blue-400' : 'text-gray-400'}
                  `}>
                    {msg.time}
                  </div>
                  
                  {/* Subtle reaction bubble placeholder */}
                  <div className={`absolute -bottom-2 ${msg.isOwn ? '-left-2' : '-right-2'} opacity-0 group-hover:opacity-100 transition-all cursor-pointer`}>
                     <div className="bg-white rounded-full p-2 shadow-lg border border-gray-50">
                        <Smile className="w-4 h-4 text-gray-300" />
                     </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* MESSAGE INPUT */}
          <div className="p-10 bg-white border-t border-gray-50">
            <div className="bg-gray-50 rounded-[2.5rem] p-3 flex items-center gap-4 border border-transparent focus-within:border-blue-100 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50 transition-all">
              <div className="flex items-center gap-1 pl-4 shrink-0">
                 <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Paperclip className="w-5 h-5" />
                 </button>
                 <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                    <Mic className="w-5 h-5" />
                 </button>
              </div>
              
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 py-4 bg-transparent border-none focus:ring-0 font-bold text-sm text-gray-800 placeholder:text-gray-300"
              />
              
              <div className="flex items-center gap-3 pr-2">
                 <button className="p-4 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all">
                    <Smile className="w-5 h-5" />
                 </button>
                 <button
                   onClick={handleSendMessage}
                   disabled={!message.trim()}
                   className={`
                     w-14 h-14 rounded-2xl flex items-center justify-center transition-all
                     ${message.trim()
                       ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 active:scale-90'
                       : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                   `}
                 >
                   <Send className="w-6 h-6" />
                 </button>
              </div>
            </div>
            
            <div className="flex items-center justify-center gap-10 mt-6">
                <LinkAudit icon={<ShieldCheck />} label="Secure Chat" />
                <LinkAudit icon={<Activity />} label="Fast Delivery" />
                <LinkAudit icon={<Sparkles />} label="Smart Replies" />
            </div>
          </div>
        </div>
      </div>
    </FacultyLayout>
  );
};

const LinkAudit = ({ icon, label }) => (
    <div className="flex items-center gap-1.5 opacity-30">
       <div className="w-3.5 h-3.5 text-gray-900">{icon}</div>
       <span className="text-[8px] font-black text-gray-900 uppercase tracking-widest">{label}</span>
    </div>
);


export default FacultyChatroomApp;
