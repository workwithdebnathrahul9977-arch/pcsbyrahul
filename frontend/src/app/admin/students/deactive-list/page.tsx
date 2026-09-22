'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function DeactiveListPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalDeactive: 0, totalActivation: 0, totalDue: 0 });
  const [meta, setMeta] = useState({ classes: [] as string[], batches: [] as string[] });

  useEffect(() => {
    // Fetch students
    const fetchDeactive = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/api/students?status=inactive`);
        setStudents(data);
        setStats({ totalDeactive: data.length, totalActivation: 0, totalDue: 0 });
      } catch (err) {
        toast.error('Failed to load deactivated students');
      } finally {
        setLoading(false);
      }
    };
    fetchDeactive();

    // Fetch filters meta
    Promise.all([
      axios.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
    ]).then(([c, b]) => {
      setMeta({
        classes: c.data.map((x: any) => x.name),
        batches: b.data.map((x: any) => x.name)
      });
    });
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto font-sans space-y-6">
      
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-pink-200 relative overflow-hidden flex items-center justify-between" style={{ border: '1px solid #fbcfe8' }}>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">TOTAL DEACTIVE (সর্বমোট)</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalDeactive}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-pink-50 text-pink-500 flex items-center justify-center">
            <i className="fa-solid fa-user-xmark text-xl"></i>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-200 relative overflow-hidden flex items-center justify-between" style={{ border: '1px solid #fde68a' }}>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">TOTAL ACTIVATION (এই মাসে)</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalActivation}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <i className="fa-regular fa-calendar-check text-xl"></i>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200 relative overflow-hidden flex items-center justify-between" style={{ border: '1px solid #a7f3d0' }}>
          <div>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider mb-1">TOTAL DEACTIVE DUE (মোট বকেয়া)</p>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalDue.toLocaleString()} ৳</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <i className="fa-solid fa-sack-dollar text-xl"></i>
          </div>
        </div>

      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-[#1e293b] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <i className="fa-solid fa-filter"></i>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Search & Filter</h3>
              <p className="text-slate-400 text-xs mt-0.5">Filter deactivated students by name, class, batch, reason or date range</p>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-2">
            <i className="fa-solid fa-chevron-up"></i> Hide Filters
          </button>
        </div>
        
        {/* Filter Body */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-search text-indigo-400"></i> SEARCH</label>
              <input type="text" placeholder="Name / Reg ID / Mobile" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-layer-group text-purple-400"></i> CLASS</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 bg-white">
                <option value="">All Classes</option>
                {meta.classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-users text-blue-400"></i> BATCH</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 bg-white">
                <option value="">All Batches</option>
                {meta.batches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-circle-exclamation text-red-400"></i> DEACTIVATION REASON</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600 bg-white">
                <option>All Reasons</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-regular fa-calendar text-slate-400"></i> FROM DATE</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-regular fa-calendar text-slate-400"></i> TO DATE</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
              <i className="fa-solid fa-search"></i> Search
            </button>
            <button className="bg-amber-50 hover:bg-amber-100 text-amber-600 border border-amber-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <i className="fa-solid fa-file-pdf"></i> Download PDF
            </button>
            <button className="bg-white hover:bg-slate-50 text-slate-500 border border-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <i className="fa-solid fa-rotate-right"></i> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
              <i className="fa-solid fa-user-slash"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Deactivated Student List</h2>
              <p className="text-xs text-slate-500 mt-0.5">Showing 1-{students.length} of {students.length} students</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg text-xs font-bold flex items-center gap-2">
              <i className="fa-solid fa-thumbtack text-amber-500"></i>
              নোট: এখানে দেখানো বকেয়া একজন শিক্ষার্থীর সামগ্রিক বকেয়া — কোনো নির্দিষ্ট ব্যাচের নয়।
            </div>
            <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-columns"></i> Show / Hide Columns
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-center">#</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-center">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-gray-400 bg-transparent" />
                </th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">PHOTO</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">STUDENT</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">REG. ID</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">INSTITUTE</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">BATCH</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">CLASS</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">ADMISSION TYPE</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">PHONE</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-center">মোট বকেয়া<br/><span className="text-slate-400 font-normal">Total Due</span></th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">REASON</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">REMARKS</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider">DEACTIVATED ON</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-center">STATUS</th>
                <th className="px-4 py-3.5 text-[10px] font-black uppercase tracking-wider text-right pr-6">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={16} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={16} className="px-6 py-12 text-center text-slate-500">
                    <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-3 block"></i>
                    No deactivated students found.
                  </td>
                </tr>
              ) : students.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-4 py-4 text-xs text-slate-400 text-center">{i + 1}</td>
                  <td className="px-4 py-4 text-center">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                  </td>
                  <td className="px-4 py-4">
                    {s.photoUrl ? <img src={s.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover" /> : <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-xs font-bold">{s.name?.[0]}</div>}
                  </td>
                  <td className="px-4 py-4 font-bold text-slate-800 text-xs">{s.name}</td>
                  <td className="px-4 py-4">
                    <span className="px-2.5 py-1 bg-indigo-600 text-white rounded text-[11px] font-bold tracking-wide shadow-sm">{s.registrationNo || s.studentId || `202${i}88`}</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500 max-w-[120px] truncate" title={s.schoolName}>{s.schoolName || '-'}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{s.selectedBatch || '-'}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{s.studentClass || '-'}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">Monthly</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{s.phone || '-'}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2.5 py-1 bg-pink-100 text-pink-700 border border-pink-200 rounded text-[11px] font-bold">0 ৳</span>
                  </td>
                  <td className="px-4 py-4 text-xs text-slate-500">{s.deactivationReason || '-'}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">-</td>
                  <td className="px-4 py-4 text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-2">
                    <i className="fa-regular fa-calendar-days text-indigo-400"></i>
                    {s.deactivatedAt ? new Date(s.deactivatedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-bold shadow-sm">Deactive</span>
                  </td>
                  <td className="px-4 py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                        <i className="fa-solid fa-power-off"></i> অ্যাক্টিভ করুন
                      </button>
                      <Link href={`/admin/students/${s.id}`} className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-info"></i> Details
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
