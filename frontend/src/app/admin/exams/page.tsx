'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ExamListPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [classFilter, setClassFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [meta, setMeta] = useState({ classes: [], batches: [], categories: [] });

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/exams/categories`).catch(() => ({ data: [] }))
    ]).then(([c, b, cat]) => {
      setMeta({ classes: c.data, batches: b.data, categories: cat.data });
    });
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      let url = `${API}/api/exams?`;
      if (classFilter) url += `academicClassId=${classFilter}&`;
      if (batchFilter) url += `batchId=${batchFilter}&`;
      if (categoryFilter) url += `examCategoryId=${categoryFilter}&`;
      if (startDate) url += `start=${startDate}&`;
      if (endDate) url += `end=${endDate}&`;
      
      const res = await axios.get(url);
      setExams(res.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => {
    setClassFilter('');
    setBatchFilter('');
    setCategoryFilter('');
    setStartDate('');
    setEndDate('');
    // Need a small timeout to let state update before fetching
    setTimeout(() => {
      fetchExams();
    }, 100);
  };

  const deleteExam = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await axios.delete(`${API}/api/exams/${id}`);
      fetchExams();
    } catch (e) {
      alert('Failed to delete exam');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto font-sans space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Result Management</h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
        <div className="flex items-center gap-2 text-slate-600 font-bold text-sm">
          <i className="fa-solid fa-filter"></i> Filter Exams
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Class</label>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none">
              <option value="">Select Class</option>
              {meta.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Batches</label>
            <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none">
              <option value="">Select batches</option>
              {meta.batches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Exam Category</label>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none">
              <option value="">Select categories</option>
              {meta.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none text-slate-600" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none text-slate-600" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button onClick={handleClearFilters} className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-sm">
            <i className="fa-solid fa-eraser"></i> Clear Filters
          </button>
          <button onClick={fetchExams} className="px-6 py-2.5 bg-[#4c51bf] hover:bg-[#434190] text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i className="fa-solid fa-search"></i> Search Exams
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#4c51bf] px-6 py-4 flex items-center justify-between text-white">
          <h2 className="font-bold text-lg">Exam List</h2>
          <button className="px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded text-xs font-bold transition-colors flex items-center gap-1.5 border border-white/20">
            <i className="fa-solid fa-columns"></i> Columns
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">#</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">EXAM DATE</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">EXAM NAME</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">CLASS</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">BATCHES</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">SUBJECT</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">CATEGORY</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">TOTAL MARKS</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">MCQ</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">CQ</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">WRITTEN</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase text-center">RESULT STATUS</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={13} className="px-4 py-10 text-center text-slate-500">Loading exams...</td></tr>
              ) : exams.length === 0 ? (
                <tr><td colSpan={13} className="px-4 py-10 text-center text-slate-500">No exams found. Click 'Create Exam' to add one.</td></tr>
              ) : (
                exams.map((exam, i) => (
                  <tr key={exam.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">{new Date(exam.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{exam.title}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.academicClass?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 truncate max-w-[200px]" title={exam.batches || exam.batch?.name}>{exam.batches || exam.batch?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.academicSubject?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.examCategory?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-800 font-bold">{exam.totalMark || 0}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.hasMcq ? (exam.mcqMark || 0) : '0'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.hasCq ? (exam.cqMark || 0) : '0'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{exam.hasWritten ? (exam.writtenMark || 0) : '0'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded text-[10px] font-bold ${exam.status === 'PUBLISHED' ? 'bg-[#48bb78] text-white' : 'bg-[#f56565] text-white'}`}>
                        {exam.status || 'Unpublished'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-400">
                        <Link href={`/admin/exams/marks?examId=${exam.id}`} className="text-blue-500 hover:text-blue-700 text-xs font-bold">Input <i className="fa-solid fa-paper-plane text-[10px] ml-0.5"></i></Link>
                        <button className="text-emerald-500 hover:text-emerald-700" title="Send SMS"><i className="fa-brands fa-whatsapp"></i></button>
                        <Link href={`/admin/exams/edit?examId=${exam.id}`} className="text-indigo-500 hover:text-indigo-700" title="Edit"><i className="fa-solid fa-pen"></i></Link>
                        <button onClick={() => deleteExam(exam.id)} className="text-red-500 hover:text-red-700" title="Delete"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
