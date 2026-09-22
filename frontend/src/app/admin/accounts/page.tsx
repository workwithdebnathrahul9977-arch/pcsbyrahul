'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const ROLES = ['ADMIN', 'STAFF', 'TEACHER'] as const;
type Role = typeof ROLES[number];

const roleConfig: Record<Role, { label: string; color: string; bg: string; icon: string }> = {
  ADMIN:   { label: 'Admin',   color: 'text-red-700',    bg: 'bg-red-50 border-red-200',    icon: 'fa-shield-halved' },
  STAFF:   { label: 'Staff',   color: 'text-blue-700',   bg: 'bg-blue-50 border-blue-200',  icon: 'fa-user-tie' },
  TEACHER: { label: 'Teacher', color: 'text-violet-700', bg: 'bg-violet-50 border-violet-200', icon: 'fa-chalkboard-user' },
};

const emptyForm = { name: '', email: '', phone: '', role: 'STAFF' as Role, password: '' };

export default function AccountManagerPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showPassword, setShowPassword] = useState(false);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/accounts`);
      setAccounts(data);
    } catch {
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const openCreate = () => {
    setEditMode(false);
    setEditId('');
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (acc: any) => {
    setEditMode(true);
    setEditId(acc.id);
    setForm({ name: acc.name, email: acc.email, phone: acc.phone || '', role: acc.role, password: '' });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editMode) {
        await axios.put(`${API}/api/accounts/${editId}`, form);
        toast.success('Account updated!');
      } else {
        if (!form.password || form.password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setSaving(false);
          return;
        }
        await axios.post(`${API}/api/accounts`, form);
        toast.success('Account created!');
      }
      setShowModal(false);
      fetchAccounts();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" এর অ্যাকাউন্ট ডিলিট করতে চান?`)) return;
    try {
      await axios.delete(`${API}/api/accounts/${id}`);
      toast.success('Deleted!');
      fetchAccounts();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const filtered = accounts.filter(a => {
    const matchSearch = !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'ALL' || a.role === filterRole;
    return matchSearch && matchRole;
  });

  const counts = { ALL: accounts.length, ADMIN: 0, STAFF: 0, TEACHER: 0 };
  accounts.forEach(a => { if (counts[a.role as Role] !== undefined) counts[a.role as Role]++; });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Account Manager</h2>
          <p className="text-gray-500 text-sm">Manage admin, staff, and teacher accounts</p>
        </div>
        <button onClick={openCreate} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition shadow-sm">
          <i className="fa-solid fa-plus"></i> Add Account
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Role tabs */}
        <div className="flex gap-2 flex-wrap">
          {(['ALL', ...ROLES] as const).map(r => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all ${
                filterRole === r ? 'bg-red-600 text-white border-red-600' : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
              }`}
            >
              {r === 'ALL' ? 'All' : roleConfig[r as Role].label} ({counts[r as keyof typeof counts]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-bold">#</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Email</th>
              <th className="p-4 font-bold">Phone</th>
              <th className="p-4 font-bold">Role</th>
              <th className="p-4 font-bold">Created</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-400">
                  <i className="fa-solid fa-users text-3xl block mb-3"></i>
                  No accounts found.
                </td>
              </tr>
            ) : filtered.map((acc, i) => {
              const rc = roleConfig[acc.role as Role] || roleConfig.STAFF;
              return (
                <tr key={acc.id} className="border-b border-gray-50 hover:bg-red-50/20 transition">
                  <td className="p-4 text-gray-400">{i + 1}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                        {acc.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900">{acc.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{acc.email}</td>
                  <td className="p-4 text-gray-500">{acc.phone || '—'}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${rc.bg} ${rc.color}`}>
                      <i className={`fa-solid ${rc.icon} text-[10px]`}></i>
                      {rc.label}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(acc.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => openEdit(acc)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition mr-1">
                      <i className="fa-solid fa-pen text-sm"></i>
                    </button>
                    <button onClick={() => handleDelete(acc.id, acc.name)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                      <i className="fa-solid fa-trash text-sm"></i>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                {editMode ? 'Edit Account' : 'Create New Account'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Role Select */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Role</label>
                <div className="flex gap-2">
                  {ROLES.map(r => {
                    const rc = roleConfig[r];
                    const isSelected = form.role === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, role: r }))}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                          isSelected ? `${rc.bg} ${rc.color} border-current` : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}
                      >
                        <i className={`fa-solid ${rc.icon} text-xs`}></i>
                        {rc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Full Name</label>
                <input required type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Enter full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5"><span className="text-red-500 mr-1">*</span>Email Address</label>
                <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="example@email.com" disabled={editMode} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none disabled:bg-gray-50 disabled:text-gray-400" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Mobile Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="01XXXXXXXXX" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  {editMode ? 'New Password (leave blank to keep current)' : <><span className="text-red-500 mr-1">*</span>Password</>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!editMode}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder={editMode ? 'Leave blank to keep existing' : 'Min. 6 characters'}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 pr-10 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {saving ? <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</> : editMode ? 'Update Account' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
