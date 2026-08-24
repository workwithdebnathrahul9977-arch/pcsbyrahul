'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrustSection() {
  const [sirImageUrl, setSirImageUrl] = useState('');

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/ABOUT_SIR_IMAGE`)
      .then(res => setSirImageUrl(res.data.value))
      .catch(console.error);
  }, []);

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden border-t border-gray-100">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Text & Grid */}
          <div className="w-full md:w-3/5 order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">
              কেন আমাদের কোর্সে <br/><span className="text-red-400">আস্থা রাখবেন?</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {[
                "সহজ ভাষায় কঠিন টপিক বোঝানো",
                "বোর্ড প্রশ্ন এনালাইসিস ভিত্তিক পড়ানো",
                "শর্ট টেকনিক + পরীক্ষাভিত্তিক প্রস্তুতি",
                "লাইভ ক্লাস + রেকর্ড সাপোর্ট",
                "অধ্যায় শেষে পরীক্ষা",
                "সাজেশন + গাইডলাইন"
              ].map((text, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 lg:p-5 rounded-2xl flex items-center shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-300 group"
                >
                  <div className="w-6 h-6 rounded-full bg-red-500/20 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)] flex items-center justify-center mr-4 flex-shrink-0 group-hover:bg-red-500/30 transition-colors">
                    <i className="fa-solid fa-check text-red-400 text-xs shadow-none"></i>
                  </div>
                  <span className="text-gray-700 font-bold group-hover:text-red-600 transition-colors text-sm lg:text-base leading-snug">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Sir Image */}
          <div className="w-full md:w-2/5 order-1 md:order-2 flex justify-center">
            <div className="w-full max-w-[400px] aspect-[4/5] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-2xl relative group">
              {sirImageUrl ? (
                <img 
                  src={sirImageUrl} 
                  alt="Sumel Sir" 
                  className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-center text-white/30 border border-dashed border-white/20 m-4 rounded-2xl">
                  <span className="font-bold">Sir's Image<br/>(Upload from Admin)</span>
                </div>
              )}
              {/* Inner Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80 pointer-events-none"></div>
              {/* Red glow behind image */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-red-600/20 blur-[80px] rounded-full pointer-events-none -z-10"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
