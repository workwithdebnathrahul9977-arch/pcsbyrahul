'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function NoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '' });

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await axios.get(`${API}/api/notices`);
      setNotices(data);
    } catch { toast.error('Failed to load notices'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/notices`, formData);
      toast.success('Notice published');
      setShowModal(false);
      setFormData({ title: '', content: '' });
      fetchNotices();
    } catch { toast.error('Failed to publish'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this notice?')) return;
    try {
      await axios.delete(`${API}/api/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Notice Board</h1>
          <p className="text-gray-500 text-sm mt-1">Manage public notices</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Create Notice
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-xl"></i></div>
        ) : notices.length === 0 ? (
           <div className="p-12 text-center text-gray-400">No notices found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {notices.map(n => (
                <tr key={n.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{n.title}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(n.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><i className="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Create Notice</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Notice Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Content / Description</label>
                <textarea rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition">Publish</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
