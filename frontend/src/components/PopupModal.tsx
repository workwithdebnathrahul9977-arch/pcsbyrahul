'use client';
import { useState, useEffect } from 'react';

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup after 2 seconds on first visit
    const timer = setTimeout(() => {
      const hasSeen = localStorage.getItem('hasSeenPopup');
      if (!hasSeen) {
        setIsOpen(true);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('hasSeenPopup', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full relative z-10 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">Telegram joining</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-500 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="w-full h-48 bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
            {/* This image would come from API, using placeholder for now */}
            <div className="text-white text-center p-4">
               <h2 className="text-3xl font-black mb-2">WELCOME</h2>
               <p className="font-bold">SUPER FAST & SECURE</p>
            </div>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6 font-medium leading-relaxed">
            🔥 আকর্ষণীয় সব অফার এবং গিভওয়ে 🎁 পেতে যুক্ত থাকুন আমাদের টেলিগ্রাম গ্রুপে 💬 👇
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={handleClose} className="text-gray-500 font-bold hover:text-gray-700 transition">Close</button>
            <a href="#" target="_blank" rel="noreferrer" className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition block text-sm">
              JOIN OUR TELEGRAM GROUP FIRST
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
