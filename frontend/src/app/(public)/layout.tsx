'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import NoticeBar from '@/components/NoticeBar';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {/* Premium Header (White Glass Effect) */}
      <nav className="fixed w-full top-0 z-[60] bg-white/80 backdrop-blur-lg border-b border-gray-200 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-24">
            
            {/* Logo (Left on both Mobile & Desktop) */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img src="/logo.png" alt="PhysChemia Logo" className="h-10 md:h-14 w-auto object-contain hover:opacity-90 transition-opacity" />
              </Link>

            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
              <Link href="/" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                হোম
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                আমাদের সম্পর্কে
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/courses" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                কোর্সসমূহ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/gallery" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                গ্যালারি
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/notices" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                নোটিশ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/results" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                রেজাল্ট
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
              <Link href="/admission" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                এডমিশন
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>

            <Link href="/contact" className="text-gray-700 hover:text-red-600 text-sm font-bold tracking-wide uppercase transition-colors relative group">
                যোগাযোগ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
              </Link>
            </div>

            {/* Right Side: Login & Mobile Menu */}
            <div className="flex items-center space-x-2 md:space-x-3">
              {isLoggedIn ? (
                <Link href="/dashboard" className="inline-flex items-center justify-center px-3 md:px-4 py-1.5 md:py-2 border border-transparent rounded-md md:rounded-lg shadow-sm text-xs md:text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all">
                  <i className="fa-regular fa-user mr-1.5"></i> ড্যাশবোর্ড
                </Link>
              ) : (
                <Link href="/login" className="inline-flex items-center justify-center px-3 md:px-4 py-1.5 md:py-2 border border-transparent rounded-md md:rounded-lg shadow-sm text-xs md:text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-all">
                  <i className="fa-solid fa-right-to-bracket mr-1.5"></i> লগইন
                </Link>
              )}

              {/* Mobile: Hamburger (Right) */}
              <div className="md:hidden flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="h-8 w-8 bg-white border border-gray-200 rounded-md flex items-center justify-center text-gray-700 hover:text-red-600 shadow-sm focus:outline-none"
                >
                  <i className={`fa-solid ${isMobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-sm`}></i>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full">
            <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">হোম</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/about" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">আমাদের সম্পর্কে</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/courses" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">কোর্সসমূহ</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/gallery" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">গ্যালারি</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/notices" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">নোটিশ</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/results" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">রেজাল্ট</Link>
              <Link onClick={() => setIsMobileMenuOpen(false)} href="/admission" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">এডমিশন</Link>

            <Link onClick={() => setIsMobileMenuOpen(false)} href="/contact" className="block px-3 py-3 rounded-md text-base font-bold text-gray-900 hover:bg-red-50 hover:text-red-600">যোগাযোগ</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-16 md:pt-24 min-h-screen">
        {pathname === '/' && <NoticeBar />}
        {children}
      </main>

﻿﻿﻿      {/* Premium Global Footer */}
      <footer className="bg-[#0a0a0a] border-t-[3px] border-red-600 pt-16 pb-8 mt-auto relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Top CTA */}
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-lg md:text-xl font-medium text-gray-400 mb-2">
              আমাদের ক্লাসগুলোতে অংশ নিতে এবং সবসময় আপডেট থাকতে,
            </h2>
            <h3 className="text-3xl md:text-4xl font-black text-white">
              যুক্ত হোন <span className="text-red-500">আমাদের সাথে</span>
            </h3>
          </div>
  
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-16">
            
            {/* Brand & Description */}
            <div className="md:col-span-1 pr-0 lg:pr-4">
              <img src="/logo.png" alt="PhysChemia" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
            </div>
  
            {/* Social Cards Stacked */}
            <div className="md:col-span-1 lg:pl-6">
              <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                আমাদের সাথে যুক্ত থাকুন
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <div className="flex flex-col space-y-4">
                
                {/* YouTube */}
                <a href="#" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-red-500 flex items-center justify-center text-xl mr-4 group-hover:bg-red-500/30 transition-colors">
                    <i className="fa-brands fa-youtube shadow-none"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-red-400 transition-colors">ফ্রি প্লে-লিস্ট</h4>
                    <p className="text-xs text-gray-400 font-medium">ইউটিউব চ্যানেল</p>
                  </div>
                </a>

                {/* FB Group */}
                <a href="#" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-blue-400 flex items-center justify-center text-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                    <i className="fa-brands fa-facebook-f shadow-none"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-blue-400 transition-colors">অফিসিয়াল গ্রুপ</h4>
                    <p className="text-xs text-gray-400 font-medium">ফেইসবুক</p>
                  </div>
                </a>

                {/* Instagram */}
                <a href="#" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-pink-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-pink-400 flex items-center justify-center text-xl mr-4 group-hover:bg-pink-500/30 transition-colors">
                    <i className="fa-brands fa-instagram shadow-none"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-pink-400 transition-colors">ইনস্টাগ্রাম</h4>
                    <p className="text-xs text-gray-400 font-medium">অফিসিয়াল প্রোফাইল</p>
                  </div>
                </a>

                {/* FB Page */}
                <a href="#" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-blue-400 flex items-center justify-center text-xl mr-4 group-hover:bg-blue-600/30 transition-colors">
                    <i className="fa-brands fa-facebook shadow-none"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-blue-400 transition-colors">অফিসিয়াল পেইজ</h4>
                    <p className="text-xs text-gray-400 font-medium">ফেইসবুক</p>
                  </div>
                </a>

              </div>
            </div>
    
            {/* Contact */}
            <div className="md:col-span-1 lg:pl-10">
              <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                যোগাযোগ
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <ul className="space-y-5 text-sm text-gray-400">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-solid fa-envelope text-red-500"></i>
                  </div>
                  <div className="pt-1">
                    <span>pcssupport@gmail.com</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-solid fa-phone text-red-500"></i>
                  </div>
                  <div className="pt-1">
                    <span>01788-522363</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-brands fa-whatsapp text-red-500 text-lg"></i>
                  </div>
                  <div className="pt-1">
                    <span>WhatsApp</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <i className="fa-solid fa-location-dot text-red-500"></i>
                  </div>
                  <div className="pt-1">
                    <a href="https://share.google/k3pki6PdY1T9EFxb9" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors leading-relaxed block">
                      কেটি-পয়েন্ট (হবিগঞ্জ খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার 3200
                    </a>
                  </div>
                </li>
              </ul>
            </div>
            
          </div>
  
          {/* Copyright */}
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p className="mb-4 md:mb-0">
              &copy; 2026 <span className="font-bold text-gray-300">PhysChemia</span>. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p className="flex items-center">
              Developed by <a href="#" className="ml-1 text-red-500 font-bold hover:underline">Team Nexa</a>
            </p>
          </div>
        </div>
      </footer>

    </>
  )
}
