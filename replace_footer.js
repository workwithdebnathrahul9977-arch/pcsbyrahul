const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');

const newFooter = \      {/* Premium Global Footer */}
      <footer className="bg-[#0a0a0a] border-t-4 border-red-600 pt-16 pb-8 mt-auto relative overflow-hidden">
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
            <div className="lg:col-span-4">
              <img src="/logo.png" alt="PhysChemia" className="h-12 w-auto mb-6 brightness-0 invert" />
              <p className="text-sm text-gray-400 leading-relaxed mb-8 pr-4">
                বাংলাদেশের সবচেয়ে আধুনিক অফলাইন ও অনলাইন শিক্ষা প্ল্যাটফর্ম। SSC ও HSC প্রস্তুতিতে সেরা মেন্টরশিপ পাও আমাদের সাথে।
              </p>
              <div className="flex items-center space-x-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-youtube group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-facebook-f group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-pink-600 hover:text-white hover:border-pink-600 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-instagram group-hover:scale-110 transition-transform"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-lg group">
                  <i className="fa-brands fa-whatsapp group-hover:scale-110 transition-transform"></i>
                </a>
              </div>
            </div>
  
            {/* Links 1 (Span 2) */}
            <div className="lg:col-span-2">
              <h3 className="text-white font-bold mb-6 text-lg">গুরুত্বপূর্ণ লিংক</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">হোমপেজ</Link></li>
                <li><Link href="/courses" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">কোর্সসমূহ</Link></li>
                <li><Link href="/about" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">আমাদের সম্পর্কে</Link></li>
                <li><Link href="/gallery" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">গ্যালারি</Link></li>
              </ul>
            </div>

            {/* Support (Span 3) */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold mb-6 text-lg">সাপোর্ট</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li><Link href="/admission" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">ভর্তির নিয়ম</Link></li>
                <li><Link href="/refund" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">রিফান্ড পলিসি</Link></li>
                <li><Link href="/terms" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">টার্মস</Link></li>
                <li><Link href="/privacy" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">প্রাইভেসি পলিসি</Link></li>
                <li><Link href="/faq" className="hover:text-red-400 hover:translate-x-1 inline-block transition-transform">FAQ</Link></li>
              </ul>
            </div>
  
            {/* Contact (Span 3) */}
            <div className="lg:col-span-3">
              <h3 className="text-white font-bold mb-6 text-lg">যোগাযোগ</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="flex items-start">
                  <i className="fa-regular fa-envelope mt-1 w-6 text-red-500"></i>
                  <span>contact@physchemia.com<br/>info@physchemia.com</span>
                </li>
                <li className="flex items-center">
                  <i className="fa-solid fa-phone w-6 text-red-500"></i>
                  <span>+880 1788-522363</span>
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-location-dot mt-1 w-6 text-red-500"></i>
                  <a href="https://share.google/k3pki6PdY1T9EFxb9" target="_blank" rel="noopener noreferrer" className="hover:text-red-400 transition-colors leading-relaxed">
                    কেটি-পয়েন্ট (হবিগঞ্জ খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার 3200
                  </a>
                </li>
              </ul>
            </div>
            
          </div>
  
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p className="mb-4 md:mb-0">
              &copy; 2026 <span className="font-bold text-gray-300">PhysChemia</span>. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <p className="flex items-center">
              Developed by <a href="#" className="ml-1 text-red-500 font-bold hover:underline">Team Nexa</a>
            </p>
          </div>
        </div>
      </footer>\;

const startIdx = content.indexOf('      {/* Premium Global Footer */}');
const endIdx = content.indexOf('    </>');

if (startIdx !== -1 && endIdx !== -1) {
  content = content.slice(0, startIdx) + newFooter + '\n' + content.slice(endIdx);
  fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
  console.log('Successfully replaced footer');
} else {
  console.log('Could not find footer tags');
}
