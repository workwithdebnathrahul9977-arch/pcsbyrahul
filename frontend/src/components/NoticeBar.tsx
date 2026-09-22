'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NoticeBar() {
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/settings`);
        
        if (data.SHOW_NOTICE === 'true' && data.NOTICE_TEXT) {
          setShow(true);
          setText(data.NOTICE_TEXT);
        }
      } catch (error) {
        console.error('Failed to load top notice', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotice();
  }, []);

  if (!isVisible) return null;

  if (isLoading || !show) return null;

  return (
    <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-between text-sm md:text-base w-full z-[50] relative">
      <div className="flex items-center flex-1 overflow-hidden">
        <i className="fa-regular fa-bell mr-3 flex-shrink-0 animate-pulse"></i>
        <div className="whitespace-nowrap overflow-hidden w-full relative">
          <p className="inline-block animate-marquee pl-full">
            {text}
          </p>
        </div>
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="ml-4 flex-shrink-0 text-white hover:text-gray-200 focus:outline-none"
      >
        <i className="fa-solid fa-xmark text-lg"></i>
      </button>

      <style jsx>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .pl-full {
          padding-left: 100%;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
