const fs = require('fs');

const middleColReplacement = \
            {/* Social Cards Stacked (Span 4) */}
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
            </div>\;

let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');

// The block to replace:
const startStr = '{/* Social Buttons (Replacing Links) */}';
const endStr = '{/* Contact */}';

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  content = content.substring(0, startIdx) + middleColReplacement + '\n    ' + content.substring(endIdx);
  fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
  console.log('Success');
} else {
  console.log('Failed to find tags');
}
