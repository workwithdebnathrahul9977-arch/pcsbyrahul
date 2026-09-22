'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeeHistoryPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [meta, setMeta] = useState({ classes: [] as string[], batches: [] as string[] });
  
  useEffect(() => {
    fetchPayments();
    
    // Fetch classes and batches for dropdowns
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
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API}/api/payments?search=${search}`);
      setPayments(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPayments();
  };

  const totalAmount = payments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

  return (
    <div className="max-w-[1600px] mx-auto font-sans space-y-6">
      
      {/* Header */}
      <div className="bg-[#6366f1] rounded-xl p-4 md:p-6 text-white shadow-md">
        <h1 className="text-xl font-bold mb-1">Student Fee History</h1>
        <p className="text-indigo-200 text-xs">View, search, and download student transaction and billing histories.</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">STUDENT ID / SEARCH</label>
            <input 
              type="text" 
              placeholder="e.g. STU12345, Name or Phone" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">SELECT CLASS</label>
            <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 bg-white">
              <option value="">All Classes</option>
              {meta.classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-500 mb-2 uppercase tracking-wide">SELECT BATCH</label>
            <select className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-slate-600 bg-white">
              <option value="">All Batches</option>
              {meta.batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        <div className="border border-slate-100 bg-slate-50 p-4 rounded-lg mb-6 flex items-center gap-6">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wide">ডেট ফিল্টার টাইপ (DATE FILTER TYPE)</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="filterType" defaultChecked className="text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm font-bold text-slate-800">মাস ভিত্তিক <span className="text-xs text-slate-500 font-normal">(Monthly Filter)</span></span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="filterType" className="text-indigo-600 focus:ring-indigo-500" />
            <span className="text-sm font-bold text-slate-800">কাস্টম তারিখ <span className="text-xs text-slate-500 font-normal">(Custom Date Range)</span></span>
          </label>
        </div>

        <div className="flex gap-3">
          <button onClick={handleSearch} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i className="fa-solid fa-search"></i> Search
          </button>
          <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i className="fa-solid fa-file-pdf"></i> Download PDF
          </button>
          <button onClick={() => { setSearch(''); fetchPayments(); }} className="px-6 py-2.5 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i className="fa-solid fa-rotate-right"></i> Reset
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold text-slate-800">Transaction Report</h2>
            <span className="text-indigo-500 text-xs font-bold">Total: {totalAmount} TK</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">#</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">STUDENT NAME</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">ID / PHONE</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">CLASS</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">BATCH</th>
                <th className="px-4 py-3 text-[10px] font-black text-indigo-500 uppercase">AMOUNT</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">METHOD</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">TRANSACTION/AC ID</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">MONTH</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">SUBMISSION DATE</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase">STATUS</th>
                <th className="px-4 py-3 text-[10px] font-black text-slate-500 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500"><i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading data...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={12} className="px-4 py-8 text-center text-sm text-slate-500">No payment history found.</td></tr>
              ) : (
                payments.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-xs text-slate-500">{idx + 1}</td>
                    <td className="px-4 py-4 text-xs font-bold text-blue-600">{p.user?.name || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{p.user?.phone || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">—</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{p.enrollment?.batch?.name || '—'}</td>
                    <td className="px-4 py-4 text-xs font-bold text-blue-600">{p.amount}</td>
                    <td className="px-4 py-4 text-xs text-slate-600 uppercase">{p.method || 'CASH'}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{p.transactionId || p.paymentNumber || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{p.month || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-600">{new Date(p.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-4">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${p.status === 'PAID' ? 'bg-emerald-100 text-emerald-600' : p.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-7 h-7 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-colors"><i className="fa-solid fa-print text-[10px]"></i></button>
                        <button className="w-7 h-7 rounded bg-purple-50 text-purple-600 flex items-center justify-center hover:bg-purple-100 transition-colors"><i className="fa-solid fa-eye text-[10px]"></i></button>
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
