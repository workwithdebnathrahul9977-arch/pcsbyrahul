'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function PublicNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/notices`)
      .then(res => setNotices(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white min-h-screen py-8 md:py-12">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-bold text-black mb-8">Notice List</h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
          </div>
        ) : notices.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-600">বর্তমানে কোনো নোটিশ নেই</h3>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-red-600 text-white">
                  <th className="p-4 border-b border-gray-300 font-bold text-center w-24">SL No</th>
                  <th className="p-4 border-b border-gray-300 border-l font-bold">Notice Title</th>
                  <th className="p-4 border-b border-gray-300 border-l font-bold w-40">Notice Date</th>
                  <th className="p-4 border-b border-gray-300 border-l font-bold text-center w-28">Action</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((notice, index) => (
                  <tr key={notice.id} className="hover:bg-gray-50 bg-white">
                    <td className="p-4 border-b border-gray-300 text-center text-gray-900">
                      {(index + 1).toString().padStart(2, '0')}
                    </td>
                    <td className="p-4 border-b border-gray-300 border-l text-gray-900 font-medium">
                      {notice.title}
                    </td>
                    <td className="p-4 border-b border-gray-300 border-l text-gray-900">
                      {new Date(notice.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-4 border-b border-gray-300 border-l text-center">
                      <Link 
                        href={`/notices/${notice.id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded shadow text-sm font-bold transition-colors"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
