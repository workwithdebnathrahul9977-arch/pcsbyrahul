'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gallery`);
      setImages(res.data);
    } catch (error) {
      toast.error('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image is too large (Max 5MB)');
      return;
    }

    setUploading(true);
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gallery`, {
          imageUrl: reader.result
        });
        toast.success('Image added successfully');
        fetchImages();
      } catch (error) {
        toast.error('Failed to save image');
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/gallery/${id}`);
      toast.success('Image deleted');
      setImages(images.filter(img => img.id !== id));
    } catch (error) {
      toast.error('Failed to delete image');
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Photo Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Manage scrolling images for the homepage</p>
        </div>
        
        <div>
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            className="hidden" 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={uploading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2"
          >
            {uploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-cloud-arrow-up"></i>}
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-red-600"></i>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              <i className="fa-solid fa-image"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Images Found</h3>
            <p className="text-gray-500">Upload photos to show them in the scrolling gallery.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map(img => (
              <div key={img.id} className="relative group rounded-xl overflow-hidden shadow-sm border border-gray-200 aspect-square">
                <img src={img.imageUrl} alt="Gallery item" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => deleteImage(img.id)}
                    className="bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-700 hover:scale-110 transition-all shadow-lg"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
