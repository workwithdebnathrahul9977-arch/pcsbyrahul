'use client';
import { useState, useEffect } from 'react';

export default function PaymentReportsPage() {
  const [meta, setMeta] = useState({ classes: [] as string[], batches: [] as string[] });

  useEffect(() => {
    import('axios').then((axios) => {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      Promise.all([
        axios.default.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
        axios.default.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
      ]).then(([c, b]) => {
        setMeta({ classes: c.data.map((x: any) => x.name), batches: b.data.map((x: any) => x.name) });
      });
    });
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto font-sans">
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
          <i className="fa-solid fa-money-bill-trend-up text-xl"></i>
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Payment Reports</h1>
          <p className="text-slate-500 text-sm mt-0.5">Generate and download detailed fee collection reports.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
          <i className="fa-solid fa-filter text-slate-400"></i>
          <h2 className="font-bold text-slate-700 text-sm">Report Filters</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Class</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
              <option value="">All Classes</option>
              {meta.classes.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Batch</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
              <option value="">All Batches</option>
              {meta.batches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5">Date Range</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
              <option>This Month</option>
              <option>Last Month</option>
              <option>This Year</option>
              <option>Custom Date</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
              <i className="fa-solid fa-bolt"></i> Generate
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
        <i className="fa-solid fa-file-invoice-dollar text-6xl text-slate-200 mb-4"></i>
        <h3 className="text-lg font-bold text-slate-700">No Report Generated</h3>
        <p className="text-slate-500 text-sm max-w-sm mt-1">Select your filters above and click generate to view the payment report.</p>
      </div>
    </div>
  );
}
