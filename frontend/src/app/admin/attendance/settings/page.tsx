'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AttendanceSettings() {
  const [hidePhone, setHidePhone] = useState(false);
  const [autoSelect, setAutoSelect] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/settings`);
      setHidePhone(data.hidePhone);
      setAutoSelect(data.autoSelect);
    } catch (e) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/settings`, {
        hidePhone, autoSelect
      });
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Settings</h1>
        <p className="text-sm text-gray-500">আপনার ইনস্টিটিউটের হাজিরা, প্রাইভেসি এবং অটোমেশন সেটিংস কনফিগার করুন।</p>
      </div>

      <div className="max-w-4xl space-y-6">
        
        {/* Privacy & Role Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded flex items-center justify-center">
              <i className="fa-solid fa-lock"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">Privacy & Role Security</h2>
          </div>

          <div className="flex justify-between items-start pt-4 border-t border-gray-50">
            <div className="pr-12">
              <h3 className="font-bold text-gray-900 mb-2">Hide Student/Guardian Phone Numbers</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                এটি চালু থাকলে টিচাররা ড্যাশবোর্ডে স্টুডেন্ট বা অভিভাবকের পুরো মোবাইল নাম্বার দেখতে পাবেন না। 
                সিকিউরিটির স্বার্থে নাম্বারটি মাস্ক করে দেখানো হবে (যেমন: <span className="text-red-500 bg-red-50 px-1 rounded">01727******</span>)। 
                শুধুমাত্র মূল এডমিন পুরো নাম্বার দেখতে পাবেন।
              </p>
            </div>
            <div className="shrink-0 pt-2">
              <button 
                onClick={() => setHidePhone(!hidePhone)}
                className={`w-12 h-6 rounded-full relative transition-colors ${hidePhone ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hidePhone ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        {/* Subject Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h2 className="text-lg font-bold text-gray-800">সাবজেক্ট সিলেকশন</h2>
          </div>

          <div className="flex justify-between items-start pt-4 border-t border-gray-50">
            <div className="pr-12">
              <h3 className="font-bold text-gray-900 mb-2">Auto-select All Subjects on Batch Selection</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                এটি সক্রিয় থাকলে, টিচার যখনই হাজিরা (Attendance) নেওয়ার জন্য কোনো **Batch** সিলেক্ট করবেন, 
                সাথে ওই ব্যাচের অন্তর্ভুক্ত **সবগুলো সাবজেক্ট স্বয়ংক্রিয়ভাবে টিক চিহ্ন** হয়ে যাবে। 
                এতে টিচারদের প্রতিটি সাবজেক্টে আলাদা করে ক্লিক করার সময় বাঁচবে।
              </p>
            </div>
            <div className="shrink-0 pt-2">
              <button 
                onClick={() => setAutoSelect(!autoSelect)}
                className={`w-12 h-6 rounded-full relative transition-colors ${autoSelect ? 'bg-green-500' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${autoSelect ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={() => fetchSettings()} className="px-6 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={saveSettings} disabled={saving} className="bg-[#4b49ac] hover:bg-[#3f3e91] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

      </div>
    </div>
  );
}
