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

      {/* Premium Global Footer */}
      <footer className="bg-gradient-to-b from-[#260101] to-[#1a0505] border-t border-red-900/30 pt-10 md:pt-14 pb-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Half: Social Links */}
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-300 mb-2">
              আমাদের ক্লাসগুলোতে অংশ নিতে এবং সবসময় আপডেট থাকতে,
            </h2>
            <h3 className="text-2xl md:text-4xl font-black text-white mb-4">
              যুক্ত হোন <span className="text-red-500">আমাদের সাথে</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full mx-auto">
              
              {/* YouTube */}
              <a href="#" className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between group hover:-translate-y-1 hover:shadow-red-500/20 hover:border-red-500/40 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-red-500 flex items-center justify-center text-lg md:text-xl mr-3 border border-white/5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <i className="fa-brands fa-youtube"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[14px] md:text-[15px] leading-tight mb-0.5 group-hover:text-red-400 transition-colors">ফ্রি প্লে-লিস্ট</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">ইউটিউব চ্যানেল</p>
                  </div>
                </div>
              </a>

              {/* FB Group */}
              <a href="#" className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between group hover:-translate-y-1 hover:shadow-blue-500/20 hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-blue-400 flex items-center justify-center text-lg md:text-xl mr-3 border border-white/5 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <i className="fa-brands fa-facebook-f"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[14px] md:text-[15px] leading-tight mb-0.5 group-hover:text-blue-400 transition-colors">অফিসিয়াল গ্রুপ</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">ফেইসবুক</p>
                  </div>
                </div>
              </a>

              {/* Instagram */}
              <a href="#" className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between group hover:-translate-y-1 hover:shadow-pink-500/20 hover:border-pink-500/40 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-pink-400 flex items-center justify-center text-lg md:text-xl mr-3 border border-white/5 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 group-hover:text-white transition-colors">
                    <i className="fa-brands fa-instagram"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[14px] md:text-[15px] leading-tight mb-0.5 group-hover:text-pink-400 transition-colors">ইন্সটাগ্রাম</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">অফিসিয়াল প্রোফাইল</p>
                  </div>
                </div>
              </a>

              {/* FB Page */}
              <a href="#" className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/10 flex items-center justify-between group hover:-translate-y-1 hover:shadow-blue-500/20 hover:border-blue-500/40 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 text-blue-400 flex items-center justify-center text-lg md:text-xl mr-3 border border-white/5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <i className="fa-brands fa-facebook"></i>
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-white text-[14px] md:text-[15px] leading-tight mb-0.5 group-hover:text-blue-400 transition-colors">অফিসিয়াল পেইজ</h4>
                    <p className="text-xs md:text-sm text-gray-400 font-medium">ফেইসবুক</p>
                  </div>
                </div>
              </a>

            </div>
          </div>

          {/* Bottom Half: Footer Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-8 mb-10 max-w-5xl mx-auto">
            
            {/* Col 1: Brand - Span 2 */}
            <div className="col-span-2 md:col-span-2 pr-0 md:pr-12">
              <img src="/logo.png" alt="PhysChemia" className="h-12 w-auto mb-4 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
            </div>

            {/* Col 2: Support */}
            <div>
              <h3 className="text-[15px] font-bold text-white mb-4">সাপোর্ট</h3>
              <ul className="space-y-4 text-[13px] text-gray-200">
                <li><Link href="/admission" className="hover:text-red-400 transition-colors">ভর্তির নিয়ম</Link></li>
                <li><Link href="/refund" className="hover:text-red-400 transition-colors">রিফান্ড পলিসি</Link></li>
                <li><Link href="/terms" className="hover:text-red-400 transition-colors">টার্মস</Link></li>
                <li><Link href="/privacy" className="hover:text-red-400 transition-colors">প্রাইভেসি</Link></li>
                <li><Link href="/faq" className="hover:text-red-400 transition-colors">FAQ</Link></li>
              </ul>
            </div>

            {/* Col 3: Contact */}
            <div>
              <h3 className="text-[15px] font-bold text-white mb-4">যোগাযোগ</h3>
              <ul className="space-y-4 text-[13px] text-gray-200">
                <li className="flex items-start">
                  <i className="fa-regular fa-envelope mt-1 w-5 text-red-500"></i>
                  <span>contact@physchemia.com<br/>info@physchemia.com</span>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-phone w-5 text-red-500"></i>
                  <span>০১৭৮৮-৫২২৩৯০</span>
                </li>
                <li className="flex items-center">
                  <i className="fa-brands fa-whatsapp w-5 text-red-500"></i>
                  <span>WhatsApp</span>
                </li>
                <li className="flex items-start group">
                  <i className="fa-solid fa-location-dot mt-1 w-5 text-red-500 group-hover:text-red-400 transition-colors"></i>
                  <a href="https://share.google/k3pki6PdY1T9EFxb9" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors">
                    কোর্ট-পয়েন্ট (হাফিজা খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার, Moulvibazar 3200
                  </a>
                </li>
              </ul>
            </div>
            
          </div>

          <div className="border-t border-red-900/30 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p className="mb-4 md:mb-0">
              © 2026 <span className="font-bold text-gray-400">PhysChemia</span>. সর্বস্বত্ব সংরক্ষিত।
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
