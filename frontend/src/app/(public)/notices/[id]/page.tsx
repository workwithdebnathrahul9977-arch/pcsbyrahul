'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export default function NoticeDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [notice, setNotice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/notices/${id}`)
      .then(res => setNotice(res.data))
      .catch(err => {
        console.error(err);
        router.push('/notices');
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (!notice) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-6 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-200 relative overflow-hidden">
          {/* Decorative Header Accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-red-600"></div>
          
          <div className="border-b border-gray-100 pb-8 mb-8 relative">
            <button 
              onClick={() => router.push('/notices')}
              className="absolute top-0 right-0 h-10 w-10 bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-full flex items-center justify-center transition-colors border border-gray-200"
              title="Back to Notice List"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-4 leading-tight pr-12">{notice.title}</h1>
            <div className="flex items-center text-gray-500 font-medium bg-gray-50 w-fit px-4 py-2 rounded-lg border border-gray-100">
              <i className="fa-regular fa-calendar-days mr-2 text-red-500"></i>
              Published on: <span className="ml-1 text-gray-800 font-bold">{new Date(notice.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}</span>
            </div>
          </div>
          
          <div 
            className="text-gray-800 leading-relaxed text-lg min-h-[200px] editor-content [&>h1]:text-red-600 [&>h1]:text-2xl [&>h1]:font-black [&>h1]:mb-4 [&>h2]:text-red-600 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h3]:text-red-600 [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mb-2 [&>p]:mb-4 [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>strong]:font-bold [&>em]:italic"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
          
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-400 font-medium">
              Target Audience: {notice.target === 'ALL' ? 'Public' : 'Students Only'}
            </span>
            <span className="text-red-600 font-bold flex items-center">
              PhysChemia <i className="fa-solid fa-circle-check ml-1"></i>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
