'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function CourseCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_CATEGORIES_ON_HOME`).catch(() => ({ data: { value: 'true' } }))
    ])
      .then(([catRes, settingRes]) => {
        setCategories(catRes.data);
        setShow(settingRes.data.value !== 'false');
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || categories.length === 0 || !show) return null;

  return (
    <div className="pt-16 md:pt-24 pb-8 md:pb-12">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h2 className="text-2xl md:text-4xl font-black text-center text-white mb-10 md:mb-16 relative inline-block left-1/2 -translate-x-1/2 pb-4">
          কোর্স ক্যাটাগরি
          <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded"></span>
        </h2>

        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pt-4 pb-6 px-2 -mx-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {categories.map((cat) => (
            <Link 
              href={`/courses?category=${encodeURIComponent(cat.name)}`}
              key={cat.id}
              className="w-[85vw] sm:w-auto shrink-0 snap-center bg-white/5 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-white/10 hover:border-white/30 hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 group block"
            >
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative mb-5 bg-black/20">
                {cat.imageUrl ? (
                  <img 
                    src={cat.imageUrl} 
                    alt={cat.name} 
                    className="w-full h-full object-fill"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <i className="fa-solid fa-folder text-4xl text-white/20"></i>
                  </div>
                )}
                {/* Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              <div className="text-center pb-3 flex flex-col items-center">
                <h3 className="font-black text-xl text-white tracking-wide transition-colors duration-300 z-10">
                  {cat.name}
                </h3>
                {/* Glowing line on hover */}
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-600 via-red-400 to-red-600 mt-3 rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
