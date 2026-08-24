'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImages();
    fetchSettings();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/gallery`);
      setImages(res.data);
    } catch (error) {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_GALLERY`);
      if (res.data.value !== null) {
        setShowGallery(res.data.value === 'true');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggle = async () => {
    const newVal = !showGallery;
    setShowGallery(newVal);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_GALLERY`, { value: String(newVal) });
      toast.success(newVal ? 'Gallery is now Visible' : 'Gallery is now Hidden');
    } catch (error) {
      toast.error('Failed to save settings');
      setShowGallery(!newVal);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    
    const toastId = toast.loading('Uploading image...');
    try {
      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();
      
      if (uploadRes.ok) {
        // Now save to gallery
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/gallery`, { imageUrl: uploadData.imageUrl });
        toast.success('Image added to gallery!', { id: toastId });
        fetchImages();
      } else {
        toast.error('Upload failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/gallery/${id}`);
      toast.success('Image deleted');
      fetchImages();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Success Gallery Management</h1>
          <p className="text-gray-600 mt-1">Add unlimited images for the homepage scrolling gallery.</p>
        </div>
        
        <div className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
          <span className="font-bold text-gray-700">Show on Homepage:</span>
          <button 
            onClick={handleToggle}
            className={`w-12 h-6 rounded-full relative transition-colors ${showGallery ? 'bg-red-600' : 'bg-gray-300'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${showGallery ? 'translate-x-6' : ''}`}></span>
          </button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Uploaded Images ({images.length})</h2>
          <div>
            <input type="file" id="upload-image" className="hidden" accept="image/*" onChange={handleUpload} />
            <label htmlFor="upload-image" className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-red-700 transition inline-block">
              + Upload Image
            </label>
          </div>
        </div>

        {loading ? (
          <div className="py-10 text-center">Loading images...</div>
        ) : images.length === 0 ? (
          <div className="py-16 text-center text-gray-400 border border-dashed rounded-xl">
            <i className="fa-regular fa-image text-4xl mb-2"></i>
            <p>No images uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-gray-200">
                <img src={img.imageUrl} alt="Gallery" className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDelete(img.id)} className="bg-red-600 text-white w-10 h-10 rounded-full hover:bg-red-700 flex items-center justify-center">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
