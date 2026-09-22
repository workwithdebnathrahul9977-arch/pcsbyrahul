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
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/academic/classes`)
    ])
      .then(([coursesRes, classesRes]) => {
        setCourses(coursesRes.data);
        setCategories(classesRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredCourses = activeCategory === 'ALL' 
    ? courses 
    : courses.filter(c => c.academicClassId === activeCategory || c.category === activeCategory);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Light Background Section for Header & Filters */}
      <div className="bg-gray-50 pt-12 pb-8">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
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
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all ${
                  (activeCategory === cat.id || activeCategory === cat.name)
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

      {/* Light Section for Courses Grid (Matching Home) */}
      <div className="flex-1 bg-[#fef9f9] py-16">
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Courses Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[20px] shadow-sm border border-gray-100">
              <i className="fa-solid fa-book-open text-5xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-bold text-gray-500">কোনো কোর্স পাওয়া যায়নি</h3>
              <p className="text-gray-400 mt-2">অন্য কোনো ক্যাটাগরি সিলেক্ট করুন</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
              {filteredCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_10px_30px_rgba(220,38,38,0.1)] hover:-translate-y-1 transition-all duration-300 group max-w-[340px] mx-auto w-full md:max-w-none"
                >
                  {/* Top Banner Area (Rich Gradient + Texture) */}
                  <div className="h-48 md:h-[220px] bg-gradient-to-br from-[#e60000] via-[#cc0000] to-[#8a0000] flex flex-col items-center justify-center p-3 relative overflow-hidden">
                    
                    {/* Dot Grid Texture */}
                    <div 
                      className="absolute inset-0 opacity-[0.15] mix-blend-overlay" 
                      style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}
                    ></div>
                    
                    {/* Lighting Glow */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>

                    {/* Background Watermark Icon */}
                    <i className="fa-solid fa-book-open absolute -bottom-4 -right-4 text-white/5 text-[8rem] md:text-[9rem] rotate-[15deg] pointer-events-none transition-transform duration-500 group-hover:rotate-[10deg] group-hover:scale-110"></i>

                    {/* Book Image(s) */}
                    <div className="flex flex-row items-center justify-center gap-3 mb-3 z-10 group-hover:-translate-y-1 transition-all duration-300">
                      {(() => {
                        let images: string[] = [];
                        
                        if (course.description) {
                          try {
                            const parsed = JSON.parse(course.description);
                            if (parsed.subjects && parsed.subjects.length > 0) {
                              images = parsed.subjects.map((s: any) => s.imageUrl).filter(Boolean);
                            }
                          } catch (e) { }
                        }
                        
                        if (images.length === 0 && course.imageUrl) {
                          if (course.imageUrl.startsWith('data:image')) {
                            images = [course.imageUrl];
                          } else {
                            images = course.imageUrl.split(',').slice(0, 2);
                          }
                        }

                        if (images.length === 0) {
                          return (
                            <div className="w-24 h-32 sm:w-28 sm:h-36 bg-white/10 rounded shadow-inner mb-3 flex flex-col items-center justify-center backdrop-blur-sm">
                              <i className="fa-solid fa-book-open-reader text-2xl text-white/80"></i>
                            </div>
                          );
                        }

                        return images.slice(0, 2).map((imgUrl: string, idx: number) => {
                          const cleanUrl = imgUrl.trim();
                          const fullUrl = cleanUrl.startsWith('http') || cleanUrl.startsWith('data:') 
                            ? cleanUrl 
                            : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
                          return (
                            <img 
                              key={idx}
                              src={fullUrl} 
                              alt={course.title} 
                              className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded shadow-lg group-hover:shadow-xl transition-shadow duration-300" 
                            />
                          );
                        });
                      })()}
                    </div>
                    
                    {/* Pill Badge */}
                    <span className="z-10 bg-[#990000] text-white text-[11px] md:text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
                      {course.fee ? `৳ ${course.fee}` : 'Course Info'}
                    </span>
                  </div>
                  
                  {/* Content Area (Compacted) */}
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <h3 className="text-xl md:text-[22px] font-black text-gray-900 mb-1.5 leading-tight">
                      {course.title}
                    </h3>
                    
                    <div className="text-gray-600 text-[13px] md:text-sm mb-4 flex-1 mt-1.5">
                      <div 
                        className="leading-relaxed editor-content space-y-1 [&_*]:!bg-transparent [&_p]:!text-gray-600 [&_span]:!text-gray-600 [&_li]:!text-gray-600 [&>h1]:!text-red-600 [&>h1]:text-[16px] [&>h1]:font-bold [&>h2]:!text-red-600 [&>h2]:text-[18px] md:[&>h2]:text-[20px] [&>h2]:font-bold [&>h3]:!text-red-600 [&>p]:mb-1 [&>ul]:list-none [&>ul]:mt-1.5 [&>ul>li]:relative [&>ul>li]:pl-4 [&>ul>li]:mb-1 [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-1.5 [&>ul>li::before]:w-1.5 [&>ul>li::before]:h-1.5 [&>ul>li::before]:bg-red-500 [&>ul>li::before]:rounded-full [&>ol]:list-decimal [&>ol]:pl-4 [&_strong]:!text-gray-900 [&_strong]:font-black [&>em]:italic"
                        dangerouslySetInnerHTML={{ 
                          __html: (() => {
                            if (!course.description) return "বিস্তারিত জানতে ক্লিক করুন";
                            try {
                              const parsed = JSON.parse(course.description);
                              if (parsed.subtitle || parsed.points) {
                                let html = '';
                                if (parsed.subtitle) html += `<h2>${parsed.subtitle}</h2>`;
                                if (parsed.points && parsed.points.length > 0) {
                                  html += `<ul>${parsed.points.map((p: string) => `<li>${p}</li>`).join('')}</ul>`;
                                }
                                return html;
                              }
                            } catch (e) {
                              // HTML fallback
                            }
                            return course.description;
                          })() 
                        }}
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto flex flex-row gap-3 pt-3 border-t border-gray-100">
                      <Link href={`/routine?courseId=${course.id}`} className="flex-1 flex items-center justify-center border border-red-200 text-red-600 bg-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-300 transition-colors">
                        রুটিন দেখুন
                      </Link>
                      <Link href={`/admission?courseId=${course.id}`} className="flex-1 flex items-center justify-center bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-500/20 group/btn">
                        ভর্তি হোন <i className="fa-solid fa-chevron-right ml-1.5 text-xs transition-transform group-hover/btn:translate-x-1"></i>
                      </Link>
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
