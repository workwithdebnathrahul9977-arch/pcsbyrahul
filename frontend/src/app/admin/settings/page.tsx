'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminSettings() {
  const [showNotice, setShowNotice] = useState(false);
  const [noticeText, setNoticeText] = useState('');
  const [showCategories, setShowCategories] = useState(true);
  const [showTestimonials, setShowTestimonials] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [sirImageUrl, setSirImageUrl] = useState('');
  const [sirImageFile, setSirImageFile] = useState<File | null>(null);
  const [uploadingSir, setUploadingSir] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [noticeRes, textRes, sirImgRes, catRes, testRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_NOTICE`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/NOTICE_TEXT`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/ABOUT_SIR_IMAGE`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_CATEGORIES_ON_HOME`).catch(() => ({ data: { value: 'true' } })),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_TESTIMONIALS`).catch(() => ({ data: { value: 'true' } }))
        ]);
        
        setShowNotice(noticeRes.data.value === 'true');
        setNoticeText(textRes.data.value || '');
        setSirImageUrl(sirImgRes.data.value || '');
        setShowCategories(catRes.data.value !== 'false'); // Default true if not set
        setShowTestimonials(testRes.data.value !== 'false'); // Default true if not set
      } catch (error) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await Promise.all([
        axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_NOTICE`, { value: showNotice.toString() }),
        axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/NOTICE_TEXT`, { value: noticeText }),
        axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_CATEGORIES_ON_HOME`, { value: showCategories.toString() }),
        axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_TESTIMONIALS`, { value: showTestimonials.toString() })
      ]);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSirImageUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sirImageFile) return;

    setUploadingSir(true);
    const formData = new FormData();
    formData.append('image', sirImageFile);

    try {
      // 1. Upload to server
      const uploadRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const imageUrl = uploadRes.data.imageUrl;

      // 2. Save URL to settings
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/ABOUT_SIR_IMAGE`, { value: imageUrl });
      
      setSirImageUrl(imageUrl);
      setSirImageFile(null);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      setUploadingSir(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Site Settings</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Homepage Features & Notice Bar</h2>
        <form onSubmit={handleSave} className="space-y-6">

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="font-bold text-gray-900">Show Course Categories</p>
              <p className="text-sm text-gray-500">Show the grid of course categories on the homepage.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showCategories}
                onChange={(e) => setShowCategories(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="font-bold text-gray-900">Show Testimonials</p>
              <p className="text-sm text-gray-500">Show the "শিক্ষার্থীদের অভিমত" slider on the homepage.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showTestimonials}
                onChange={(e) => setShowTestimonials(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
            <div>
              <p className="font-bold text-gray-900">Enable Notice Bar</p>
              <p className="text-sm text-gray-500">Show a scrolling notice at the very top of the website.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={showNotice}
                onChange={(e) => setShowNotice(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Notice Text</label>
            <textarea 
              value={noticeText}
              onChange={(e) => setNoticeText(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-500 min-h-[100px]"
              placeholder="E.g. আসসালামু আলাইকুম আমাদের ওয়েবসাইটে রয়েছে দিনরাত 24 ঘন্টা অটো টপ-আপ।"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={saving}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* Sir Image Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-2xl mt-8">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">"কেন আমাদের কোর্সে আস্থা রাখবেন?" Section Image</h2>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Current Image</label>
          {sirImageUrl ? (
            <img src={sirImageUrl} alt="Sir" className="w-48 h-auto object-cover rounded shadow border" />
          ) : (
            <p className="text-gray-500 italic">No image uploaded yet.</p>
          )}
        </div>

        <form onSubmit={handleSirImageUpload} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Upload New Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSirImageFile(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 p-2 rounded-lg"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={uploadingSir}
            className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploadingSir ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>
      </div>
    </div>
  );
}
