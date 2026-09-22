'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function Avatar({ src, name }: { src?: string; name: string }) {
  if (src) return <img src={src} alt={name} className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0" />;
  return (
    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
      {name?.[0]?.toUpperCase() || '?'}
    </div>
  );
}

const StatusBadge = ({ active }: { active: boolean }) =>
  active
    ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Active</span>
    : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-500 text-white shadow-sm whitespace-nowrap"><span className="w-1.5 h-1.5 rounded-full bg-white"></span>Inactive</span>;

export default function StudentsListPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchBy, setSearchBy] = useState('name');
  const [searchKeyword, setSearchKeyword] = useState('');
  
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchKeyword) {
        if (searchBy === 'name' || searchBy === 'id') {
          // both name and Reg.ID go through the general search param
          params.set('search', searchKeyword);
        } else if (searchBy === 'class') params.set('studentClass', searchKeyword);
        else if (searchBy === 'batch') params.set('batch', searchKeyword);
        else if (searchBy === 'group') params.set('group', searchKeyword);
        else if (searchBy === 'institute') params.set('search', searchKeyword);
        else params.set('search', searchKeyword);
      }
      const { data } = await axios.get(`${API}/api/students?${params.toString()}`);
      setStudents(data);
      
          inactive: data.filter((s: any) => !s.isActive).length,
      setStats({
        total: data.length,
        active: data.filter((s: any) => s.isActive).length,
        inactive: data.filter((s: any) => !s.isActive).length,
      });
    } catch { 
      toast.error('Failed to load students'); 
    } finally { 
      setLoading(false); 
    }
  }, [searchKeyword, searchBy]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to completely delete this student? This action cannot be undone and will delete all their records.')) return;
    try {
      await axios.delete(`${API}/api/students/${id}`);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (e: any) {
      toast.error('Failed to delete student');
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return (
    <div className="max-w-[1600px] mx-auto font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage, search, and monitor student registrations & fee statuses.</p>
        </div>
        <Link href="/admin/students/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-md transition-all">
          <i className="fa-solid fa-plus-circle"></i> Register Student
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Card 1: Total */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between" style={{ borderBottom: '4px solid #e2e8f0' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center">
              <i className="fa-solid fa-user-graduate text-lg"></i>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Total</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{stats.total}</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Total Registered Students</p>
          </div>
        </div>

        {/* Card 2: Active */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between" style={{ borderBottom: '4px solid #10b981' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-lg"></i>
            </div>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{stats.active}</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Active Students</p>
          </div>
        </div>

        {/* Card 3: Inactive */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between" style={{ borderBottom: '4px solid #ef4444' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <i className="fa-solid fa-ban text-lg"></i>
            </div>
            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Inactive</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">{stats.inactive}</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Inactive Students</p>
          </div>
        </div>

        {/* Card 4: Fee Pending */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 relative overflow-hidden flex flex-col justify-between" style={{ borderBottom: '4px solid #f59e0b' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-credit-card text-lg"></i>
            </div>
            <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">Due</span>
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-900">0</h3>
            <p className="text-slate-500 text-xs font-medium mt-1">Fee Pending</p>
          </div>
        </div>

      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-indigo-600 rounded-full"></div>
            <h3 className="text-sm font-bold text-slate-500 tracking-wider">SEARCH & FILTERS</h3>
          </div>
          <button onClick={() => { setSearchKeyword(''); setSearchBy('name'); }} className="text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1">
            <i className="fa-solid fa-xmark"></i> Clear All
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-4">
          <span className="text-xs font-bold text-slate-400 mr-2">SEARCH BY:</span>
          {['name', 'id', 'class', 'group', 'batch', 'institute'].map((opt) => (
            <label key={opt} className="flex items-center gap-1.5 cursor-pointer">
              <input 
                type="radio" 
                name="searchBy" 
                checked={searchBy === opt} 
                onChange={() => setSearchBy(opt)}
                className="w-3.5 h-3.5 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 capitalize">{opt === 'name' ? 'Student Name' : opt === 'id' ? 'Reg. ID' : opt}</span>
            </label>
          ))}
        </div>

        <div className="mb-4">
          <span className="text-xs font-bold text-slate-400 block mb-2">SEARCH KEYWORD</span>
          <div className="flex gap-3">
            <input 
              type="text" 
              placeholder="Name, Reg. ID, phone, batch, institute..." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStudents()}
              className="flex-1 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button onClick={fetchStudents} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
              <i className="fa-solid fa-search"></i> Search
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-slate-800">Student Directory</h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">{students.length} students</span>
          </div>
          <button className="px-3 py-1.5 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <i className="fa-solid fa-columns"></i> Columns
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">#</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Profile</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Reg. ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Institute</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Batch</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Group</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Guardian Ph.</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Session</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Adm. Date</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-10 h-10 bg-slate-100 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="w-32 h-4 bg-slate-100 rounded mb-2"></div><div className="w-20 h-3 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-20 h-6 bg-slate-100 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="w-32 h-4 bg-slate-100 rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-24 h-6 bg-slate-100 rounded-full"></div></td>
                    <td colSpan={7} className="px-6 py-4"></td>
                  </tr>
                ))
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={13} className="px-6 py-12 text-center text-slate-500">
                    <i className="fa-solid fa-folder-open text-4xl text-slate-300 mb-3 block"></i>
                    No students found.
                  </td>
                </tr>
              ) : students.map((s, i) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-xs text-slate-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4">
                    <Avatar src={s.photoUrl} name={s.name} />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900 text-sm">{s.name}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Session 2024-25</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-bold tracking-wide shadow-sm">{s.registrationNo || s.studentId || '—'}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600 max-w-[150px] truncate" title={s.schoolName}>{s.schoolName || '-'}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-teal-600 text-white rounded-full text-xs font-bold shadow-sm">{s.selectedBatch || '-'}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-600">{s.studentClass || '-'}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">{s.group || '-'}</td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-600">{s.guardianMobile || s.fatherMobile || '-'}</td>
                  <td className="px-6 py-4 text-xs text-slate-600">-</td>
                  <td className="px-6 py-4 text-xs text-slate-600">
                    {new Date(s.createdAt).toISOString().split('T')[0]}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge active={s.isActive} />
                  </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/admin/students/${s.id}`} className="w-8 h-8 inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 rounded-lg shadow-sm transition-all" title="View Profile">
                            <i className="fa-solid fa-eye text-xs"></i>
                          </Link>
                          <Link href={`/admin/students/${s.id}/edit`} className="w-8 h-8 inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 rounded-lg shadow-sm transition-all" title="Edit Student">
                            <i className="fa-solid fa-pen-to-square text-xs"></i>
                          </Link>
                          <button onClick={() => handleDelete(s.id)} className="w-8 h-8 inline-flex items-center justify-center bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 rounded-lg shadow-sm transition-all" title="Delete Student">
                            <i className="fa-solid fa-trash text-xs"></i>
                          </button>
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
