'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function CreateNotification() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ total: 0, published: 0, draft: 0, seenRate: '0%' });
  
  // Filters for targeting
  const [targetType, setTargetType] = useState('ALL');
  const [targetId, setTargetId] = useState('');
  const [metaFilters, setMetaFilters] = useState({ classes: [], batches: [], groups: [] });

  // Form
  const [categoryId, setCategoryId] = useState('');
  const [type, setType] = useState('REGULAR');
  const [status, setStatus] = useState('PUBLISHED');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, statRes, metaRes] = await Promise.all([
        axios.get(`${API}/api/admin/notifications/categories`),
        axios.get(`${API}/api/admin/notifications`),
        axios.get(`${API}/api/students/meta/filters`)
      ]);
      setCategories(catRes.data);
      if(catRes.data.length > 0) {
        const firstCat = catRes.data[0];
        setCategoryId(firstCat.id);
        if (firstCat.defaultTemplate) setDescription(firstCat.defaultTemplate);
      }
      if(statRes.data.stats) setStats(statRes.data.stats);
      setMetaFilters(metaRes.data);
    } catch (e) {
      toast.error('Failed to load initial data');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if(!categoryId) return toast.error('দয়া করে ক্যাটাগরি সিলেক্ট করুন');
    if(!title || !description) return toast.error('টাইটেল এবং বিবরণ আবশ্যক');
    if(targetType !== 'ALL' && !targetId) return toast.error('দয়া করে টার্গেট সিলেক্ট করুন');

    setSaving(true);
    try {
      await axios.post(`${API}/api/admin/notifications`, {
        categoryId, type, status, title, description, targetType, targetId: targetType === 'ALL' ? null : targetId
      });
      toast.success(status === 'PUBLISHED' ? 'নোটিশ পাবলিশ ও মেসেজ পাঠানো শুরু হয়েছে' : 'নোটিশ ড্রাফট হিসেবে সেভ হয়েছে');
      router.push('/admin/notifications/list');
    } catch(e) {
      toast.error('Error creating notification');
    } finally {
      setSaving(false);
    }
  };

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
        <button className="px-5 py-2.5 bg-[#4b49ac] text-white rounded-lg text-sm font-bold shadow-md flex items-center gap-2 transition-all">
          <i className="fa-solid fa-plus"></i> নতুন নোটিশ
        </button>
        <Link href="/admin/notifications/list" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-list-ul"></i> নোটিশ তালিকা
        </Link>
        <Link href="/admin/notifications/categories" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-all">
          <i className="fa-solid fa-tags"></i> ক্যাটাগরি
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <i className="fa-solid fa-plus-circle text-[#4b49ac]"></i> নতুন নোটিশ তৈরি করো
          </h3>
          <p className="text-xs text-gray-500 mt-1">প্রথমে নোটিশ কোন ইউজার বা গ্রুপ দেখতে পাবে তা নির্বাচন করো, তারপর টাইটেল ও বিবরণ লিখে পাবলিশ করো।</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          
          {/* Target Selection */}
          <div className="mb-6 p-4 rounded-lg border border-purple-100 bg-purple-50/30">
            <label className="block text-xs font-bold text-gray-600 mb-3"><i className="fa-solid fa-users text-purple-500"></i> ইউজার সিলেক্ট করুন <span className="text-red-500">*</span></label>
            <div className="flex flex-col md:flex-row gap-4">
              <select value={targetType} onChange={(e) => { setTargetType(e.target.value); setTargetId(''); }} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none">
                <option value="ALL">সকল ইউজার (All Students)</option>
                <option value="CLASS">নির্দিষ্ট ক্লাস (By Class)</option>
                <option value="BATCH">নির্দিষ্ট ব্যাচ (By Batch)</option>
                <option value="GROUP">নির্দিষ্ট গ্রুপ (By Group)</option>
              </select>
              
              {targetType === 'CLASS' && (
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none" required>
                  <option value="">ক্লাস সিলেক্ট করুন</option>
                  {metaFilters.classes.map((c: any) => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              {targetType === 'BATCH' && (
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none" required>
                  <option value="">ব্যাচ সিলেক্ট করুন</option>
                  {metaFilters.batches.map((b: any) => <option key={b} value={b}>{b}</option>)}
                </select>
              )}
              {targetType === 'GROUP' && (
                <select value={targetId} onChange={(e) => setTargetId(e.target.value)} className="flex-1 border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none" required>
                  <option value="">গ্রুপ সিলেক্ট করুন</option>
                  {metaFilters.groups.map((g: any) => <option key={g} value={g}>{g}</option>)}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="p-4 rounded-lg border border-orange-100 bg-orange-50/30">
              <label className="block text-xs font-bold text-gray-600 mb-2"><i className="fa-solid fa-tag text-orange-500"></i> নোটিশের ধরন (Category) <span className="text-red-500">*</span></label>
              <select value={categoryId} onChange={(e) => {
                const newId = e.target.value;
                setCategoryId(newId);
                const cat = categories.find((c: any) => c.id === newId);
                if (cat && cat.defaultTemplate) {
                  setDescription(cat.defaultTemplate);
                }
              }} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none" required>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.bnName}</option>
                ))}
              </select>
            </div>
            <div className="p-4 rounded-lg border border-green-100 bg-green-50/30">
              <label className="block text-xs font-bold text-gray-600 mb-2"><i className="fa-solid fa-bolt text-green-500"></i> টাইপ / গুরুত্ব <span className="text-red-500">*</span></label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none">
                <option value="REGULAR">নিয়মিত (Regular)</option>
                <option value="IMPORTANT">জরুরী (Important)</option>
              </select>
            </div>
            <div className="p-4 rounded-lg border border-teal-100 bg-teal-50/30">
              <label className="block text-xs font-bold text-gray-600 mb-2"><i className="fa-solid fa-eye text-teal-500"></i> স্ট্যাটাস <span className="text-red-500">*</span></label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none">
                <option value="PUBLISHED">পাবলিশড (সাথে সাথে মেসেজ যাবে)</option>
                <option value="DRAFT">ড্রাফট (পরে পাঠানো হবে)</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-blue-100 bg-blue-50/30 mb-6">
            <label className="block text-xs font-bold text-gray-600 mb-2"><i className="fa-solid fa-heading text-blue-500"></i> টাইটেল <span className="text-red-500">*</span></label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="যেমন: ছুটির নোটিশ" className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none" required />
          </div>

          <div className="p-4 rounded-lg border border-indigo-100 bg-indigo-50/30 mb-6">
            <label className="block text-xs font-bold text-gray-600 mb-2"><i className="fa-solid fa-align-left text-indigo-500"></i> বিবরণ <span className="text-red-500">*</span></label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="নোটিশের সম্পূর্ণ বিবরণ লেখা..." rows={6} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:outline-none resize-none" required></textarea>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="px-8 py-3 bg-[#4b49ac] hover:bg-[#3f3e91] text-white rounded-lg text-sm font-bold shadow-md transition-colors disabled:opacity-50 flex items-center gap-2">
              {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
              {saving ? 'প্রসেসিং হচ্ছে...' : status === 'PUBLISHED' ? 'পাবলিশ ও সেন্ড করুন' : 'সংরক্ষণ করুন'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
