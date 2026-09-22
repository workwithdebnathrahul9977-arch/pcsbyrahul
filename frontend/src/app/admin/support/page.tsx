'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminSupport() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/support`);
      setConversations(data);
      if (activeChat) {
        const updatedActive = data.find((c: any) => c.id === activeChat.id);
        if (updatedActive) setActiveChat(updatedActive);
      }
    } catch (err) {
      if (!silent) toast.error('Failed to load conversations');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
    // Auto refresh every 5 seconds for live feel
    const interval = setInterval(() => {
      fetchConversations(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeChat?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !activeChat) return;

    const prevReply = replyMessage;
    setReplyMessage('');

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/support/${activeChat.id}/reply`, {
        message: prevReply
      });
      fetchConversations(true);
    } catch (err) {
      toast.error('Failed to send reply');
      setReplyMessage(prevReply);
    }
  };

  const handleToggleStatus = async () => {
    if (!activeChat) return;
    const newStatus = activeChat.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/support/${activeChat.id}/status`, {
        status: newStatus
      });
      fetchConversations(true);
      toast.success(`Conversation ${newStatus.toLowerCase()}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-red-500"></i>
          <p className="text-gray-500 font-medium">Loading Live Support...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 h-[calc(100vh-80px)] -m-4 p-4 flex gap-4 font-sans">
      
      {/* Conversations List (Left Pane) */}
      <div className="w-[380px] bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden shrink-0">
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm">
              <i className="fa-solid fa-headset"></i>
            </div>
            Live Support
          </h2>
          <div className="text-xs font-bold px-2 py-1 bg-red-100 text-red-600 rounded-md">
            {conversations.filter(c => c.status === 'OPEN').length} Open
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-3 mt-10">
              <i className="fa-regular fa-comments text-4xl text-gray-300"></i>
              <p>No active conversations</p>
            </div>
          ) : (
            conversations.map(conv => {
              const isActive = activeChat?.id === conv.id;
              const hasPhoto = !!conv.userPhoto;
              return (
                <div 
                  key={conv.id} 
                  onClick={() => setActiveChat(conv)}
                  className={`p-4 border-b border-gray-100 cursor-pointer transition-colors flex gap-3 ${isActive ? 'bg-red-50/50' : 'hover:bg-gray-50'}`}
                >
                  <div className="relative shrink-0">
                    {hasPhoto ? (
                      <img src={conv.userPhoto} alt={conv.name} className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                        {conv.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {conv.status === 'OPEN' && (
                      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-gray-900 truncate flex items-center gap-1.5 text-sm">
                        {conv.name}
                        {conv.userRole === 'STUDENT' && (
                          <span className="text-blue-500" title="Registered Student">
                            <i className="fa-solid fa-circle-check text-[10px]"></i>
                          </span>
                        )}
                      </h3>
                      <span className="text-[10px] font-medium text-gray-400 whitespace-nowrap ml-2">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500 truncate max-w-[70%] font-medium">{conv.subject}</p>
                      <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${conv.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {conv.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Area (Right Pane) */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0 z-10">
              <div className="flex items-center gap-3">
                {activeChat.userPhoto ? (
                  <img src={activeChat.userPhoto} alt={activeChat.name} className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                ) : (
                  <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xl font-bold border border-gray-200">
                    {activeChat.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    {activeChat.name}
                    {activeChat.userRole === 'STUDENT' && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Student</span>
                    )}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5 font-medium">
                    <i className="fa-solid fa-phone text-[10px] text-gray-400"></i> {activeChat.phone}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${activeChat.status === 'OPEN' ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-green-50 border border-green-100 text-green-700 hover:bg-green-100'}`}
              >
                {activeChat.status === 'OPEN' ? (
                  <><i className="fa-solid fa-lock text-gray-400"></i> Close Ticket</>
                ) : (
                  <><i className="fa-solid fa-unlock text-green-500"></i> Reopen Ticket</>
                )}
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#f4f1ea] space-y-4 relative" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}>
              <div className="text-center sticky top-0 z-10">
                <span className="bg-white/90 backdrop-blur border border-gray-200 text-gray-600 text-xs px-4 py-1.5 rounded-full font-bold shadow-sm inline-block">
                  Subject: <span className="text-gray-900">{activeChat.subject}</span>
                </span>
              </div>
              
              {activeChat.messages.map((msg: any, idx: number) => {
                const isAdmin = msg.senderType === 'ADMIN';
                return (
                  <div key={idx} className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-5 py-2.5 shadow-sm relative text-sm ${isAdmin ? 'bg-[#dcf8c6] text-gray-900 rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm border border-gray-100'}`}>
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                      <div className="text-[10px] text-gray-500 text-right mt-1.5 flex justify-end items-center gap-1 font-medium">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isAdmin && <i className="fa-solid fa-check-double text-blue-500"></i>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0">
              {activeChat.status === 'CLOSED' ? (
                <div className="text-center bg-gray-100 border border-gray-200 rounded-xl p-3">
                  <p className="text-sm text-gray-600 font-medium">
                    <i className="fa-solid fa-lock mr-2 text-gray-400"></i>
                    This conversation is closed. Reopen to send a message.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="flex gap-3 items-center">
                  <div className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer shrink-0">
                    <i className="fa-regular fa-face-smile text-xl"></i>
                  </div>
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      value={replyMessage}
                      onChange={e => setReplyMessage(e.target.value)}
                      placeholder="Type a message..." 
                      className="w-full bg-white border border-gray-300 rounded-full pl-5 pr-5 py-3 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 shadow-sm"
                    />
                  </div>
                  <button type="submit" disabled={!replyMessage.trim()} className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm hover:shadow-md hover:-translate-y-0.5">
                    <i className="fa-solid fa-paper-plane text-lg -ml-1"></i>
                  </button>
                </form>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-[#f8f9fa]">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
              <i className="fa-brands fa-whatsapp text-6xl text-gray-200"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Live Support Center</h3>
            <p className="text-sm font-medium text-gray-500">Select a conversation from the left to start messaging</p>
            <div className="mt-8 text-xs text-gray-400 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
              <i className="fa-solid fa-lock mr-2"></i> End-to-end encrypted
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
