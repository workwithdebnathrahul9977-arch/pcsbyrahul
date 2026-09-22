'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import axios from 'axios';
import NoticeBar from '@/components/NoticeBar';
import PwaInstallCard from '@/components/PwaInstallCard';
import AdmissionBanner from '@/components/AdmissionBanner';
import LiveChatWidget from '@/components/LiveChatWidget';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudentAreaExpanded, setIsStudentAreaExpanded] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [siteLogo, setSiteLogo] = useState('/logo.png');
  const [settings, setSettings] = useState<any>({});
  const pathname = usePathname();

  useEffect(() => {
    // Check auth status
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    
    // Check local storage for logo
    const storedLogo = localStorage.getItem('siteLogo');
    if (storedLogo) {
      setSiteLogo(storedLogo);
    }

    // Fetch site settings for footer (contacts/socials)
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`)
      .then(res => setSettings(res.data))
      .catch(console.error);
      
    // Fetch dynamic logo
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/SITE_LOGO`)
      .then(res => res.json())
      .then(data => { if (data.value) setSiteLogo(data.value); })
      .catch(console.error);
  }, []);

  return (
    <>
      {/* Premium Header (White Glass Effect) */}
      <nav className="fixed w-full top-0 z-[60] bg-white/80 backdrop-blur-lg border-b border-gray-200 transition-all duration-300 shadow-sm print:hidden">
        <div className="max-w-[1450px] mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-24">
            
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <img src={siteLogo} alt="PhysChemia Logo" className="h-14 md:h-20 w-auto object-contain hover:opacity-90 transition-opacity" />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-7 flex-1 justify-center">
              <Link href="/" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/about" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                About Us
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/courses" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Courses
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/gallery" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link href="/notices" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Notices
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="relative group">
                <button className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer pb-2">
                  Student Area <i className="fa-solid fa-chevron-down text-[10px] transition-transform duration-300 group-hover:rotate-180"></i>
                  <span className="absolute bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
                </button>
                {/* Dropdown Menu - Beautiful smooth animation */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[240px] bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-400 transform origin-top -translate-y-4 group-hover:translate-y-0 z-50 overflow-hidden backdrop-blur-xl">
                  <div className="p-2 flex flex-col">
                    <Link href="/student-info" className="px-4 py-3 text-[13px] font-medium text-gray-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl flex items-center gap-3 transition-all">
                      <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center shrink-0"><i className="fa-regular fa-user text-red-500"></i></div> Student Profile
                    </Link>
                    <Link href="/results" className="px-4 py-3 text-[13px] font-medium text-gray-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl flex items-center gap-3 transition-all">
                      <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center shrink-0"><i className="fa-solid fa-border-all text-red-500"></i></div> Exam Results
                    </Link>
                    <Link href="/success-stories" className="px-4 py-3 text-[13px] font-medium text-gray-700 hover:text-red-600 hover:bg-red-50/80 rounded-xl flex items-center gap-3 transition-all">
                      <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center shrink-0"><i className="fa-solid fa-star text-red-500"></i></div> Success Stories
                    </Link>
                  </div>
                </div>
              </div>

              <Link href="/admission" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Admission
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              <Link href="/contact" className="text-gray-800 hover:text-red-600 text-[14px] font-semibold tracking-wide transition-colors relative group">
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all duration-300 group-hover:w-full"></span>
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

        {/* Mobile Sidebar Overlay — moved OUTSIDE nav so fixed works correctly */}
      </nav>

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[9999] flex justify-end md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Dark backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" style={{ animation: 'fadeInBackdrop 0.28s ease both' }} />

          {/* Sidebar panel — slides from right */}
          <div
            className="relative z-10 w-[82%] max-w-[320px] h-full bg-white flex flex-col shadow-2xl"
            style={{ animation: 'slideInRight 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-red-600 to-red-700 shrink-0">
              <img src={siteLogo} alt="Logo" className="h-10 w-auto object-contain brightness-0 invert" />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {/* Scrollable nav */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
              {[
                { href: '/', icon: 'fa-house', label: 'Home' },
                { href: '/about', icon: 'fa-circle-info', label: 'About Us' },
                { href: '/courses', icon: 'fa-book-open', label: 'Courses' },
                { href: '/gallery', icon: 'fa-images', label: 'Gallery' },
                { href: '/notices', icon: 'fa-bell', label: 'Notices' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 font-medium text-[14px] hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                  <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition">
                    <i className={`fa-solid ${item.icon} text-sm text-gray-500 group-hover:text-red-600`}></i>
                  </span>
                  {item.label}
                </Link>
              ))}

              {/* Student Area (Accordion) */}
              <div className="pt-1 mt-1">
                <button 
                  onClick={() => setIsStudentAreaExpanded(!isStudentAreaExpanded)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-800 font-medium text-[14px] hover:bg-red-50 hover:text-red-600 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition">
                      <i className="fa-solid fa-user-graduate text-sm text-gray-500 group-hover:text-red-600"></i>
                    </span>
                    Student Area
                  </div>
                  <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform duration-300 ${isStudentAreaExpanded ? 'rotate-180' : ''}`}></i>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${isStudentAreaExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pl-12 pr-4 py-1 space-y-1 mb-2">
                    {[
                      { href: '/student-info', icon: 'fa-regular fa-user', label: 'Student Profile' },
                      { href: '/results', icon: 'fa-solid fa-border-all', label: 'Exam Results' },
                      { href: '/success-stories', icon: 'fa-solid fa-star', label: 'Success Stories' },
                    ].map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setIsMobileMenuOpen(false); setIsStudentAreaExpanded(false); }}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 transition-all text-[13px]"
                      >
                        <i className={`${item.icon} text-[11px] text-gray-400 w-4 text-center`}></i>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Admission & Contact */}
              <div className="pt-2 mt-1 border-t border-gray-100">
                {[
                  { href: '/admission', icon: 'fa-pen-to-square', label: 'Admission' },
                  { href: '/contact', icon: 'fa-phone', label: 'Contact' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-800 font-medium text-[14px] hover:bg-red-50 hover:text-red-600 transition-all group"
                  >
                    <span className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-red-100 flex items-center justify-center shrink-0 transition">
                      <i className={`fa-solid ${item.icon} text-sm text-gray-500 group-hover:text-red-600`}></i>
                    </span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Bottom CTA */}
            <div className="p-4 border-t border-gray-100 shrink-0">
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition shadow-lg"
                >
                  <i className="fa-regular fa-user"></i> ড্যাশবোর্ড
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition shadow-lg"
                >
                  <i className="fa-solid fa-right-to-bracket"></i> লগইন করুন
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-16 md:pt-24 min-h-screen">
        {pathname === '/' && <NoticeBar />}
        {children}
      </main>

      {/* App Download / PWA Section & Admission Banner - Hidden on Dashboard and Admission Page */}
      {!pathname?.startsWith('/dashboard') && !pathname?.startsWith('/admission') && (
        <div className="print:hidden">
          <PwaInstallCard />
          <AdmissionBanner />
        </div>
      )}

      {/* Premium Global Footer */}
      <footer className="bg-[#1a1a1a] border-t-[3px] border-red-600 pt-16 pb-8 mt-auto relative overflow-hidden print:hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
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
            <div className="md:col-span-1 pr-0 lg:pr-4 order-2 md:order-1">
              <img src={siteLogo} alt="PhysChemia" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
            </div>
  
            {/* Social Cards Stacked */}
            <div className="md:col-span-1 lg:pl-6 order-1 md:order-2">
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
                {settings.SOCIAL_FACEBOOK && (
                  <a href={settings.SOCIAL_FACEBOOK} target="_blank" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-blue-400 flex items-center justify-center text-xl mr-4 group-hover:bg-blue-500/30 transition-colors">
                      <i className="fa-brands fa-facebook-f shadow-none"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-blue-400 transition-colors">অফিসিয়াল গ্রুপ</h4>
                      <p className="text-xs text-gray-400 font-medium">ফেইসবুক</p>
                    </div>
                  </a>
                )}

                {/* YouTube */}
                {settings.SOCIAL_YOUTUBE && (
                  <a href={settings.SOCIAL_YOUTUBE} target="_blank" className="bg-black/40 p-3 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center group hover:bg-black/60 transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-red-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] text-red-400 flex items-center justify-center text-xl mr-4 group-hover:bg-red-500/30 transition-colors">
                      <i className="fa-brands fa-youtube shadow-none"></i>
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-white text-[15px] leading-tight mb-1 group-hover:text-red-400 transition-colors">অফিসিয়াল চ্যানেল</h4>
                      <p className="text-xs text-gray-400 font-medium">ইউটিউব</p>
                    </div>
                  </a>
                )}

              </div>
            </div>
    
            {/* Contact */}
            <div className="md:col-span-1 lg:pl-10 order-3">
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
                    <span>{settings.CONTACT_EMAIL || 'support@physchemia.com'}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-solid fa-phone text-red-500"></i>
                  </div>
                  <div className="pt-1">
                    <span>{settings.CONTACT_PHONE || '01XXXXXXXXX'}</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0">
                    <i className="fa-brands fa-whatsapp text-red-500 text-lg"></i>
                  </div>
                  <div className="pt-1">
                    {settings.CONTACT_PHONE ? (
                      <a href={`https://wa.me/${settings.CONTACT_PHONE}`} target="_blank" className="hover:text-red-400">WhatsApp ({settings.CONTACT_PHONE})</a>
                    ) : (
                      <span>WhatsApp</span>
                    )}
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                    <i className="fa-solid fa-location-dot text-red-500"></i>
                  </div>
                  <div className="pt-1">
                    <a href="https://share.google/k3pki6PdY1T9EFxb9" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors leading-relaxed block">
                      কোর্ট-পয়েন্ট (হাফিজা খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার, Moulvibazar 3200
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
              Developed by <a href="https://wa.me/8801717855327?text=Hello%20Team%20Nexa,%20I%20need%20help%20with%20the%20PhysChemia%20website" target="_blank" rel="noopener noreferrer" className="ml-1 text-red-500 font-bold hover:underline flex items-center gap-1"><i className="fa-brands fa-whatsapp"></i>Team Nexa</a>
            </p>
          </div>
        </div>
      </footer>

      {!pathname?.startsWith('/dashboard') && <LiveChatWidget />}
    </>
  )
}
