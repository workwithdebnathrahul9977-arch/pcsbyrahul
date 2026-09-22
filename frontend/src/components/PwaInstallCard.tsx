'use client';
import { useState, useEffect } from 'react';

export default function PwaInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      alert("Please open browser menu and select 'Install App' or 'Add to Home screen'");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    <section className="py-12 md:py-16 bg-[#fef9f9]">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-red-600 to-red-800 shadow-[0_20px_50px_rgb(220,38,38,0.2)]">

          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-black/10 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 -translate-y-1/2 w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="absolute top-8 left-1/3 w-2 h-2 bg-white/20 rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8 md:px-14 py-12 md:py-14 gap-10">
            
            {/* Left: Text + Button */}
            <div className="w-full md:w-[55%] text-center md:text-left">
              <span className="inline-block bg-white/15 text-white text-xs font-bold uppercase tracking-[0.15em] px-3.5 py-1.5 rounded-full mb-6 backdrop-blur-sm border border-white/10">
                📱 Mobile App
              </span>
              <h2 className="text-3xl md:text-[2.6rem] font-bold text-white leading-[1.2] mb-5 tracking-tight">
                আমাদের স্মার্ট কোচিং অ্যাপ<br/>
                <span className="text-red-200">ডাউনলোড করুন!</span>
              </h2>
              <p className="text-red-100 text-sm md:text-base mb-8 max-w-md mx-auto md:mx-0 leading-relaxed font-medium opacity-90">
                আপনার পরীক্ষার রেজাল্ট, প্রতিদিনের হাজিরা, পেমেন্ট স্ট্যাটাস এবং ক্লাস রুটিন এখন আপনার হাতের মুঠোয়। আপডেট থাকুন যেকোনো সময়, যেকোনো জায়গায়।
              </p>

              <button
                onClick={handleInstall}
                className="inline-flex items-center bg-white text-red-600 font-bold py-3.5 px-8 rounded-2xl hover:bg-red-50 transition-all shadow-xl hover:shadow-red-900/30 hover:-translate-y-1 group"
              >
                <i className="fa-brands fa-google-play text-2xl mr-4 group-hover:scale-110 transition-transform"></i>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-widest opacity-60 font-black leading-none mb-1">Install Now</div>
                  <div className="text-[17px] font-black leading-none">Get the App</div>
                </div>
              </button>
            </div>

            {/* Right: Phone Mockup */}
            <div className="w-full md:w-[45%] flex justify-center md:justify-end items-end">
              <div className="relative w-[220px] md:w-[260px]">
                {/* Glow behind phone */}
                <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full scale-110"></div>

                {/* Phone frame */}
                <div className="relative bg-gray-900 rounded-[2.8rem] p-2.5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] border-4 border-gray-800 rotate-[-4deg] hover:rotate-0 transition-all duration-500 ease-out">
                  <div className="bg-white rounded-[2.2rem] overflow-hidden shadow-inner" style={{paddingBottom: '195%', position: 'relative'}}>
                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-3xl z-20 flex justify-center items-center">
                      <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
                    </div>
                    
                    {/* Screen Content */}
                    <div className="absolute inset-0 flex flex-col font-sans">
                      {/* App Header */}
                      <div className="bg-red-600 pt-9 pb-4 px-5 flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
                          <i className="fa-solid fa-graduation-cap text-white text-[13px]"></i>
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm leading-tight tracking-wide">PhysChemia</p>
                          <p className="text-red-200 text-[9px] font-medium tracking-wider">STUDENT PORTAL</p>
                        </div>
                      </div>

                      {/* Course Cards / Features */}
                      <div className="flex-1 bg-[#f4f5f9] p-4 space-y-2.5 overflow-hidden">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Overview</p>
                        {[
                          { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'fa-award', title: 'Exam Results', sub: 'View latest marks' },
                          { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'fa-calendar-check', title: 'Attendance', sub: 'Daily presence' },
                          { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'fa-file-invoice-dollar', title: 'Fee Payments', sub: 'Clear pending dues' },
                        ].map((c, i) => (
                          <div key={i} className="bg-white rounded-[14px] p-3 flex items-center gap-3 shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                            <div className={`w-9 h-9 ${c.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <i className={`fa-solid ${c.icon} ${c.text} text-[13px]`}></i>
                            </div>
                            <div>
                              <p className="text-[11px] font-bold text-gray-800 leading-tight mb-0.5">{c.title}</p>
                              <p className="text-[9px] font-medium text-gray-400">{c.sub}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Bottom nav */}
                      <div className="bg-white border-t border-gray-100 py-3 px-6 flex justify-between shadow-[0_-10px_20px_rgb(0,0,0,0.02)] z-10">
                        {['fa-house','fa-chart-pie','fa-bell','fa-user'].map((ic, i) => (
                          <div key={i} className={`flex flex-col items-center justify-center w-8 h-8 rounded-full ${i===0 ? 'bg-red-50 text-red-600' : 'text-gray-300'}`}>
                            <i className={`fa-solid ${ic} text-[11px]`}></i>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
