'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, seenRate: '0%' });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PUBLISHED, DRAFT
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/notifications`);
      if (data.notifications) setNotifications(data.notifications);
      if (data.stats) setStats(data.stats);
    } catch (e) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id: string) => {
    if(!confirm('Are you sure you want to delete this notification?')) return;
    try {
      await axios.delete(`${API}/api/admin/notifications/${id}`);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (e) {
      toast.error('Error deleting notification');
    }
  };

  const filtered = notifications.filter((n: any) => {
    if (filter === 'PUBLISHED' && n.status !== 'PUBLISHED') return false;
    if (filter === 'DRAFT' && n.status !== 'DRAFT') return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto font-sans">
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#4a72d4] text-white p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-4"><i className="fa-regular fa-bell text-sm"></i></div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-xs font-medium text-white/80">মোট নোটিশ</div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="bg-[#36a267] text-white p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-4"><i className="fa-solid fa-check text-sm"></i></div>
            <div className="text-3xl font-bold mb-1">{stats.published}</div>
            <div className="text-xs font-medium text-white/80">পাবলিশড</div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="bg-[#e99021] text-white p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-4"><i className="fa-solid fa-pen text-sm"></i></div>
            <div className="text-3xl font-bold mb-1">{stats.draft}</div>
            <div className="text-xs font-medium text-white/80">ড্রাফট</div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="bg-[#8b5cf6] text-white p-6 rounded-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mb-4"><i className="fa-solid fa-eye text-sm"></i></div>
            <div className="text-3xl font-bold mb-1">{stats.seenRate}</div>
            <div className="text-xs font-medium text-white/80">গড় সিন রেট</div>
          </div>
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div className="flex gap-4 mb-8">
        <Link href="/admin/notifications/create" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-plus"></i> নতুন নোটিশ
        </Link>
        <button className="px-5 py-2.5 bg-[#4b49ac] text-white rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all">
          <i className="fa-solid fa-list-ul"></i> নোটিশ তালিকা
        </button>
        <Link href="/admin/notifications/categories" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-tags"></i> ক্যাটাগরি
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-[400px]">
          <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder="টাইটেল দিয়ে খুঁজুন..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac]"
          />
        </div>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'ALL' ? 'bg-[#1a1b3a] text-white' : 'text-gray-500 hover:text-gray-800'}`}>সব</button>
          <button onClick={() => setFilter('PUBLISHED')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'PUBLISHED' ? 'bg-[#1a1b3a] text-white' : 'text-gray-500 hover:text-gray-800'}`}>পাবলিশড</button>
          <button onClick={() => setFilter('DRAFT')} className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${filter === 'DRAFT' ? 'bg-[#1a1b3a] text-white' : 'text-gray-500 hover:text-gray-800'}`}>ড্রাফট</button>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center"><i className="fa-solid fa-spinner fa-spin text-[#4b49ac] text-2xl"></i></div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-gray-400">
          <i className="fa-solid fa-search text-4xl mb-4"></i>
          <p className="text-sm font-medium">কোনো নোটিশ পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n: any) => (
            <div key={n.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                {n.category && (
                  <div className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-white ${n.category.color}`}>
                    <i className={`${n.category.icon}`}></i>
                  </div>
                )}
                <div>
                  <h3 className="text-gray-800 font-bold mb-1">{n.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-1 max-w-2xl">{n.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[11px] font-bold text-gray-400">
                    <span><i className="fa-regular fa-clock"></i> {new Date(n.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-indigo-500"><i className="fa-solid fa-users"></i> Target: {n.targetType} {n.targetId ? `(${n.targetId})` : ''}</span>
                    <span>•</span>
                    <span className="text-green-500"><i className="fa-brands fa-whatsapp"></i> Sent: {n.sentCount}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${n.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                  {n.status}
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${n.type === 'IMPORTANT' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                  {n.type}
                </span>
                <button onClick={() => deleteNotification(n.id)} className="w-8 h-8 rounded bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center">
                  <i className="fa-solid fa-trash text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
