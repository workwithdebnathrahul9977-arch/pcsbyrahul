'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SuccessStoriesAdminPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', imageUrl: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data } = await axios.get(`${API}/api/success-stories`);
      setStories(data);
    } catch { toast.error('Failed to load success stories'); }
    finally { setLoading(false); }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large (Max 5MB)');
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/success-stories`, formData);
      toast.success('Story published');
      setShowModal(false);
      setFormData({ title: '', content: '', imageUrl: '' });
      fetchStories();
    } catch { toast.error('Failed to publish'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this story?')) return;
    try {
      await axios.delete(`${API}/api/success-stories/${id}`);
      toast.success('Story deleted');
      fetchStories();
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Success Stories (Kriti Sikkarti)</h1>
          <p className="text-gray-500 text-sm mt-1">Manage outstanding student stories</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add Story
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {loading ? (
           <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-xl"></i></div>
        ) : stories.length === 0 ? (
           <div className="p-12 text-center text-gray-400">No stories found.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4 font-bold">Image</th>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Content</th>
                <th className="px-6 py-4 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stories.map(s => (
                <tr key={s.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    {s.imageUrl ? <img src={s.imageUrl} className="w-12 h-12 rounded object-cover" /> : <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400"><i className="fa-solid fa-image"></i></div>}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">{s.title}</td>
                  <td className="px-6 py-4 text-gray-500 line-clamp-2">{s.content}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><i className="fa-solid fa-trash"></i></button>
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
              <h3 className="font-bold text-lg">Add Success Story</h3>
              <button onClick={() => {setShowModal(false); setFormData({title:'', content:'', imageUrl:''})}} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Student Name / Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Story Content / Description *</label>
                <textarea required rows={4} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Photo</label>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition font-medium">
                    {uploading ? 'Uploading...' : 'Choose Image'}
                  </button>
                  {formData.imageUrl && <img src={formData.imageUrl} className="w-10 h-10 object-cover rounded shadow-sm" />}
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={uploading} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg transition disabled:opacity-50">Save Story</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
