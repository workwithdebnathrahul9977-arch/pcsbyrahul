'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FeeCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/feecategories`);
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
        await axios.put(`${API}/api/feecategories/${editingCategory.id}`, { name, isActive });
      } else {
        await axios.post(`${API}/api/feecategories`, { name });
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
      await axios.delete(`${API}/api/feecategories/${id}`);
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert('Failed to delete category');
    }
  };

  const toggleStatus = async (cat: any) => {
    try {
      await axios.put(`${API}/api/feecategories/${cat.id}`, { isActive: !cat.isActive });
      fetchCategories();
    } catch (e) {
      console.error(e);
      alert('Failed to update status');
    }
  };

  const openModal = (category: any = null) => {
    setEditingCategory(category);
    setName(category ? category.name : '');
    setIsActive(category ? category.isActive : true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setName('');
    setIsActive(true);
  };

  return (
    <div className="max-w-[1200px] mx-auto bg-white font-sans">
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-bold text-slate-800">Fee Categories</h1>
        <button onClick={() => openModal()} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> New Category
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CATEGORY NAME</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">ACTIONS</th>
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
                  <td className="px-6 py-4 text-sm font-bold text-slate-800">{cat.name}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(cat)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}
                    >
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openModal(cat)} className="text-indigo-600 font-medium text-sm hover:underline mr-4">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 font-medium text-sm hover:underline">Delete</button>
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-down">
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
                  placeholder="e.g. Exam Fee"
                  className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  autoFocus
                  required
                />
              </div>
              {editingCategory && (
                <div className="flex items-center gap-2 mt-2">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} id="isActive" className="rounded" />
                  <label htmlFor="isActive" className="text-sm font-bold text-slate-700">Is Active</label>
                </div>
              )}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-all">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all">
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
