'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function BlankSheet() {
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/classes`).then(res => setClasses(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/batches`).then(res => setBatches(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Download Blank Attendance Sheet</h1>
        <p className="text-sm text-gray-500">Generate a printable PDF blank sheet for offline attendance marking.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Class</label>
            <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
              <option value="">Select Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Select Batch</label>
            <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
              <option value="">Select Batch</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          
          <div className="pt-4">
            <button className="w-full bg-[#10b981] hover:bg-[#059669] text-white px-6 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm">
              <i className="fa-solid fa-file-pdf mr-2"></i> Generate & Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
