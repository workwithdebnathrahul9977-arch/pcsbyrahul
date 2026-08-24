'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function Courses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    // If arriving from home page category click, set the active category from URL
    const params = new URLSearchParams(window.location.search);
    const catParam = params.get('category');
    if (catParam) {
      setActiveCategory(catParam);
    }

    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`)
    ])
      .then(([coursesRes, categoriesRes]) => {
        setCourses(coursesRes.data);
        setCategories(categoriesRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = activeCategory === 'ALL' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Light Background Section for Header & Filters */}
      <div className="bg-gray-50 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-10">
            <span className="text-red-600 font-bold tracking-wider uppercase text-sm mb-2 block">Our Programs</span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight relative inline-block pb-4">
              সকল কোর্সসমূহ
              <span className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded"></span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
              তোমার লক্ষ্য পূরণের জন্য আমাদের রয়েছে সেরা মেন্টরশিপ এবং গোছানো স্টাডি প্ল্যান। তোমার প্রয়োজনীয় কোর্সটি বেছে নাও আজই।
            </p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            <button
              onClick={() => setActiveCategory('ALL')}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                activeCategory === 'ALL' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
              }`}
            >
              All Courses
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.name)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  activeCategory === cat.name 
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30' 
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dark Red Gradient Section for Courses Grid */}
      <div className="flex-1 bg-gradient-to-b from-red-800 via-red-900 to-red-950 border-y border-red-900/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white/5 backdrop-blur-md rounded-[20px] shadow-sm border border-white/10">
              <i className="fa-solid fa-book-open text-5xl text-gray-500 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-400">কোনো কোর্স পাওয়া যায়নি</h3>
              <p className="text-gray-500 mt-2">শীঘ্রই নতুন কোর্স যুক্ত করা হবে।</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredCourses.map(course => (
                <div 
                  key={course.id} 
                  className="flex flex-col w-full bg-white/5 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-white/10 hover:border-red-500/40 hover:bg-gradient-to-b hover:from-white/10 hover:to-red-900/30 transform hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-all duration-500 group relative overflow-hidden"
                >
                  {/* Glowing orb effect on hover inside card */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-red-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

                  <div className="h-56 rounded-xl bg-black/20 flex items-center justify-center relative overflow-hidden shrink-0 mb-4 z-10 border border-white/5 group-hover:border-red-500/20 transition-colors">
                    {course.imageUrl ? (
                      <img src={course.imageUrl} alt={course.title} className="w-full h-full object-fill group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <span className="text-white/30 font-bold">[Course Banner]</span>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a0101] via-transparent to-transparent opacity-80 group-hover:opacity-50 transition-opacity duration-500"></div>
                    
                    {/* Price Tag Overlay */}
                    <div className="absolute top-3 right-3 bg-red-600/90 backdrop-blur-md shadow-lg px-4 py-1.5 rounded-full font-black text-white text-sm border border-red-400/30">
                      ৳ {course.fee}
                    </div>
                  </div>
                  
                  <div className="flex flex-col flex-1 z-10 px-1">
                    <h3 className="text-2xl font-black text-white mb-3 line-clamp-2 leading-snug group-hover:text-red-400 transition-colors drop-shadow-sm">
                      {course.title}
                    </h3>
                    
                    <div className="text-gray-300 text-sm mb-6 flex-1 overflow-hidden">
                      <div 
                        className="line-clamp-3 leading-relaxed editor-content [&_*]:!bg-transparent [&_p]:!text-gray-200 [&_span]:!text-gray-200 [&_li]:!text-gray-200 [&>h1]:!text-red-400 [&>h1]:text-lg [&>h1]:font-bold [&>h2]:!text-red-400 [&>h2]:text-base [&>h2]:font-bold [&>h3]:!text-red-400 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-4 [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:!text-white [&_strong]:font-black [&>em]:italic"
                        dangerouslySetInnerHTML={{ __html: course.description || "এই কোর্সটি সম্পর্কে আরও বিস্তারিত জানতে ক্লিক করুন।" }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 border-t border-white/10 relative">
                      <div className="grid grid-cols-2 gap-3">
                        <Link href={`/courses/${course.id}`} className="flex items-center justify-center w-full bg-white/5 border border-white/10 text-white py-3 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 transition-all">
                          বিস্তারিত
                        </Link>
                        <Link href="/admission" className="flex items-center justify-center w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-xl font-black hover:from-red-700 hover:to-red-600 transition shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] group/btn">
                          ভর্তি হোন 
                        </Link>
                      </div>
                      {/* Glowing line on card hover */}
                      <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-red-500 to-red-400 mt-5 mx-auto rounded-full transition-all duration-500 ease-out opacity-0 group-hover:opacity-100 absolute -bottom-5 left-0"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
