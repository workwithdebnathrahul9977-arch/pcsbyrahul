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

﻿      {/* Premium Global Footer */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
            
            {/* Brand & Social (Span 4) */}
            <div className="lg:col-span-4 pr-0 md:pr-10">
              <img src="/logo.png" alt="PhysChemia" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
              <div className="flex items-center space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-youtube group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-facebook-f group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-instagram group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-facebook group-hover:scale-110 transition-transform"></i>
                </a>
              </div>
            </div>
  
            {/* Links 1 (Span 2) */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                গুরুত্বপূর্ণ লিংক
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>হোমপেজ</Link></li>
                <li><Link href="/courses" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>কোর্সসমূহ</Link></li>
                <li><Link href="/about" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>আমাদের সম্পর্কে</Link></li>
                <li><Link href="/gallery" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>গ্যালারি</Link></li>
              </ul>
            </div>

            {/* Support (Span 3) */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                সাপোর্ট
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/admission" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>ভর্তির নিয়ম</Link></li>
                <li><Link href="/refund" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>রিফান্ড পলিসি</Link></li>
                <li><Link href="/terms" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>শর্তাবলী</Link></li>
                <li><Link href="/privacy" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>প্রাইভেসি পলিসি</Link></li>
                <li><Link href="/faq" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform"><i className="fa-solid fa-angle-right text-xs mr-2 text-red-500"></i>FAQ</Link></li>
              </ul>
            </div>
  
            {/* Contact (Span 3) */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold mb-6 text-lg relative inline-block">
                যোগাযোগ
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start">
                  <i className="fa-solid fa-envelope mt-1 mr-3 w-4 text-red-500"></i>
                  <span>contact@physchemia.com<br/>info@physchemia.com</span>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-phone mr-3 w-4 text-red-500"></i>
                  <span>01788-522363</span>
                </li>
                <li className="flex items-center">
                  <i className="fa-brands fa-whatsapp mr-3 w-4 text-red-500 text-base"></i>
                  <span>WhatsApp</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-location-dot mt-1 mr-3 w-4 text-red-500"></i>
                  <a href="https://share.google/k3pki6PdY1T9EFxb9" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors leading-relaxed">
                    কেটি-পয়েন্ট (হবিগঞ্জ খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার 3200
                  </a>
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
