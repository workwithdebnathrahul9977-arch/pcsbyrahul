'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function GroupManagementPage() {
  const [items, setItems] = useState<any[]>([]);
  const [name, setName] = useState('');

  const fetch = async () => {
    const res = await axios.get(`${API}/api/academic/groups`);
    setItems(res.data);
  };
  useEffect(() => { fetch(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await axios.post(`${API}/api/academic/groups`, { name });
    toast.success('Group added!');
    setName('');
    fetch();
  };

  const handleEdit = async (item: any) => {
    const newName = prompt('Edit group name:', item.name);
    if (newName && newName !== item.name) {
      await axios.put(`${API}/api/academic/groups/${item.id}`, { name: newName });
      toast.success('Updated!');
      fetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this group?')) return;
    await axios.delete(`${API}/api/academic/groups/${id}`);
    toast.success('Deleted!');
    fetch();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Group Management</h2>
          <p className="text-gray-500 text-sm">Manage academic groups (e.g. Science, Commerce, Arts)</p>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
        <h3 className="font-bold text-gray-700 text-sm mb-3">Add New Group</h3>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            placeholder="e.g. Science, Commerce, Arts"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none"
          />
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-sm flex items-center gap-2">
            <i className="fa-solid fa-plus"></i> Add
          </button>
        </form>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-bold w-12">#</th>
              <th className="p-4 font-bold">Group Name</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={3} className="p-8 text-center text-gray-400">No groups found. Add one above.</td></tr>
            ) : items.map((item, i) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-red-50/30 transition">
                <td className="p-4 text-gray-400 text-sm">{i + 1}</td>
                <td className="p-4 font-medium text-gray-900">{item.name}</td>
                <td className="p-4 text-right">
                  <button onClick={() => handleEdit(item)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition mr-1">
                    <i className="fa-solid fa-pen text-sm"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
