'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    imageUrl: '',
    phone: '',
    facebook: '',
    whatsapp: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    bio: '',
    order: '0'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/team`);
      setMembers(data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({
      name: '', role: '', imageUrl: '', phone: '', facebook: '',
      whatsapp: '', instagram: '', twitter: '', linkedin: '', bio: '', order: '0'
    });
    setEditId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setFormData({
      name: member.name || '',
      role: member.role || '',
      imageUrl: member.imageUrl || '',
      phone: member.phone || '',
      facebook: member.facebook || '',
      whatsapp: member.whatsapp || '',
      instagram: member.instagram || '',
      twitter: member.twitter || '',
      linkedin: member.linkedin || '',
      bio: member.bio || '',
      order: String(member.order || 0)
    });
    setEditId(member.id);
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size must be less than 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/team/${editId}`, formData);
        toast.success('Member updated successfully');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/team`, formData);
        toast.success('Member added successfully');
      }
      fetchMembers();
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to save member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this member?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/team/${id}`);
      toast.success('Member deleted');
      setMembers(members.filter(m => m.id !== id));
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage teachers, developers, and staff profiles</p>
        </div>
        <button onClick={openAddModal} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
          <i className="fa-solid fa-user-plus"></i> Add Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-red-600"></i>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            <i className="fa-solid fa-users"></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Team Members Found</h3>
          <p className="text-gray-500 max-w-md mx-auto">Add teachers and staff to display them on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map(member => (
            <div key={member.id} className="bg-[#242424] text-white rounded-xl overflow-hidden shadow-lg border border-gray-800 flex flex-col relative group">
              <div className="h-48 w-full bg-black relative flex items-center justify-center p-4">
                {member.imageUrl ? (
                  <img src={member.imageUrl} alt={member.name} className="max-h-full max-w-full object-contain drop-shadow-2xl" />
                ) : (
                  <i className="fa-solid fa-user text-5xl text-gray-600"></i>
                )}
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  বর্তমান সদস্য
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-md inline-block w-fit mb-2">
                  {member.role}
                </span>
                <h3 className="font-bold text-lg">{member.name}</h3>
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => openEditModal(member)} className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 hover:scale-110 transition-all shadow-lg">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button onClick={() => handleDelete(member.id)} className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all shadow-lg">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{editId ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl"><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name *</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" placeholder="e.g. RahuL (Team Nexa)" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role / Designation *</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" placeholder="e.g. Developer" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" placeholder="Optional" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Display Order</label>
                  <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2" placeholder="e.g. 1" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Member Photo</label>
                  <div className="flex gap-4 items-center">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold border border-gray-200 transition">
                      <i className="fa-solid fa-image mr-2"></i> Choose Image
                    </button>
                    {formData.imageUrl && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><i className="fa-solid fa-check mr-1"></i> Image Selected</span>}
                  </div>
                  {formData.imageUrl && (
                    <div className="mt-3 h-24 w-24 bg-black rounded-lg overflow-hidden border border-gray-200 relative p-1 flex items-center justify-center">
                      <img src={formData.imageUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
                      <button type="button" onClick={() => setFormData({...formData, imageUrl: ''})} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] hover:bg-red-700">
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                  <h4 className="text-sm font-bold text-gray-600 mb-3"><i className="fa-brands fa-facebook mr-2 text-blue-600"></i> Social Links (Optional)</h4>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Facebook URL</label>
                  <input type="text" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">WhatsApp Number</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2 text-sm" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition">Cancel</button>
                <button type="submit" disabled={saving} className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
                  {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
