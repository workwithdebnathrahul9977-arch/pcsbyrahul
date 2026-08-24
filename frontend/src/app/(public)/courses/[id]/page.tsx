'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CourseDetails() {
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will fetch all courses and find this one (since we don't have a GET /id API route yet, or do we?)
    // Actually, I'll just fetch all and filter for now to be safe, or assume backend can handle it if I wrote it.
    // Let's just fetch all and find the matching ID.
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/courses`)
      .then(res => {
        const foundCourse = res.data.find((c: any) => c.id === id);
        setCourse(foundCourse);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Not Found</h1>
        <Link href="/courses" className="text-red-600 font-bold hover:underline">← ফিরে যান</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-8 text-sm font-medium text-gray-500">
          <Link href="/" className="hover:text-red-600">হোম</Link>
          <span className="mx-2">/</span>
          <Link href="/courses" className="hover:text-red-600">কোর্সসমূহ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{course.title}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
          
          {/* Left: Image */}
          <div className="lg:w-1/2 relative bg-gray-100">
            {course.imageUrl ? (
              <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover min-h-[300px] lg:min-h-full" />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center text-gray-400">
                <i className="fa-solid fa-image text-6xl"></i>
              </div>
            )}
            <div className="absolute top-6 right-6 bg-red-600 text-white font-black px-6 py-2 rounded-full shadow-lg text-lg">
              ৳ {course.fee}
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-1/2 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
              {course.title}
            </h1>
            
            <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-center text-gray-600">
                <i className="fa-solid fa-chalkboard-user mr-2 text-red-500"></i>
                <span className="font-medium">Sumel Sir</span>
              </div>
              <div className="flex items-center text-gray-600">
                <i className="fa-solid fa-video mr-2 text-red-500"></i>
                <span className="font-medium">Online & Offline</span>
              </div>
            </div>

            {/* Rich Text Description */}
            <div className="prose prose-red max-w-none text-gray-700 leading-relaxed mb-10" 
                 dangerouslySetInnerHTML={{ __html: course.description }}>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <Link href="/admission" className="flex-1 bg-red-600 text-white text-center py-4 rounded-xl font-bold text-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all">
                এখনই ভর্তি হও
              </Link>
              <button className="flex-1 bg-gray-100 text-gray-800 text-center py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-all border border-gray-200">
                রুটিন ডাউনলোড
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  )
}
