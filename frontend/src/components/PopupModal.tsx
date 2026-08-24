'use client';
import { useState, useEffect } from 'react';

export default function PopupModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupData, setPopupData] = useState<any>(null);

  useEffect(() => {
    const fetchPopupData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/popupSettings`);
        const data = await res.json();
        
        if (data && data.value) {
          const parsedData = JSON.parse(data.value);
          setPopupData(parsedData);

          // Check if we should show the popup
          const hasSeen = sessionStorage.getItem('hasSeenPopupSession');
          
          if (!hasSeen && parsedData.isActive) {
            // Show popup after 2 seconds
            setTimeout(() => {
              setIsOpen(true);
            }, 2000);
          }
        }
      } catch (error) {
        console.error('Failed to fetch popup data:', error);
      }
    };

    fetchPopupData();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Use sessionStorage so it shows again next time they visit the site (new session)
    sessionStorage.setItem('hasSeenPopupSession', 'true');
  };

  if (!isOpen || !popupData) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose}></div>
      
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-md w-full relative z-10 transform transition-all scale-100 animate-in zoom-in-95 duration-300">
        
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 text-lg">{popupData.heading}</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-red-500 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {popupData.imageUrl ? (
            <img src={popupData.imageUrl} alt="Popup Image" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center text-white p-4">
              <h2 className="text-3xl font-black mb-2">{popupData.heading}</h2>
            </div>
          )}
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6 font-medium leading-relaxed">
            {popupData.subHeading}
          </p>
          <div className="flex items-center justify-center space-x-4">
            <button onClick={handleClose} className="text-gray-500 font-bold hover:text-gray-700 transition">Close</button>
            <a href={popupData.buttonUrl} target="_blank" rel="noreferrer" className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition block text-sm">
              {popupData.buttonText}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
