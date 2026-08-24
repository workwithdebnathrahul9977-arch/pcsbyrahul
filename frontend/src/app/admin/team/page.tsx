'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <p>Loading Editor...</p>
});

export default function AdminTeam() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ name: '', role: '', phone: '', facebook: '', instagram: '', whatsapp: '', twitter: '', linkedin: '', order: '0', imageUrl: '', bio: '' });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/team`);
      setMembers(res.data);
    } catch (error) {
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', role: '', phone: '', facebook: '', instagram: '', whatsapp: '', twitter: '', linkedin: '', order: '0', imageUrl: '', bio: '' });
    setImageFile(null);
    setShowModal(true);
  };

  const openEditModal = (member: any) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      role: member.role,
      phone: member.phone || '',
      facebook: member.facebook || '',
      instagram: member.instagram || '',
      whatsapp: member.whatsapp || '',
      twitter: member.twitter || '',
      linkedin: member.linkedin || '',
      order: member.order.toString(),
      imageUrl: member.imageUrl || '',
      bio: member.bio || ''
    });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('image', imageFile);
        const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('Upload response:', uploadRes.data);
        imageUrl = uploadRes.data.imageUrl;
      }

      console.log('Final imageUrl to save:', imageUrl);
      const payload = { ...formData, imageUrl, order: parseInt(formData.order) || 0 };
      console.log('Payload:', payload);

      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/team/${editingId}`, payload);
        toast.success('Member updated!');
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/team`, payload);
        toast.success('Member added!');
      }

      setShowModal(false);
      fetchTeam();
    } catch (error) {
      toast.error('Failed to save member');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/team/${id}`);
      toast.success('Deleted successfully');
      fetchTeam();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Team Management</h1>
        <button onClick={openAddModal} className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 shadow">
          + Add New Member
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading...</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No team members added yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700">Image</th>
                <th className="p-4 font-bold text-gray-700">Name</th>
                <th className="p-4 font-bold text-gray-700">Role</th>
                <th className="p-4 font-bold text-gray-700">Phone</th>
                <th className="p-4 font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    {member.imageUrl ? (
                      <img src={member.imageUrl} alt={member.name} className="w-12 h-12 object-cover rounded-full shadow-sm" />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
                        {member.name.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{member.name}</td>
                  <td className="p-4"><span className="bg-gray-200 px-2 py-1 rounded text-sm">{member.role}</span></td>
                  <td className="p-4">{member.phone || '-'}</td>
                  <td className="p-4">
                    <button onClick={() => openEditModal(member)} className="text-blue-600 hover:underline font-bold mr-4">Edit</button>
                    <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Team Member' : 'Add Team Member'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Role (e.g. Developer, Teacher)</label>
                  <input required type="text" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Image</label>
                {formData.imageUrl && !imageFile && <img src={formData.imageUrl} className="h-16 mb-2 rounded" alt="Preview" />}
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="w-full border p-2 rounded" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number (optional)</label>
                  <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number (optional)</label>
                  <input type="text" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Facebook Link (optional)</label>
                  <input type="text" value={formData.facebook} onChange={e => setFormData({...formData, facebook: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Instagram Link (optional)</label>
                  <input type="text" value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Twitter Link (optional)</label>
                  <input type="text" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} className="w-full border p-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">LinkedIn Link (optional)</label>
                  <input type="text" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} className="w-full border p-2 rounded" />
                </div>
              </div>

              <div className="mb-12 pb-10">
                <label className="block text-sm font-bold text-gray-700 mb-2">Bio / Details (Formatted Text)</label>
                <div className="bg-white">
                  <ReactQuill 
                    theme="snow" 
                    value={formData.bio} 
                    onChange={val => setFormData({...formData, bio: val})} 
                    className="h-48"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 mt-12 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-200 rounded font-bold hover:bg-gray-300">Cancel</button>
                <button type="submit" disabled={uploading} className="px-6 py-2 bg-red-600 text-white rounded font-bold hover:bg-red-700 disabled:opacity-50">
                  {uploading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
