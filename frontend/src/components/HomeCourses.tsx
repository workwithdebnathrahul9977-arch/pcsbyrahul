'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const getFullImageUrl = (url: string) => {
  if (!url) return '';
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('http') || cleanUrl.startsWith('data:')) return cleanUrl;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  return `${baseUrl}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
};

function getCourseImages(course: any): string[] {
  let images: string[] = [];
  if (course.description) {
    try {
      const parsed = JSON.parse(course.description);
      if (parsed.subjects && parsed.subjects.length > 0) {
        images = parsed.subjects.map((s: any) => s.imageUrl).filter(Boolean);
      }
    } catch (e) {}
  }
  if (images.length === 0 && course.imageUrl) {
    if (course.imageUrl.startsWith('data:image')) {
      images = [course.imageUrl];
    } else {
      images = course.imageUrl.split(',').slice(0, 2);
    }
  }
  return images;
}

function getCourseDescriptionHtml(course: any): string {
  if (!course.description) return '';
  try {
    const parsed = JSON.parse(course.description);
    let html = '';
    if (parsed.subtitle) html += `<h2>${parsed.subtitle}</h2>`;
    if (parsed.points && parsed.points.length > 0) {
      html += `<ul>${parsed.points.map((p: string) => `<li>${p}</li>`).join('')}</ul>`;
    }
    return html;
  } catch {
    return course.description;
  }
}

function CourseCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-48 md:h-[220px] bg-gradient-to-br from-gray-200 to-gray-300"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3"></div>
        <div className="h-4 bg-gray-100 rounded w-4/5"></div>
        <div className="h-3 bg-gray-100 rounded w-3/4"></div>
        <div className="h-3 bg-gray-100 rounded w-2/3"></div>
        <div className="flex gap-2 mt-4">
          <div className="h-9 bg-gray-200 rounded-xl flex-1"></div>
          <div className="h-9 bg-red-200 rounded-xl flex-1"></div>
        </div>
      </div>
    </div>
  );
}

export default function HomeCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/courses?limit=6`)
      .then(res => setCourses(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
        {[1,2,3,4].map(i => <CourseCardSkeleton key={i} />)}
      </div>
    );
  }

  if (courses.length === 0) {
    return <div className="text-center py-20 text-gray-500">বর্তমানে কোনো কোর্স চালু নেই।</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
      {courses.map((course) => {
        const images = getCourseImages(course);
        const descHtml = getCourseDescriptionHtml(course);
        return (
          <div
            key={course.id}
            className="flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group max-w-[340px] mx-auto w-full md:max-w-none"
          >
            {/* Top Banner — matches admin design exactly */}
            <div className="h-48 md:h-[220px] bg-gradient-to-br from-[#e60000] via-[#cc0000] to-[#8a0000] flex flex-col items-center justify-center p-3 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle, #fff 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }}></div>
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/20 blur-3xl rounded-full pointer-events-none"></div>
              <i className="fa-solid fa-book-open absolute -bottom-4 -right-4 text-white/5 text-[8rem] md:text-[9rem] rotate-[15deg] pointer-events-none"></i>

              <div className="flex flex-row items-center justify-center gap-3 mb-3 z-10">
                {images.length === 0 ? (
                  <div className="w-24 h-32 sm:w-28 sm:h-36 bg-white/10 rounded shadow-inner flex flex-col items-center justify-center backdrop-blur-sm">
                    <i className="fa-solid fa-book-open-reader text-2xl text-white/80"></i>
                  </div>
                ) : (
                  images.slice(0, 2).map((imgUrl, idx) => (
                    <img key={idx} src={getFullImageUrl(imgUrl)} alt={course.title} className="w-20 h-28 sm:w-24 sm:h-32 object-cover rounded shadow-lg" />
                  ))
                )}
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4 md:p-5 flex flex-col flex-1 bg-white">
              <h3 className="text-xl md:text-[22px] font-black text-gray-900 mb-1.5 leading-tight">{course.title}</h3>
              <div
                className="text-gray-600 text-[13px] md:text-sm mb-4 flex-1 mt-1.5 leading-relaxed space-y-1 [&>h2]:!text-red-600 [&>h2]:text-[16px] [&>h2]:font-bold [&>ul]:list-none [&>ul]:mt-1.5 [&>ul>li]:relative [&>ul>li]:pl-4 [&>ul>li]:mb-1 [&>ul>li::before]:content-[''] [&>ul>li::before]:absolute [&>ul>li::before]:left-0 [&>ul>li::before]:top-1.5 [&>ul>li::before]:w-1.5 [&>ul>li::before]:h-1.5 [&>ul>li::before]:bg-red-500 [&>ul>li::before]:rounded-full"
                dangerouslySetInnerHTML={{ __html: descHtml }}
              />
              <div className="flex gap-2 mt-auto pt-3 border-t border-gray-50">
                <Link
                  href={`/courses/${course.id}`}
                  className="flex-1 text-center text-sm font-bold px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  সাপ্তাহিক টেস্ট
                </Link>
                <Link
                  href={`/courses/${course.id}`}
                  className="flex-1 text-center text-sm font-bold px-3 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  ভর্তি হোন →
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
