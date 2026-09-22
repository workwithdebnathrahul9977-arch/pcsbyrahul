'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  senderType: 'STUDENT' | 'ADMIN';
  content: string;
  createdAt: string;
}

interface Conversation {
  id: string;
  name: string;
  phone: string;
  subject: string;
  status: string;
  messages: Message[];
}

export default function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'FORM' | 'CHAT'>('FORM');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Chat State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      // Pre-fill name and phone if available
      const user = localStorage.getItem('user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          if (userData.name) setName(userData.name);
          if (userData.phone) setPhone(userData.phone);
        } catch(e) {}
      }
    }
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    const savedConvId = localStorage.getItem('activeSupportConversation');
    if (savedConvId && isLoggedIn) {
      setStep('CHAT');
      fetchConversation(savedConvId);
    }
  }, [isLoggedIn]);

  // Polling for new messages when chat is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && step === 'CHAT' && conversation) {
      interval = setInterval(() => {
        fetchConversation(conversation.id, true);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, step, conversation?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages, isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fetchConversation = async (id: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/support/${id}`);
      setConversation(data);
    } catch (err) {
      console.error(err);
      if (!silent) {
        localStorage.removeItem('activeSupportConversation');
        setStep('FORM');
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/support/start`, {
        name,
        phone,
        subject,
        message
      });
      setConversation(data);
      localStorage.setItem('activeSupportConversation', data.id);
      setStep('CHAT');
      setMessage('');
    } catch (err) {
      toast.error('Failed to start chat');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !conversation) return;
    
    const prevReply = replyMessage;
    setReplyMessage(''); // Optimistic clear
    
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/support/${conversation.id}/reply`, {
        message: prevReply
      });
      fetchConversation(conversation.id, true);
    } catch (err) {
      toast.error('Failed to send message');
      setReplyMessage(prevReply); // Restore on fail
    }
  };

  const handleEndChat = () => {
    localStorage.removeItem('activeSupportConversation');
    setConversation(null);
    setStep('FORM');
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'fixed', bottom: '24px', right: '24px' }}
        className="w-14 h-14 bg-gradient-to-tr from-red-700 via-red-600 to-red-500 text-white rounded-full flex items-center justify-center shadow-[0_10px_40px_rgba(220,38,38,0.4)] hover:scale-105 hover:shadow-[0_15px_50px_rgba(220,38,38,0.6)] active:scale-95 outline-none focus:outline-none transition-all duration-300 z-[9999] group relative print:hidden"
      >
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-red-400/60 animate-ping opacity-60"></div>

        {isOpen ? (
          <i className="fa-solid fa-xmark text-xl relative z-10"></i>
        ) : (
          <i className="fa-solid fa-message text-xl relative z-10"></i>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[360px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden z-[100] border border-gray-100">
          
          {/* Header */}
          <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-xl">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">PhysChemia Support</h3>
                <p className="text-xs text-gray-500">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4 relative scroll-smooth">
            {!isLoggedIn ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-2xl mb-2">
                  <i className="fa-solid fa-lock"></i>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">লগইন প্রয়োজন</h4>
                <p className="text-xs text-gray-500 leading-relaxed px-4">
                  লাইভ চ্যাট সাপোর্ট পেতে হলে আপনাকে অবশ্যই অ্যাকাউন্টে লগইন করতে হবে।
                </p>
                <a href="/login" className="bg-red-600 text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-red-700 transition-colors mt-4">
                  লগইন করুন
                </a>
              </div>
            ) : loading && !conversation ? (
              <div className="flex justify-center items-center h-full">
                <i className="fa-solid fa-spinner fa-spin text-red-600 text-2xl"></i>
              </div>
            ) : step === 'FORM' ? (
              <form onSubmit={handleStartChat} className="space-y-4">
                <div className="text-center mb-6">
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <i className="fa-solid fa-headset text-red-600"></i> আমাদের সাথে যোগাযোগ করুন
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    আপনার বিষয় এবং বার্তা লিখে পাঠিয়ে দিন। আমরা শীঘ্রই আপনাকে রিপ্লাই দেব।
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">নাম *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} type="text" placeholder="আপনার নাম" className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ফোন নম্বর *</label>
                  <input required value={phone} onChange={e => setPhone(e.target.value)} type="text" placeholder="01XXXXXXXXX" className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বিষয় *</label>
                  <input required value={subject} onChange={e => setSubject(e.target.value)} type="text" placeholder="বিষয় লিখুন" className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">বার্তা *</label>
                  <textarea required value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder="আপনার বার্তা লিখুন..." className="w-full text-sm px-4 py-2.5 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none resize-none"></textarea>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors mt-2 text-sm">
                  {loading ? 'পাঠানো হচ্ছে...' : 'মেসেজ পাঠান'}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="text-center text-xs text-gray-400 mb-4">
                  Conversation started for: <span className="font-semibold text-gray-600">{conversation?.subject}</span>
                </div>
                
                {conversation?.messages.map((msg, idx) => {
                  const isStudent = msg.senderType === 'STUDENT';
                  return (
                    <div key={idx} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${isStudent ? 'bg-red-600 text-white rounded-tr-sm' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm shadow-sm'}`}>
                        {msg.content}
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 mx-1">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Footer (Input for Chat Mode) */}
          {step === 'CHAT' && isLoggedIn && (
            <div className="p-3 bg-white border-t border-gray-100 shrink-0">
              {conversation?.status === 'CLOSED' ? (
                <div className="text-center">
                  <p className="text-xs text-red-500 mb-2 font-medium">This conversation has been closed.</p>
                  <button onClick={handleEndChat} className="text-xs bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full hover:bg-gray-200">Start New Chat</button>
                </div>
              ) : (
                <form onSubmit={handleSendReply} className="flex gap-2">
                  <input 
                    type="text" 
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
                  />
                  <button type="submit" disabled={!replyMessage.trim()} className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-red-700 disabled:opacity-50 transition-colors">
                    <i className="fa-solid fa-paper-plane text-sm -ml-0.5"></i>
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
