'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StudentDeactivationPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [reason, setReason] = useState('');
  const [dueAction, setDueAction] = useState('keep');
  
  const [meta, setMeta] = useState({ classes: [] as string[], batches: [] as string[] });

  useEffect(() => {
    import('axios').then((axios) => {
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      Promise.all([
        axios.default.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
        axios.default.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
      ]).then(([c, b]) => {
        setMeta({
          classes: c.data.map((x: any) => x.name),
          batches: b.data.map((x: any) => x.name)
        });
      });
    });
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto font-sans">
      
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          স্টুডেন্ট ডিঅ্যাক্টিভেশন
        </h1>
        <p className="text-slate-500 text-sm mt-1">একজন খুঁজে ডিঅ্যাক্টিভ করুন অথবা ব্যাচ অনুযায়ী একসাথে আপডেট করুন।</p>
      </div>

      <div className="space-y-6">
        
        {/* Section 1: Single Search */}
        <div className="bg-white rounded-xl shadow-sm border border-indigo-200 overflow-hidden">
          <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100">
            <h3 className="text-indigo-900 font-bold text-[15px] flex items-center gap-2">
              <i className="fa-solid fa-magnifying-glass text-indigo-500"></i> ১ জন স্টুডেন্ট খুঁজুন (Search)
            </h3>
            <p className="text-indigo-600/70 text-xs mt-1">স্টুডেন্টের আইডি লিখে সরাসরি প্রোফাইল ও অ্যাকশন প্যানেল ওপেন করুন।</p>
          </div>
          <div className="p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <i className="fa-solid fa-fingerprint text-slate-400"></i>
              </div>
              <input 
                type="text" 
                placeholder="স্টুডেন্ট আইডি দিন (যেমন: 518747)" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <button onClick={() => { if(studentId) router.push('/admin/students/' + studentId) }} className="w-full md:w-auto px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fa-solid fa-bolt text-amber-400"></i> প্রোফাইল ওপেন করুন
            </button>
          </div>
        </div>

        {/* Section 2: Batch Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-200 overflow-hidden">
          <div className="bg-purple-50/50 px-6 py-4 border-b border-purple-100">
            <h3 className="text-purple-900 font-bold text-[15px] flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-purple-500"></i> ব্যাচ ফিল্টার এবং একসাথে ডিঅ্যাক্টিভ
            </h3>
            <p className="text-purple-600/70 text-xs mt-1">ক্লাস ও ব্যাচ সিলেক্ট করে স্টুডেন্ট লোড করুন।</p>
          </div>
          <div className="p-6 flex flex-col md:flex-row items-end gap-4">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-graduation-cap text-slate-400"></i> ক্লাস (Class)</label>
              <select 
                value={selectedClass} 
                onChange={e => setSelectedClass(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-600"
              >
                <option value="">-- ক্লাস বেছে নিন --</option>
                {meta.classes.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1.5"><i className="fa-solid fa-clock text-slate-400"></i> ব্যাচ (Batch)</label>
              <select 
                value={selectedBatch} 
                onChange={e => setSelectedBatch(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-slate-600"
              >
                <option value="">-- ব্যাচ বেছে নিন --</option>
                {meta.batches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <button className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fa-solid fa-cloud-arrow-down"></i> ব্যাচের স্টুডেন্ট লোড করুন
            </button>
          </div>
        </div>

        {/* Section 3: Batch Deactivation Action */}
        <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
          <div className="bg-purple-50/30 px-6 py-4 border-b border-purple-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-purple-900 font-bold text-[15px] flex items-center gap-2">
                <i className="fa-solid fa-users-slash text-purple-500"></i> ব্যাচ ডিঅ্যাক্টিভেশন
              </h3>
              <p className="text-purple-600/70 text-xs mt-1">নির্বাচিত শিক্ষার্থীদের জন্য একসাথে ডিঅ্যাক্টিভ অ্যাকশন প্রয়োগ করুন</p>
            </div>
            <div className="px-4 py-1.5 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold shadow-sm">
              Selected <span className="text-purple-900 font-black px-1">0</span> Students
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8 mb-6">
              
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                  <i className="fa-solid fa-circle-info text-indigo-400"></i> ডিঅ্যাক্টিভেশনের কারণ
                </label>
                <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-600">
                  <option>কারণ নির্বাচন করুন</option>
                  <option>Attendance Issue</option>
                  <option>Fee Default</option>
                  <option>Left Institute</option>
                </select>
              </div>

              <div className="flex-[2]">
                <label className="block text-xs font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                  <i className="fa-solid fa-wallet text-amber-500"></i> বকেয়া টাকার অবস্থা
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Option 1 */}
                  <label className={`relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${dueAction === 'keep' ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-200'}`}>
                    <input type="radio" name="dueAction" className="sr-only" checked={dueAction === 'keep'} onChange={() => setDueAction('keep')} />
                    <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${dueAction === 'keep' ? 'border-emerald-500' : 'border-slate-300'}`}>
                      {dueAction === 'keep' && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${dueAction === 'keep' ? 'text-emerald-700' : 'text-slate-700'}`}>Due রাখুন</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">ভবিষ্যতে আদায় করা যাবে</p>
                    </div>
                  </label>

                  {/* Option 2 */}
                  <label className={`relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${dueAction === 'clear_current' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 hover:border-amber-200'}`}>
                    <input type="radio" name="dueAction" className="sr-only" checked={dueAction === 'clear_current'} onChange={() => setDueAction('clear_current')} />
                    <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${dueAction === 'clear_current' ? 'border-amber-500' : 'border-slate-300'}`}>
                      {dueAction === 'clear_current' && <div className="w-2 h-2 bg-amber-500 rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${dueAction === 'clear_current' ? 'text-amber-700' : 'text-slate-700'}`}>চলতি Due মুছুন</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">শুধুমাত্র রানিং বকেয়া ক্লিয়ার হবে</p>
                    </div>
                  </label>

                  {/* Option 3 */}
                  <label className={`relative flex items-start p-3 rounded-lg border-2 cursor-pointer transition-all ${dueAction === 'clear_all' ? 'border-red-500 bg-red-50/30' : 'border-slate-200 hover:border-red-200'}`}>
                    <input type="radio" name="dueAction" className="sr-only" checked={dueAction === 'clear_all'} onChange={() => setDueAction('clear_all')} />
                    <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${dueAction === 'clear_all' ? 'border-red-500' : 'border-slate-300'}`}>
                      {dueAction === 'clear_all' && <div className="w-2 h-2 bg-red-500 rounded-full"></div>}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${dueAction === 'clear_all' ? 'text-red-700' : 'text-slate-700'}`}>সব Due মুছে দিন</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">সকল বকেয়া ক্লিয়ার হবে</p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 mb-6">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 mt-0.5"></i>
              <div>
                <p className="text-sm font-bold text-amber-800">সতর্কতা</p>
                <p className="text-xs text-amber-700 mt-0.5">এই অ্যাকশন নির্বাচিত সকল শিক্ষার্থীর উপর একসাথে প্রয়োগ হবে। নিশ্চিত হয়ে তারপর চালিয়ে যান।</p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-2">
              <p className="text-sm text-slate-600">নির্বাচিত: <span className="font-bold text-slate-900">0</span> জন শিক্ষার্থী</p>
              <button className="px-6 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
                <i className="fa-solid fa-user-slash"></i> Bulk Deactivate Students
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-8">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-sm font-bold text-slate-800">ভর্তি থাকা স্টুডেন্টের তালিকা</h2>
              <p className="text-xs text-slate-500 mt-0.5">সিঙ্গেল পপআপ ভিউ করতে লাইনের 'View Profile' বাটনে ক্লিক করুন।</p>
            </div>
            <i className="fa-solid fa-database text-slate-300 text-xl"></i>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-3.5 w-10">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300" />
                  </th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-600">স্টুডেন্টের নাম ও প্রতিষ্ঠান</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-600">আইডি (ID)</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-600">ক্লাস ও ব্যাচ</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-600">অবস্থা (Status)</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-600 text-right">অ্যাকশন (Action)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="inline-flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                        <i className="fa-solid fa-folder-open text-2xl text-slate-300"></i>
                      </div>
                      <p className="text-slate-500 text-sm font-medium">ব্যাচ লোড করুন অথবা আইডি দিয়ে স্টুডেন্ট খুঁজুন।</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}


