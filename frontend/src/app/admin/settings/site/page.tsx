'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function SiteSettingsPage() {
  const [settings, setSettings] = useState({
    ADMISSION_BANNER_ACTIVE: 'false',
    ADMISSION_BANNER_TEXT: 'ভর্তি চলছে! গণিতে দক্ষতা অর্জন করুন এবং একাডেমিক সাফল্যের পথে আত্মবিশ্বাসের সঙ্গে এগিয়ে যান। ইনফিনিটি ম্যাথ সেন্টারে-এ ভর্তি হয়ে আজই আপনার উজ্জ্বল ভবিষ্যতের প্রথম পদক্ষেপ নিন এবং শেখার নতুন দিগন্ত উন্মোচন করুন!',
    DIRECTOR_NAME: 'জনাব সুমেল স্যার',
    DIRECTOR_TEXT: 'একজন দক্ষ ও অভিজ্ঞ শিক্ষক...',
    DIRECTOR_IMAGE: '',
    DIRECTOR_FB: '',
    SHOW_NOTICE: 'false',
    NOTICE_TEXT: '',
    SOCIAL_FACEBOOK: '',
    SOCIAL_YOUTUBE: '',
    CONTACT_PHONE: '',
    CONTACT_EMAIL: '',
    ADDRESS: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/api/settings`);
      setSettings(prev => ({ ...prev, ...data }));
    } catch {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const { data } = await axios.post(`${API}/api/upload`, fd);
      setSettings(prev => ({ ...prev, [key]: data.url }));
      toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const promises = Object.entries(settings).map(([key, value]) =>
        axios.post(`${API}/api/settings/${key}`, { value })
      );
      await Promise.all(promises);
      toast.success('Settings saved successfully!');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) return <div className="p-8 text-center"><i className="fa-solid fa-spinner fa-spin text-2xl text-red-600"></i></div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Site Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage global website settings and banners</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-md shadow-red-500/20 flex items-center gap-2">
          {saving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-floppy-disk"></i>}
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        
        {/* Top Notice Bar Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
              <i className="fa-solid fa-bell"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Top Notice Bar</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Enable Top Notice</p>
                <p className="text-xs text-gray-500">Show scrolling notice at the very top of the website</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.SHOW_NOTICE === 'true'} onChange={(e) => handleChange('SHOW_NOTICE', e.target.checked ? 'true' : 'false')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Notice Text</label>
              <input type="text" value={settings.NOTICE_TEXT} onChange={e => handleChange('NOTICE_TEXT', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
          </div>
        </div>

        {/* Admission Banner Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <i className="fa-solid fa-bullhorn"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Admission Banner</h2>
          </div>
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-bold text-gray-900">Enable Banner</p>
                <p className="text-xs text-gray-500">Show admission banner on all public pages (above footer)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={settings.ADMISSION_BANNER_ACTIVE === 'true'} onChange={(e) => handleChange('ADMISSION_BANNER_ACTIVE', e.target.checked ? 'true' : 'false')} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Banner Description Text</label>
              <textarea 
                value={settings.ADMISSION_BANNER_TEXT} 
                onChange={(e) => handleChange('ADMISSION_BANNER_TEXT', e.target.value)} 
                rows={3} 
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        {/* Director Info (About Us) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <i className="fa-solid fa-user-tie"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Director Info (About Us Section)</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Director Name</label>
              <input type="text" value={settings.DIRECTOR_NAME} onChange={e => handleChange('DIRECTOR_NAME', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Director Description</label>
              <textarea value={settings.DIRECTOR_TEXT} onChange={e => handleChange('DIRECTOR_TEXT', e.target.value)} rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Director Photo</label>
              <div className="flex items-center gap-4">
                {settings.DIRECTOR_IMAGE && <img src={settings.DIRECTOR_IMAGE} alt="Director" className="w-20 h-20 rounded-xl object-cover" />}
                <input type="file" onChange={e => handleFileUpload(e, 'DIRECTOR_IMAGE')} accept="image/*" className="text-sm" />
                {uploading && <i className="fa-solid fa-spinner fa-spin text-red-600"></i>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Director Facebook URL</label>
              <input type="text" value={settings.DIRECTOR_FB} onChange={e => handleChange('DIRECTOR_FB', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <i className="fa-solid fa-link"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Contact & Social Links</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Phone</label>
              <input type="text" value={settings.CONTACT_PHONE} onChange={e => handleChange('CONTACT_PHONE', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contact Email</label>
              <input type="email" value={settings.CONTACT_EMAIL} onChange={e => handleChange('CONTACT_EMAIL', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Address</label>
              <textarea value={settings.ADDRESS} onChange={e => handleChange('ADDRESS', e.target.value)} rows={2} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Facebook Page Link</label>
              <input type="text" value={settings.SOCIAL_FACEBOOK} onChange={e => handleChange('SOCIAL_FACEBOOK', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">YouTube Channel Link</label>
              <input type="text" value={settings.SOCIAL_YOUTUBE} onChange={e => handleChange('SOCIAL_YOUTUBE', e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
