'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SlidersPage() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ link: '', imageUrl: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const { data } = await axios.get(`${API}/api/sliders`);
      setSliders(data);
    } catch {
      toast.error('Failed to load sliders');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await axios.post(`${API}/api/upload`, fd);
      setFormData(prev => ({ ...prev, imageUrl: data.imageUrl }));
      toast.success('Image uploaded');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/api/sliders`, formData);
      toast.success('Slider added successfully');
      setShowModal(false);
      setFormData({ title: '', subtitle: '', imageUrl: '' });
      fetchSliders();
    } catch {
      toast.error('Failed to add slider');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      await axios.delete(`${API}/api/sliders/${id}`);
      toast.success('Slider deleted');
      fetchSliders();
    } catch {
      toast.error('Failed to delete slider');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Manage Sliders</h1>
          <p className="text-gray-500 text-sm mt-1">Website homepage slider images</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition flex items-center gap-2 shadow-md shadow-red-500/20">
          <i className="fa-solid fa-plus"></i> Add Slider
        </button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>
      ) : sliders.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center text-gray-400">
          <i className="fa-solid fa-images text-4xl mb-3 block text-gray-200"></i>
          No sliders found. Add one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sliders.map(s => (
            <div key={s.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="h-48 relative bg-gray-100">
                <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                <button onClick={() => handleDelete(s.id)} className="absolute top-2 right-2 bg-white/90 text-red-500 hover:text-red-700 w-8 h-8 rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 truncate">{s.link || 'No Link Added'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="font-bold text-lg">Add New Slider</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-red-500"><i className="fa-solid fa-xmark text-xl"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slider Image *</label>
                {formData.imageUrl ? (
                  <div className="relative h-40 rounded-xl overflow-hidden border border-gray-200">
                    <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full"><i className="fa-solid fa-xmark"></i></button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition">
                    <input type="file" onChange={handleFileUpload} accept="image/*" className="hidden" id="slider-upload" />
                    <label htmlFor="slider-upload" className="cursor-pointer">
                      {uploading ? <i className="fa-solid fa-spinner fa-spin text-red-500 text-2xl"></i> : <i className="fa-solid fa-cloud-arrow-up text-gray-400 text-3xl mb-2"></i>}
                      <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                    </label>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Slider Link (Optional)</label>
                <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="e.g. /courses or /admission" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={!formData.imageUrl} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-lg disabled:opacity-50 transition">Save Slider</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
