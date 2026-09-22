'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PublicResultList() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/exams`);
        setExams(data);
      } catch (error) {
        console.error('Failed to load exams', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const title = (exam.title || '').toLowerCase();
    const type = (exam.type || '').toLowerCase();
    const batchName = (exam.batch?.academicClass?.name || exam.batch?.name || '').toLowerCase();
    return title.includes(query) || type.includes(query) || batchName.includes(query);
  });

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {/* HEADER SECTION (Floating on background) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> RESULTS
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Exam Results</h1>
            <p className="text-gray-500 text-sm md:text-base">View all recently published examination results. Click on the subject name to view your marksheet.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
              </div>
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search subject or class..." 
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-full pl-11 pr-4 py-3 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" 
              />
            </div>
          </div>
        </div>

        {/* RESULTS TABLE CARD */}
        <div className="bg-white rounded-[2rem] shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="py-32 text-center">
              <i className="fa-solid fa-spinner fa-spin text-4xl text-red-400 mb-6"></i>
              <p className="text-gray-500 text-base font-medium">Loading recent results...</p>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="py-32 text-center">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <i className="fa-solid fa-search text-4xl"></i>
              </div>
              <p className="text-gray-500 font-medium text-base">No results found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">#</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">Exam Date</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">Published</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">Category</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">Class</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500">Subject</th>
                    <th className="px-8 py-5 text-xs font-semibold text-gray-500 text-right">Full Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/80">
                  {filteredExams.map((exam, index) => {
                    const examDate = new Date(exam.date);
                    const formattedDate = examDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    const publishDate = new Date(examDate);
                    publishDate.setDate(publishDate.getDate() + 1);
                    const formattedPublishDate = publishDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
                    
                    return (
                      <tr key={exam.id} className="hover:bg-red-50/20 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="text-xs font-medium text-gray-400">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-medium text-gray-700">{formattedDate}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 rounded-full bg-red-50 text-red-600 text-[11px] font-semibold border border-red-100/50">
                            {formattedPublishDate}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-sm font-medium text-gray-600">{exam.type?.replace('_', ' ') || '—'}</span>
                        </td>
                        <td className="px-8 py-5">
                          <span className="inline-block px-3 py-1 rounded-full bg-gray-50 text-gray-600 text-[11px] font-semibold border border-gray-100">
                            {exam.batch?.academicClass?.name || exam.batch?.name?.split(' ')[0] || '—'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <Link href="/marksheet" className="text-sm font-medium text-red-500 hover:text-red-700 hover:underline transition-colors">
                            {exam.title}
                          </Link>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className="text-sm font-bold text-gray-800">{exam.totalMark}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
