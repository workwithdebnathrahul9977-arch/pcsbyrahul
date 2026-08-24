'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminSliders() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');

  const fetchSliders = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/sliders`);
      setSliders(res.data);
    } catch (error) {
      toast.error('Failed to load sliders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAddSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select an image file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      // 1. Upload image
      const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.imageUrl;

      // 2. Create slider in DB
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/sliders`, {
        imageUrl,
        link
      });

      toast.success('Slider added successfully!');
      setShowAddForm(false);
      setFile(null);
      setLink('');
      fetchSliders();
    } catch (error) {
      toast.error('Failed to add slider');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/sliders/${id}`);
      toast.success('Slider deleted');
      fetchSliders();
    } catch (error) {
      toast.error('Failed to delete slider');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Sliders</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded font-bold hover:bg-blue-700 transition"
        >
          {showAddForm ? 'Cancel' : '+ Add New'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddSlider} className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-xl">
          <h2 className="text-xl font-bold mb-4">Add New Slider</h2>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Slider Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">Link (Optional)</label>
            <input 
              type="url" 
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Users will be redirected here when they click the slider.</p>
          </div>
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Save Slider'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sliders.map((s) => (
              <tr key={s.id}>
                <td className="px-6 py-4">
                  <img src={s.imageUrl} alt="Slider" className="h-20 w-32 object-cover rounded shadow" />
                </td>
                <td className="px-6 py-4">
                  {s.link ? (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {s.link}
                    </a>
                  ) : (
                    <span className="text-gray-400">No Link</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:text-red-900 font-bold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {sliders.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  No sliders found. Click "+ Add New" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
