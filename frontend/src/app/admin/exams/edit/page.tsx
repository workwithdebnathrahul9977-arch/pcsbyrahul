'use client';
import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

function EditExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [meta, setMeta] = useState({ classes: [], batches: [], subjects: [], categories: [] });

  const [formData, setFormData] = useState({
    title: '',
    topicName: '',
    academicClassId: '',
    batchId: '',
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
    mcqMark: 0,
    cqMark: 0,
    writtenMark: 0,
    totalMark: 0,
  });

  const [selectedBatches, setSelectedBatches] = useState<string[]>([]);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!examId) return;

    Promise.all([
      axios.get(`${API}/api/academic/classes`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/batches`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/academic/subjects`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/exams/categories`).catch(() => ({ data: [] })),
      axios.get(`${API}/api/exams/${examId}`).catch(() => ({ data: null }))
    ]).then(([c, b, s, cat, exam]) => {
      const bData = b.data;
      setMeta({ classes: c.data, batches: bData, subjects: s.data, categories: cat.data });
      
      const eData = exam.data;
      if (eData) {
        setFormData({
          title: eData.title || '',
          topicName: eData.topicName || '',
          academicClassId: eData.academicClassId || '',
          batchId: eData.batchId || '',
          batchesString: eData.batches || '',
          academicSubjectId: eData.academicSubjectId || '',
          examCategoryId: eData.examCategoryId || '',
          date: eData.date ? new Date(eData.date).toISOString().split('T')[0] : '',
          showMarksTitle: eData.showMarksTitle !== false,
          hasMcq: eData.hasMcq || false,
          hasCq: eData.hasCq || false,
          hasWritten: eData.hasWritten || false,
          mcqEnableNegative: eData.mcqEnableNegative || false,
          mcqNegativeMark: eData.mcqNegativeMark || '',
          cqEnableNegative: eData.cqEnableNegative || false,
          cqNegativeMark: eData.cqNegativeMark || '',
          mcqMark: eData.mcqMark || 0,
          cqMark: eData.cqMark || 0,
          writtenMark: eData.writtenMark || 0,
          totalMark: eData.totalMark || 0,
        });

        // Parse existing selected batches
        if (eData.batches) {
          const names = eData.batches.split(',').map((n: string) => n.trim());
          const matchingBatches = bData.filter((bObj: any) => names.includes(bObj.name)).map((bObj: any) => bObj.id);
          setSelectedBatches(matchingBatches);
        } else if (eData.batchId) {
          setSelectedBatches([eData.batchId]);
        }
      }
      setLoading(false);
    });
  }, [examId]);

  // Recalculate total marks when sections change
  useEffect(() => {
    const total = 
      (formData.hasMcq ? Number(formData.mcqMark) : 0) + 
      (formData.hasCq ? Number(formData.cqMark) : 0) + 
      (formData.hasWritten ? Number(formData.writtenMark) : 0);
    setFormData(prev => ({ ...prev, totalMark: total }));
  }, [formData.hasMcq, formData.mcqMark, formData.hasCq, formData.cqMark, formData.hasWritten, formData.writtenMark]);

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
    setSaving(true);
    try {
      const selectedBatchNames = meta.batches
        .filter((b: any) => selectedBatches.includes(b.id))
        .map((b: any) => b.name)
        .join(', ');

      await axios.put(`${API}/api/exams/${examId}`, {
        ...formData,
        batchId: selectedBatches.length === 1 ? selectedBatches[0] : null,
        batches: selectedBatchNames,
      });
      alert('Exam Updated Successfully');
      router.push('/admin/exams');
    } catch (error) {
      console.error(error);
      alert('Failed to update exam');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-[1400px] mx-auto font-sans">
      
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-green-700">Edit Exam</h1>
      </div>

      <div className="bg-[#f0eaff] rounded-xl shadow-sm border border-purple-200 p-6 md:p-8 max-w-5xl mx-auto">
        <h2 className="text-lg font-bold text-teal-700 mb-6">Edit Exam Details</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Name</label>
              <input 
                type="text" name="title" required
                value={formData.title} onChange={handleChange}
                className="w-full border border-emerald-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-700 font-bold" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Topic Name</label>
              <input 
                type="text" name="topicName"
                value={formData.topicName} onChange={handleChange}
                className="w-full border border-red-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-red-500 outline-none bg-white text-slate-700" 
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Class</label>
              <select name="academicClassId" value={formData.academicClassId} onChange={handleChange} className="w-full border border-yellow-400 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-yellow-500 outline-none bg-white text-slate-700">
                <option value="">Select Class</option>
                {meta.classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Batches</label>
              <div className="border border-blue-300 rounded bg-white p-3 max-h-48 overflow-y-auto space-y-2">
                {meta.batches.map((b: any) => (
                  <label key={b.id} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer font-normal">
                    <input 
                      type="checkbox" 
                      checked={selectedBatches.includes(b.id)}
                      onChange={() => handleBatchToggle(b.id)}
                      className="rounded text-blue-500"
                    />
                    {b.name}
                  </label>
                ))}
                {meta.batches.length === 0 && <span className="text-xs text-slate-400">No batches available</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Subject</label>
              <select name="academicSubjectId" value={formData.academicSubjectId} onChange={handleChange} className="w-full border border-emerald-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-emerald-500 outline-none bg-white text-slate-700">
                <option value="">Select subject</option>
                {meta.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Category</label>
              <select name="examCategoryId" value={formData.examCategoryId} onChange={handleChange} className="w-full border border-red-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-red-500 outline-none bg-white text-slate-700">
                <option value="">Select categories</option>
                {meta.categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Exam Date</label>
            <input 
              type="date" name="date" required
              value={formData.date} onChange={handleChange}
              className="w-full border border-blue-300 rounded px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none bg-white text-slate-700" 
            />
          </div>

          <div className="p-4 bg-white/50 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" id="showMarksTitle" name="showMarksTitle"
                checked={formData.showMarksTitle} onChange={handleChange}
                className="mt-1 rounded text-blue-600"
              />
              <div>
                <label htmlFor="showMarksTitle" className="text-sm font-bold text-slate-800">Show Marks Title (MCQ, CQ, Written) in Result PDF</label>
                <p className="text-xs text-slate-500 mt-0.5">If unchecked, only total marks will be shown in result report.</p>
              </div>
            </div>
          </div>

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

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Total Marks</label>
            <input 
              type="number" readOnly
              value={formData.totalMark}
              className="w-full border border-slate-300 rounded px-4 py-2 text-sm bg-white text-slate-700 font-bold" 
            />
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-lg space-y-3">
            <h3 className="text-sm font-bold text-slate-700 mb-2">Show Grading Result System Setting</h3>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-sm font-bold text-slate-700">Show Grading System Result as Percentage (%)</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
              <span className="text-sm font-bold text-slate-700">Show Grading System Result as Grade / GPA</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-purple-200">
            <button type="button" onClick={() => router.back()} className="px-6 py-2.5 bg-slate-400 hover:bg-slate-500 text-white rounded text-sm font-bold shadow-sm transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-bold shadow-md transition-colors disabled:opacity-50">
              {saving ? 'Updating...' : 'Update Exam'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default function EditExamPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-sans">Loading...</div>}>
      <EditExamContent />
    </Suspense>
  );
}
