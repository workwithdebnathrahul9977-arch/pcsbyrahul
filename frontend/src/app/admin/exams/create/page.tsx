'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({ classes: [], batches: [], subjects: [], categories: [] });

  const [formData, setFormData] = useState({
    title: '',
    topicName: '',
    academicClassId: '',
    batchId: '', // Ideally we support multiple batches based on UI, but sticking to single for simplicity unless needed
    batchesString: '',
    academicSubjectId: '',
    examCategoryId: '',
    date: '',
    showMarksTitle: true,
    hasMcq: false,
    hasCq: false,
    hasWritten: false,
    mcqEnableNegative: false,
    mcqNegativeMark: '',
    cqEnableNegative: false,
    cqNegativeMark: '',
  });

  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/subjects`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/exams/categories`).catch(() => ({ data: [] }))
    ]).then(([c, b, s, cat]) => {
      setMeta({ classes: c.data, batches: b.data, subjects: s.data, categories: cat.data });
    });
  }, []);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBatchToggle = (batchId: string) => {
    setSelectedBatches(prev => 
      prev.includes(batchId) ? prev.filter(id => id !== batchId) : [...prev, batchId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedBatchNames = meta.batches
        .filter((b: any) => selectedBatches.includes(b.id))
        .map((b: any) => b.name)
        .join(', ');

      await axios.post(`${API}/api/exams`, {
        ...formData,
        batchId: selectedBatches.length === 1 ? selectedBatches[0] : null,
        batches: selectedBatchNames,
        totalMark: 100, 
        mcqMark: formData.hasMcq ? 50 : 0,
        cqMark: formData.hasCq ? 50 : 0,
        writtenMark: formData.hasWritten ? 50 : 0
      });
      alert('Exam Created Successfully');
      router.push('/admin/exams');
    } catch (error) {
      console.error(error);
      alert('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans">
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-green-700">Create a New Exam</h1>
      </div>

      <div className="bg-slate-100 rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-4xl mx-auto">
        <h2 className="text-lg font-bold text-green-700 mb-6">New Exam Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Name</label>
            <input 
              type="text" name="title" required
              value={formData.title} onChange={handleChange}
              className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Topic Name</label>
            <input 
              type="text" name="topicName"
              value={formData.topicName} onChange={handleChange}
              className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Class</label>
            <select name="academicClassId" value={formData.academicClassId} onChange={handleChange} className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white">
              <option value="">Select Class</option>
              {meta.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Batches</label>
            <div className="border border-slate-300 rounded bg-white p-3 max-h-48 overflow-y-auto space-y-2">
              {meta.batches.map((b: any) => (
                <label key={b.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={selectedBatches.includes(b.id)}
                    onChange={() => handleBatchToggle(b.id)}
                    className="rounded text-green-500"
                  />
                  {b.name}
                </label>
              ))}
              {meta.batches.length === 0 && <span className="text-xs text-slate-400">No batches available</span>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Subject</label>
            <select name="academicSubjectId" value={formData.academicSubjectId} onChange={handleChange} className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white">
              <option value="">Select subject</option>
              {meta.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Category</label>
            <select name="examCategoryId" value={formData.examCategoryId} onChange={handleChange} className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white">
              <option value="">Select categories</option>
              {meta.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Date</label>
            <input 
              type="date" name="date" required
              value={formData.date} onChange={handleChange}
              className="w-full border border-slate-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-green-500 outline-none bg-white text-slate-700" 
            />
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox" id="showMarksTitle" name="showMarksTitle"
              checked={formData.showMarksTitle} onChange={handleChange}
              className="rounded text-blue-600"
            />
            <label htmlFor="showMarksTitle" className="text-xs font-bold text-slate-800">Show Marks Title</label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">Select Marks Fields</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* MCQ Panel */}
            <div className="bg-red-50/50 border border-red-200 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="hasMcq" checked={formData.hasMcq} onChange={handleChange} className="rounded border-red-300 text-red-500" />
                <span className="text-sm font-bold text-slate-700">Enable MCQ</span>
              </div>
              {formData.hasMcq && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">MCQ Total Marks</label>
                    <input type="number" name="mcqMark" value={formData.mcqMark} onChange={handleChange} className="w-full border border-red-300 rounded px-3 py-2 text-sm outline-none bg-white" />
                  </div>
                  <div className="p-2 border border-red-200 bg-white/50 rounded flex items-center gap-2">
                    <input type="checkbox" className="rounded" /> <span className="text-xs font-bold text-emerald-600">Enable Pass Marks?</span>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded space-y-2">
                    <label className="block text-xs font-bold text-slate-600">Each Right Answer Marks *</label>
                    <input type="text" placeholder="e.g. 1" className="w-full border border-emerald-300 rounded px-3 py-2 text-sm outline-none bg-white" />
                  </div>
                  <div className="border border-red-200 bg-white/50 rounded p-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="mcqEnableNegative" checked={formData.mcqEnableNegative} onChange={handleChange} className="rounded border-red-400 text-red-600" /> 
                      <span className="text-xs font-bold text-red-600">Enable Negative Marking?</span>
                    </label>
                    {formData.mcqEnableNegative && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Negative Marks per Wrong Answer *</label>
                        <input type="number" step="0.01" name="mcqNegativeMark" value={formData.mcqNegativeMark} onChange={handleChange} placeholder="e.g. 0.25" className="w-full border border-red-200 rounded px-3 py-2 text-sm outline-none bg-white focus:border-red-400" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* CQ Panel */}
            <div className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-lg space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <input type="checkbox" name="hasCq" checked={formData.hasCq} onChange={handleChange} className="rounded border-emerald-300 text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">Enable CQ</span>
              </div>
              {formData.hasCq && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">CQ Total Marks</label>
                    <input type="number" name="cqMark" value={formData.cqMark} onChange={handleChange} className="w-full border border-emerald-300 rounded px-3 py-2 text-sm outline-none bg-white" />
                  </div>
                  <div className="p-2 border border-emerald-200 bg-white/50 rounded flex items-center gap-2">
                    <input type="checkbox" className="rounded" /> <span className="text-xs font-bold text-emerald-600">Enable Pass Marks?</span>
                  </div>
                  <div className="bg-emerald-50/50 border border-emerald-200 p-3 rounded space-y-2">
                    <label className="block text-xs font-bold text-slate-600">Each Right Answer Marks *</label>
                    <input type="text" placeholder="e.g. 10" className="w-full border border-emerald-300 rounded px-3 py-2 text-sm outline-none bg-white" />
                  </div>
                  <div className="border border-red-200 bg-white/50 rounded p-3 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" name="cqEnableNegative" checked={formData.cqEnableNegative} onChange={handleChange} className="rounded border-red-400 text-red-600" /> 
                      <span className="text-xs font-bold text-red-600">Enable Negative Marking?</span>
                    </label>
                    {formData.cqEnableNegative && (
                      <div className="pt-2">
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">Negative Marks per Wrong Answer *</label>
                        <input type="number" step="0.01" name="cqNegativeMark" value={formData.cqNegativeMark} onChange={handleChange} placeholder="e.g. 0.5" className="w-full border border-red-200 rounded px-3 py-2 text-sm outline-none bg-white focus:border-red-400" />
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
            <div className="flex items-center gap-4 mt-4">
              <label className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded text-xs font-bold">
                <input type="checkbox" name="hasWritten" checked={formData.hasWritten} onChange={handleChange} className="rounded border-yellow-300 text-yellow-500" /> Written
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button type="button" onClick={() => router.back()} className="px-6 py-2 bg-slate-400 hover:bg-slate-500 text-white rounded text-sm font-bold shadow-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold shadow-md transition-colors disabled:opacity-50">
              {loading ? 'Saving...' : 'Save Exam'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

