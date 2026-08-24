      {/* Premium Global Footer */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-16">
            
            {/* Brand & Links (Span 4) */}
            <div className="lg:col-span-4 pr-0 md:pr-4">
              <img src="/logo.png" alt="PhysChemia" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
              
              <h3 className="text-white font-bold mb-4 text-lg relative inline-block">
                গুরুত্বপূর্ণ লিংক
                <span className="absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded"></span>
              </h3>
              <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-400">
                <Link href="/" className="hover:text-red-400 transition-colors">হোমপেজ</Link>
                <Link href="/admission" className="hover:text-red-400 transition-colors">ভর্তির নিয়ম</Link>
                <Link href="/courses" className="hover:text-red-400 transition-colors">কোর্সসমূহ</Link>
                <Link href="/refund" className="hover:text-red-400 transition-colors">রিফান্ড পলিসি</Link>
                <Link href="/about" className="hover:text-red-400 transition-colors">আমাদের সম্পর্কে</Link>
                <Link href="/terms" className="hover:text-red-400 transition-colors">শর্তাবলী</Link>
                <Link href="/gallery" className="hover:text-red-400 transition-colors">গ্যালারি</Link>
                <Link href="/privacy" className="hover:text-red-400 transition-colors">প্রাইভেসি</Link>
              </div>
            </div>
  
            {/* Social Cards Stacked (Span 4) */}
            <div className="lg:col-span-4">
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
    
            {/* Contact (Span 4) */}
            <div className="lg:col-span-4 pl-0 lg:pl-6">
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
