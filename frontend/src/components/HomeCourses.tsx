'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function HomeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top 6 recent courses
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses?limit=6`)
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-500 font-bold">কোর্স লোড হচ্ছে...</div>;
  }

  if (courses.length === 0) {
    return <div className="text-center py-20 text-gray-500">বর্তমানে কোনো কোর্স চালু নেই।</div>;
  }

  return (
    <div className="relative">
      {/* Scrollable Container */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-4 md:pb-8 pt-4 px-2 -mx-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="snap-center flex flex-col shrink-0 w-[85vw] sm:w-[280px] md:w-[360px] bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:bg-gray-50 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-all duration-500 group relative overflow-hidden"
          >
            {/* Glowing orb effect on hover inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

            <div className="h-44 sm:h-48 rounded-xl bg-gray-50 flex items-center justify-center relative overflow-hidden shrink-0 mb-4 z-10 border border-white/5 group-hover:border-red-500/20 transition-colors">
              {course.imageUrl ? (
                <img src={course.imageUrl} alt={course.title} className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700" />
              ) : (
                <span className="text-white/30 font-bold">[Course Banner]</span>
              )}
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500"></div>
            </div>
            
            <div className="flex flex-col flex-1 z-10">
              <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors drop-shadow-sm">
                {course.title}
              </h3>
              
              <div className="text-gray-600 text-sm mb-6 flex-1 overflow-hidden">
                <div 
                  className="line-clamp-3 leading-relaxed editor-content [&_*]:!bg-transparent [&_p]:!text-gray-600 [&_span]:!text-gray-600 [&_li]:!text-gray-600 [&>h1]:!text-red-400 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:!text-red-400 [&>h2]:text-base [&>h2]:font-bold [&>h3]:!text-red-400 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:!text-gray-900 [&_strong]:font-black [&>em]:italic"
                  dangerouslySetInnerHTML={{ __html: course.description || "এই কোর্সটি সম্পর্কে আরও বিস্তারিত জানতে ভর্তি বাটনে ক্লিক করুন।" }}
                />
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 relative">
                <Link href={`/courses`} className="flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-black hover:from-red-700 hover:to-red-600 transition shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] group/btn">
                  ভর্তি হোন 
                  <i className="fa-solid fa-chevron-right ml-2 text-sm transition-transform group-hover/btn:translate-x-1"></i>
                </Link>
                {/* Glowing line on card hover */}
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-red-400 mt-4 mx-auto rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 absolute -bottom-4 left-0"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Helper text for desktop */}
      <div className="text-center text-sm text-gray-400 mt-2 hidden md:block">
        <i className="fa-solid fa-arrows-left-right mr-2"></i> আরো কোর্স দেখতে ডানে-বামে স্লাইড করুন
      </div>
    </div>
  );
}
