'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminAlbums() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', images: [] as string[] });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/albums`);
      setAlbums(res.data);
    } catch (error) {
      toast.error('Failed to load albums');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const toastId = toast.loading('Uploading images...');
    try {
      const newImages = [...formData.images];
      
      for (let i = 0; i < files.length; i++) {
        const fileData = new FormData();
        fileData.append('image', files[i]);
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
          method: 'POST',
          body: fileData
        });
        const data = await res.json();
        if (res.ok) {
          newImages.push(data.imageUrl);
        }
      }
      
      setFormData({ ...formData, images: newImages });
      toast.success('Images uploaded!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed', { id: toastId });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Saving album...');
    try {
      if (editingId) {
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/albums/${editingId}`, formData);
        toast.success('Album updated', { id: toastId });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/albums`, formData);
        toast.success('Album created', { id: toastId });
      }
      setIsModalOpen(false);
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to save', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this album?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/albums/${id}`);
      toast.success('Album deleted');
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const openEditModal = (album: any) => {
    setEditingId(album.id);
    setFormData({ title: album.title, content: album.content, images: album.images });
    setIsModalOpen(true);
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', images: [] });
    setIsModalOpen(true);
  };

  const removeImage = (index: number) => {
    const updated = [...formData.images];
    updated.splice(index, 1);
    setFormData({ ...formData, images: updated });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Photo Albums / Gallery</h1>
        <button onClick={openNewModal} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-red-700 transition">
          + Create New Album
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : albums.length === 0 ? (
          <p className="col-span-full text-center text-gray-500 py-10">No albums found. Create one!</p>
        ) : (
          albums.map(album => (
            <div key={album.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                {album.images.length > 0 ? (
                  <img src={album.images[0]} alt="Album Cover" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400">No images</span>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-bold text-xl mb-2">{album.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">{album.content}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-red-600">{album.images.length} Photos</span>
                  <div className="space-x-2">
                    <button onClick={() => openEditModal(album)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    <button onClick={() => handleDelete(album.id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Edit Album' : 'Create New Album'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Album Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" placeholder="e.g. Annual Sports Day 2026" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description / Content</label>
                <textarea required value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} rows={3} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" placeholder="Brief description of the album..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Upload Images (Select multiple)</label>
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700" />
              </div>
              
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <p className="font-bold text-sm mb-2 text-gray-700">Album Images ({formData.images.length})</p>
                  <div className="grid grid-cols-4 gap-3">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-square border rounded-lg overflow-hidden group">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-600 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs">
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 border rounded-lg font-bold hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">Save Album</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
