'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export default function AdminPopup() {
  const [formData, setFormData] = useState({
    heading: 'Telegram joining',
    imageUrl: '',
    subHeading: 'Welcome to our platform!',
    buttonText: 'JOIN OUR TELEGRAM GROUP FIRST',
    buttonUrl: '#',
    isActive: true
  });
  
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current popup settings on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/popupSettings`);
        const data = await res.json();
        if (data && data.value) {
          setFormData(JSON.parse(data.value));
        }
      } catch (error) {
        console.error("Failed to fetch popup settings");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading('Saving popup settings...');
    
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/settings/popupSettings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: JSON.stringify(formData) })
      });
      
      if (res.ok) {
        toast.success('Popup Settings Saved successfully!', { id: toastId });
      } else {
        toast.error('Failed to save settings', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error while saving', { id: toastId });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataObj = new FormData();
    formDataObj.append('image', file);

    const toastId = toast.loading('Uploading image...');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/upload`, {
        method: 'POST',
        body: formDataObj,
      });
      const data = await res.json();
      if (res.ok) {
        setFormData({ ...formData, imageUrl: data.imageUrl });
        toast.success('Image uploaded!', { id: toastId });
      } else {
        toast.error(data.error || 'Upload failed', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error during upload', { id: toastId });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Popup Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Settings Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Edit Popup Content</h2>
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Heading (Top text)</label>
              <input type="text" value={formData.heading} onChange={e => setFormData({...formData, heading: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Upload Image</label>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border p-2 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100" />
              {formData.imageUrl && <p className="text-sm text-green-600 mt-2 font-medium">✓ Image uploaded successfully</p>}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sub Heading (Below image)</label>
              <textarea value={formData.subHeading} onChange={e => setFormData({...formData, subHeading: e.target.value})} rows={3} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"></textarea>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
              <input type="text" value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Button URL</label>
              <input type="text" value={formData.buttonUrl} onChange={e => setFormData({...formData, buttonUrl: e.target.value})} className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none" />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="w-5 h-5 text-red-600 rounded focus:ring-red-500" />
              <label htmlFor="isActive" className="font-bold text-gray-700 cursor-pointer">Enable Popup on Website</label>
            </div>

            <button type="submit" className="w-full py-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition">
              Save Popup Settings
            </button>
          </form>
        </div>

        {/* Live Preview */}
        <div>
          <h2 className="text-xl font-bold mb-6">Live Preview</h2>
          <div className="bg-gray-100 p-8 rounded-xl border border-gray-300 min-h-[500px] flex items-center justify-center relative overflow-hidden">
            
            {/* The Popup Component */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-sm w-full relative z-10 animate-bounce-slight">
              
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 text-lg">{formData.heading || 'Heading'}</h3>
                <button className="text-gray-400 hover:text-red-500">
                  <span className="text-xl">&times;</span>
                </button>
              </div>

              <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                {formData.imageUrl ? (
                  <img src={formData.imageUrl} alt="Popup Image" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 font-bold">[ Uploaded Image Here ]</span>
                )}
              </div>

              <div className="p-6 text-center">
                <p className="text-gray-700 mb-6 font-medium leading-relaxed">
                  {formData.subHeading || 'Sub heading will appear here.'}
                </p>
                <div className="flex items-center justify-center space-x-4">
                  <button className="text-gray-500 font-bold hover:text-gray-700">Close</button>
                  <a href={formData.buttonUrl} target="_blank" rel="noreferrer" className="bg-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md hover:bg-red-600 transform hover:-translate-y-0.5 transition block text-sm">
                    {formData.buttonText || 'Button'}
                  </a>
                </div>
              </div>

            </div>

            {/* Overlay backdrop */}
            <div className="absolute inset-0 bg-black/40 z-0"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
