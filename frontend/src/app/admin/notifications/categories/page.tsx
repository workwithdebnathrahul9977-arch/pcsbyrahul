'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const COLORS = [
  'bg-green-500', 'bg-orange-500', 'bg-blue-500', 'bg-red-500', 
  'bg-purple-500', 'bg-indigo-500', 'bg-yellow-500', 'bg-teal-500', 
  'bg-pink-500', 'bg-gray-800'
];

export default function NotificationCategories() {
  const [categories, setCategories] = useState([]);
  const [bnName, setBnName] = useState('');
  const [enName, setEnName] = useState('');
  const [selectedColor, setSelectedColor] = useState('bg-blue-500');
  const [icon, setIcon] = useState('fa-solid fa-bell');
  const [defaultTemplate, setDefaultTemplate] = useState('');
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, seenRate: '0%' });

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/notifications/categories`);
      setCategories(data);
    } catch (e) {
      toast.error('Failed to load categories');
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/notifications`);
      if (data.stats) setStats(data.stats);
    } catch (e) {
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!bnName) return toast.error('Bengali name is required');
    try {
      await axios.post(`${API}/api/admin/notifications/categories`, {
        bnName, enName, color: selectedColor, icon, defaultTemplate
      });
      toast.success('Category added');
      setBnName(''); setEnName(''); setDefaultTemplate('');
      fetchCategories();
    } catch (e) {
      toast.error('Error adding category');
    }
  };

  const deleteCategory = async (id: string) => {
    if(!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${API}/api/admin/notifications/categories/${id}`);
      toast.success('Deleted');
      fetchCategories();
    } catch(e) {
      toast.error('Error deleting');
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto font-sans">
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

      <div className="flex gap-4 mb-8">
        <Link href="/admin/notifications/create" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-plus"></i> নতুন নোটিশ
        </Link>
        <Link href="/admin/notifications/list" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-list-ul"></i> নোটিশ তালিকা
        </Link>
        <button className="px-5 py-2.5 bg-[#4b49ac] text-white rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all">
          <i className="fa-solid fa-tags"></i> ক্যাটাগরি
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-sm font-bold text-gray-800 mb-6">নতুন ক্যাটাগরি যোগ করো</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">বাংলা নাম <span className="text-red-500">*</span></label>
              <input type="text" value={bnName} onChange={(e) => setBnName(e.target.value)} placeholder="যেমন: ভর্তি বিজ্ঞপ্তি" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">ইংরেজি নাম (Optional)</label>
              <input type="text" value={enName} onChange={(e) => setEnName(e.target.value)} placeholder="e.g. Admission Notice" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-600 mb-2">রঙ নির্বাচন করো</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map(c => (
                <div key={c} onClick={() => setSelectedColor(c)} className={`w-8 h-8 rounded-full cursor-pointer ${c} ${selectedColor === c ? 'ring-2 ring-offset-2 ring-[#4b49ac]' : ''}`}></div>
              ))}
            </div>
          </div>

          <div className="mb-6 max-w-sm">
            <label className="block text-xs font-bold text-gray-600 mb-2">আইকন ক্লাস (FontAwesome)</label>
            <input type="text" value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-600 mb-2">ডিফল্ট মেসেজ টেমপ্লেট (ঐচ্ছিক)</label>
            <textarea value={defaultTemplate} onChange={(e) => setDefaultTemplate(e.target.value)} placeholder="এই ক্যাটাগরি সিলেক্ট করলে যে মেসেজটি অটোমেটিক বসে যাবে..." rows={4} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none resize-none"></textarea>
          </div>

          <button type="submit" className="px-6 py-2.5 bg-[#4b49ac] text-white rounded-lg text-sm font-bold hover:bg-[#3f3e91] shadow-sm transition-colors">
            ক্যাটাগরি যোগ করো
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((cat: any) => (
          <div key={cat.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 relative overflow-hidden group">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white ${cat.color}`}>
              <i className={`${cat.icon} text-lg`}></i>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{cat.bnName}</h4>
              {cat.enName && <p className="text-xs text-gray-500">{cat.enName}</p>}
            </div>
            <button onClick={() => deleteCategory(cat.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
