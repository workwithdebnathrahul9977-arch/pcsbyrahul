'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MonthlyAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/classes`).then(res => setClasses(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/batches`).then(res => setBatches(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
          <i className="fa-regular fa-clipboard text-orange-500"></i>
          <h2 className="font-bold text-gray-800 text-lg">Student Attendance List</h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Class</label>
              <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Batch</label>
              <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
                <option value="">Select Batch</option>
                {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Month</label>
              <input type="month" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none text-gray-500" />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
              <i className="fa-solid fa-magnifying-glass mr-2"></i> Search
            </button>
            <button className="bg-[#6b7280] hover:bg-[#4b5563] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm">
              <i className="fa-solid fa-rotate mr-2"></i> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
