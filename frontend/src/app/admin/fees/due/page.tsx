'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function DueListPage() {
  const [meta, setMeta] = useState({ classes: [] as string[], batches: [] as string[] });
  const [dues, setDues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [classFilter, setClassFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [feeTypes, setFeeTypes] = useState({ admission: false, tuition: true, course: false });

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    Promise.all([
      axios.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
    ]).then(([c, b]) => {
      setMeta({ 
        classes: c.data.map((x: any) => x.name), 
        batches: b.data.map((x: any) => x.name) 
      });
    });
    
    fetchDues();
  }, []);

  const fetchDues = async () => {
    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API}/api/payments?status=PENDING`);
      setDues(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Process Dues based on filters
  let filteredDues = dues.filter(d => {
    if (classFilter && d.enrollment?.batch?.academicClass?.name !== classFilter && d.user?.studentClass !== classFilter) return false;
    if (batchFilter && d.enrollment?.batch?.name !== batchFilter && d.user?.selectedBatch !== batchFilter) return false;
    return true;
  });

  // Categorize
  const tuitionDues = filteredDues.filter(d => !d.note?.toLowerCase().includes('admission') && !d.note?.toLowerCase().includes('course') && !d.note?.toLowerCase().includes('extra'));
  const admissionDues = filteredDues.filter(d => d.note?.toLowerCase().includes('admission'));
  const courseDues = filteredDues.filter(d => d.note?.toLowerCase().includes('course'));
  
  const totalAmount = filteredDues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const tuitionAmount = tuitionDues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const admissionAmount = admissionDues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const courseAmount = courseDues.reduce((sum, d) => sum + (d.amount || 0), 0);
  const extraAmount = filteredDues.filter(d => d.note?.toLowerCase().includes('extra')).reduce((sum, d) => sum + (d.amount || 0), 0);

  return (
    <div className="max-w-[1600px] mx-auto font-sans space-y-6">
      
      {/* Header */}
      <div className="bg-[#2563eb] rounded-xl p-6 text-white shadow-md flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold">স্মার্ট বকেয়া ব্যবস্থাপনা</h1>
          <p className="text-blue-100 text-xs mt-1">ব্যাচ ও শ্রেণিভিত্তিক শিক্ষার্থীদের ফি বকেয়া পর্যবেক্ষণ, অনুসন্ধান এবং ব্যবস্থাপনা করুন।</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 border-t-4 border-t-red-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><i className="fa-solid fa-calculator text-red-400"></i> TOTAL DUE AMOUNT</p>
          <h3 className="text-2xl font-black text-slate-800">{totalAmount} <span className="text-sm text-red-500">TK</span></h3>
          <p className="text-[10px] text-slate-400 mt-1">Total pending amount</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 border-t-4 border-t-sky-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><i className="fa-solid fa-user-plus text-sky-400"></i> ADMISSION DUE</p>
          <h3 className="text-2xl font-black text-slate-800">{admissionAmount} <span className="text-sm text-sky-500">TK</span></h3>
          <p className="text-[10px] text-slate-400 mt-1">Admission fee due</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 border-t-4 border-t-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><i className="fa-solid fa-book-open text-emerald-400"></i> TUITION DUE</p>
          <h3 className="text-2xl font-black text-slate-800">{tuitionAmount} <span className="text-sm text-emerald-500">TK</span></h3>
          <p className="text-[10px] text-slate-400 mt-1">Tuition fee due</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 border-t-4 border-t-amber-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><i className="fa-solid fa-layer-group text-amber-400"></i> COURSE DUE</p>
          <h3 className="text-2xl font-black text-slate-800">{courseAmount} <span className="text-sm text-amber-500">TK</span></h3>
          <p className="text-[10px] text-slate-400 mt-1">Course fee due</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 border-t-4 border-t-purple-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1.5"><i className="fa-solid fa-plus text-purple-400"></i> EXTRA / PARTIAL DUE</p>
          <h3 className="text-2xl font-black text-slate-800">{extraAmount} <span className="text-sm text-purple-500">TK</span></h3>
          <p className="text-[10px] text-slate-400 mt-1">Extra fees due</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
          <i className="fa-solid fa-filter text-slate-400"></i>
          <h2 className="text-sm font-bold text-slate-800">Search & Filter Options</h2>
        </div>

        <div className="flex items-center gap-6 mb-6">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">INCLUDE FEE TYPES:</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={feeTypes.admission} onChange={e => setFeeTypes({...feeTypes, admission: e.target.checked})} className="text-blue-600 rounded" />
            <span className="text-sm text-slate-700">Admission</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={feeTypes.tuition} onChange={e => setFeeTypes({...feeTypes, tuition: e.target.checked})} className="text-blue-600 rounded" />
            <span className="text-sm text-slate-700">Tuition</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={feeTypes.course} onChange={e => setFeeTypes({...feeTypes, course: e.target.checked})} className="text-blue-600 rounded" />
            <span className="text-sm text-slate-700">Course</span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">CLASS</label>
            <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600">
              <option value="">All Classes / Select Class</option>
              {meta.classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">BATCH</label>
            <select value={batchFilter} onChange={e => setBatchFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600">
              <option value="">All Batches / Select Batch</option>
              {meta.batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">STUDENT STATUS</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600">
              <option>Active Students Only</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-1.5 uppercase">CALENDAR TYPE</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none text-slate-600">
              <option>All Dates / Select Calendar</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all">
            Show Due List
          </button>
          <button className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2">
            <i className="fa-solid fa-download"></i> Download Due List (PDF)
          </button>
          <button className="px-5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-2">
            <i className="fa-solid fa-table-columns"></i> Hide/Show Columns
          </button>
        </div>
      </div>

      {/* Due Lists */}
      
      {/* Admission Due */}
      {feeTypes.admission && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-sky-500 rounded-full"></div>
              <h2 className="text-sm font-bold text-slate-800">Admission Due List</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-sky-600">Filtered Due: {admissionAmount} TK</span>
              <button className="w-6 h-6 rounded bg-sky-100 text-sky-600 flex items-center justify-center"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
            </div>
          </div>
          <div className="p-8 text-center text-slate-400 text-sm">
            {admissionDues.length === 0 ? "No admission dues found based on current filters." : `Found ${admissionDues.length} dues.`}
          </div>
        </div>
      )}

      {/* Tuition Due */}
      {feeTypes.tuition && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="w-1 h-5 bg-emerald-500 rounded-full"></div>
              <h2 className="text-sm font-bold text-slate-800">Tuition Due List</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-emerald-600">Filtered Due: {tuitionAmount} TK</span>
              <button className="w-6 h-6 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center"><i className="fa-solid fa-chevron-up text-[10px]"></i></button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">#</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">STUDENT NAME</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">STUDENT ID</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">CLASS</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">BATCH</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">GUARDIAN CONTACT</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">STUDENT CONTACT</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">AMOUNT</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">MONTH/DUE</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">TYPE</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase">STATUS</th>
                  <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500"><i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading data...</td></tr>
                ) : tuitionDues.length === 0 ? (
                  <tr><td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500">No tuition dues found.</td></tr>
                ) : tuitionDues.map((due, idx) => (
                  <tr key={due.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-xs text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{due.user?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.user?.studentId || due.userId || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.user?.studentClass || due.enrollment?.batch?.academicClass?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.enrollment?.batch?.name || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.user?.fatherMobile || due.user?.motherMobile || '—'}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.user?.phone || '—'}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800">{due.amount}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{due.month || '—'}</td>
                    <td className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase">{due.note || 'TUITION FEE'}</td>
                    <td className="px-4 py-3">
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">{due.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors"><i className="fa-solid fa-paper-plane text-[10px]"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
