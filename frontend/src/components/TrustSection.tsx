'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TrustSection() {
  const [sirImageUrl, setSirImageUrl] = useState('');
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings`)
      .then(res => {
        if (res.data?.DIRECTOR_IMAGE) setSirImageUrl(res.data.DIRECTOR_IMAGE);
      })
      .catch(console.error)
      .finally(() => setImgLoading(false));
  }, []);

  return (
    <section className="relative bg-[#fafafa] py-16 md:py-24 overflow-hidden border-y border-gray-100">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          
          {/* Left: Text & Grid */}
          <div className="w-full md:w-3/5 order-2 md:order-1">
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">
              কেন আমাদের কোর্সে <br/><span className="text-red-400">আস্থা রাখবেন?</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {[
                "সহজ ভাষায় কঠিন টপিক বোঝানো",
                "বোর্ড প্রশ্ন এনালাইসিস ভিত্তিক পড়ানো",
                "শর্ট টেকনিক + পরীক্ষাভিত্তিক প্রস্তুতি",
                "লাইভ ক্লাস + রেকর্ড সাপোর্ট",
                "অধ্যায় শেষে পরীক্ষা",
                "সাজেশন + গাইডলাইন"
              ].map((text, idx) => (
                <div 
                  key={idx} 
                  className="bg-white p-4 lg:p-5 rounded-2xl flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_10px_30px_rgba(220,38,38,0.08)] hover:border-red-200 hover:-translate-y-1 transition-all duration-300 group"
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
              {imgLoading ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse"></div>
              ) : sirImageUrl ? (
                <img 
                  src={sirImageUrl} 
                  alt="Sumel Sir" 
                  className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-700" 
                />
              ) : (
                <div className="h-full flex items-center justify-center p-12 text-center text-gray-300 border border-dashed border-gray-200 m-4 rounded-2xl">
                  <span className="font-bold text-sm">Admin প্যানেল থেকে<br/>ছবি আপলোড করুন</span>
                </div>
              )}
              {/* Inner Glow Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80 pointer-events-none"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
