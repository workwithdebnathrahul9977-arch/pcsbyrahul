'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import 'react-quill-new/dist/quill.snow.css';

export default function AdminNotices() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('ALL');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/notices`);
      setNotices(res.data);
    } catch (error) {
      toast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return toast.error('Title and content are required');

    setSaving(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/notices`, { title, content, target });
      toast.success('Notice published successfully!');
      setTitle('');
      setContent('');
      setTarget('ALL');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to publish notice');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/notices/${id}`);
      toast.success('Notice deleted');
      fetchNotices();
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notice Board Management</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-4xl">
        <h2 className="text-xl font-bold mb-4">Publish New Notice</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Notice Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500"
              placeholder="e.g. আগামীকাল ক্লাস বন্ধ থাকবে"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Notice Details (Formatting Supported)</label>
            <div className="bg-white">
              <ReactQuill 
                theme="snow" 
                value={content} 
                onChange={setContent} 
                className="h-64 mb-12"
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Target Audience</label>
            <select 
              value={target} 
              onChange={e => setTarget(e.target.value)} 
              className="w-full border p-2 rounded"
            >
              <option value="ALL">Everyone (Public & Students)</option>
              <option value="STUDENTS">Enrolled Students Only</option>
            </select>
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition"
          >
            {saving ? 'Publishing...' : 'Publish Notice'}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">Past Notices</h2>
      <div className="grid gap-4 max-w-3xl">
        {notices.map(notice => (
          <div key={notice.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-gray-900">{notice.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${notice.target === 'ALL' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {notice.target}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-2">{notice.content}</p>
              <p className="text-xs text-gray-400">{new Date(notice.createdAt).toLocaleString()}</p>
            </div>
            <button 
              onClick={() => handleDelete(notice.id)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </div>
        ))}
        {notices.length === 0 && (
          <p className="text-gray-500 italic">No notices found.</p>
        )}
      </div>
    </div>
  );
}
