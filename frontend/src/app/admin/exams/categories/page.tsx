'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function ExamCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/exams/categories`);
      setCategories(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingCategory) {
        await axios.put(`${API}/api/exams/categories/${editingCategory.id}`, { name, description });
      } else {
        await axios.post(`${API}/api/exams/categories`, { name, description });
      }
      closeModal();
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert('Failed to save category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await axios.delete(`${API}/api/exams/categories/${id}`);
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert('Failed to delete category');
    }
  };

  const openModal = (category: any = null) => {
    setEditingCategory(category);
    setName(category ? category.name : '');
    setDescription(category ? (category.description || '') : '');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setDescription('');
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white font-sans">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-800">Exam Categories</h1>
        <button onClick={() => openModal()} className="px-5 py-2.5 bg-[#4c51bf] hover:bg-[#434190] text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Add Category
        </button>
      </div>

      <div className="bg-white border border-slate-200 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-800">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-800">Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-800">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-800 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No categories found.</td></tr>
            ) : (
              categories.map((cat, i) => (
                <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{i + 1}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cat.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{cat.description || ''}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => openModal(cat)} className="px-3 py-1 bg-[#48bb78] text-white text-xs font-bold rounded">Edit</button>
                      <button onClick={() => handleDelete(cat.id)} className="px-3 py-1 bg-[#f56565] text-white text-xs font-bold rounded">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">{editingCategory ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <i className="fa-solid fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Category Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Physics CQ"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Description</label>
                <input 
                  type="text" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#4c51bf] outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-[#4c51bf] hover:bg-[#434190] text-white rounded-lg text-sm font-bold shadow-md transition-all">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
