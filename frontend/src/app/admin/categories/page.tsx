'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`);
      setCategories(res.data);
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !imageFile) return toast.error('Both name and image are required');

    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.imageUrl;

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/categories`, {
        name, imageUrl
      });
      
      toast.success('Category added successfully');
      setName('');
      setImageFile(null);
      fetchCategories();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to add category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? (Note: Ensure no courses are using this category name)')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/categories/${id}`);
      toast.success('Deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Categories</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8 max-w-xl">
        <h2 className="text-xl font-bold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category Name (e.g. SSC, HSC)</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full border p-2 rounded focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">Category Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => {
                if (e.target.files) setImageFile(e.target.files[0]);
              }}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={saving}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition"
          >
            {saving ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-4">All Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 relative group overflow-hidden">
            <button 
              onClick={() => handleDelete(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow"
            >
              <i className="fa-solid fa-trash"></i>
            </button>
            <div className="h-32 bg-gray-100 -mx-4 -mt-4 mb-4 relative overflow-hidden">
              {item.imageUrl && (
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-black/40"></div>
              <h3 className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white shadow-sm">
                {item.name}
              </h3>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 col-span-full">No categories added yet.</p>
        )}
      </div>
    </div>
  );
}
