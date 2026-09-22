'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransactionTrashPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('CANCELED'); // Default filter

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      // Assuming 'CANCELED' is the status for canceled transactions
      const res = await axios.get(`${API}/api/payments?status=${filter}`);
      setPayments(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/payments?status=${filter}&search=${search}`);
      setPayments(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const reactivatePayment = async (id: string) => {
    if (!confirm('Are you sure you want to reactivate this payment?')) return;
    try {
      await axios.put(`${API}/api/payments/${id}`, { status: 'PAID' });
      fetchPayments();
      alert('Payment reactivated');
    } catch (e) {
      console.error(e);
      alert('Failed to reactivate payment');
    }
  };

  const permanentDelete = async (id: string) => {
    if (!confirm('Warning: This action cannot be undone. Are you sure?')) return;
    try {
      await axios.delete(`${API}/api/payments/${id}`);
      fetchPayments();
      alert('Payment permanently deleted');
    } catch (e) {
      console.error(e);
      alert('Failed to delete payment');
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans">
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
        
        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-100 pb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Canceled Transactions</h1>
            <p className="text-slate-500 text-sm mt-1">Showing {payments.length} records</p>
          </div>
          
          <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200 overflow-x-auto whitespace-nowrap">
            <button onClick={() => setFilter('FAILED')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'FAILED' ? 'bg-slate-700 text-white font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Failed</button>
            <button onClick={() => setFilter('CANCELED')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'CANCELED' ? 'bg-slate-700 text-white font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Canceled</button>
            <button onClick={() => setFilter('REFUNDED')} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'REFUNDED' ? 'bg-slate-700 text-white font-bold shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>Refunded</button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 mb-6">
          <input 
            type="text" 
            placeholder="Student ID, Transaction ID, press Enter..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full md:w-[350px] border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-slate-500 outline-none" 
          />
          <button onClick={handleSearch} className="w-10 h-10 bg-slate-900 hover:bg-black text-white rounded-lg flex items-center justify-center shadow-md transition-all">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">#</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">TRANSACTION ID</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">STUDENT</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">STUDENT ID</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">BATCH</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">AMOUNT</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">METHOD</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">DATE</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase">STATUS</th>
                <th className="px-4 py-4 text-[10px] font-black text-slate-500 uppercase text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500">Loading...</td></tr>
              ) : payments.length === 0 ? (
                <tr><td colSpan={10} className="px-4 py-8 text-center text-slate-500">No records found.</td></tr>
              ) : (
                payments.map((p, i) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 text-xs text-slate-500">{i + 1}</td>
                    <td className="px-4 py-4 text-xs font-bold text-slate-800">{p.id.split('-')[0].toUpperCase()}</td>
                    <td className="px-4 py-4 text-xs font-bold text-slate-800">{p.user?.name || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{p.user?.studentId || p.userId || '—'}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{p.enrollment?.batch?.name || '—'}</td>
                    <td className="px-4 py-4 text-xs font-bold text-slate-800 flex items-center gap-1"><span className="text-slate-400 font-normal">৳</span> {p.amount}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{p.method || 'CASH'}</td>
                    <td className="px-4 py-4 text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4">
                      <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-full text-[10px] font-bold flex items-center gap-1.5 w-max shadow-sm uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => reactivatePayment(p.id)} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 rounded text-xs font-bold transition-colors">
                          Reactivate
                        </button>
                        <button onClick={() => permanentDelete(p.id)} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded text-xs font-bold transition-colors">
                          Permanent Delete
                        </button>
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
