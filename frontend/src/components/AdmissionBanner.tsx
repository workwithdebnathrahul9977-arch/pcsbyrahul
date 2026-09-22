'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AdmissionBanner() {
  const [active, setActive] = useState(false);
  const [text, setText] = useState('');

  useEffect(() => {
    // Fetch settings to check if banner is active
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    axios.get(`${API}/api/settings`)
      .then(res => {
        if (res.data.ADMISSION_BANNER_ACTIVE === 'true') {
          setActive(true);
          setText(res.data.ADMISSION_BANNER_TEXT || 'ভর্তি চলছে! আজই আপনার উজ্জ্বল ভবিষ্যতের প্রথম পদক্ষেপ নিন এবং শেখার নতুন দিগন্ত উন্মোচন করুন!');
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!active) return null;

  return (
    <div className="bg-gradient-to-br from-red-700 via-red-600 to-red-800 py-16 border-t border-red-500 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-900 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50"></div>
      
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-sm">ভর্তি চলছে!</h2>
        <p className="text-white/90 text-base md:text-lg mb-10 leading-relaxed font-medium">
          {text}
        </p>
        <Link href="/admission" className="inline-block bg-white hover:bg-gray-50 text-red-700 font-black px-10 py-4 rounded-xl shadow-xl shadow-red-900/50 transition-all hover:-translate-y-1 text-lg">
          <i className="fa-solid fa-graduation-cap mr-2"></i> এডমিশন নিন
        </Link>
      </div>
    </div>
  );
}
