'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

function MarksEntryContent() {
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');

  const [exam, setExam] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [marksData, setMarksData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (examId) {
      fetchExamAndStudents();
    } else {
      setLoading(false);
    }
  }, [examId]);

  const fetchExamAndStudents = async () => {
    setLoading(true);
    try {
      const [examRes, studentsRes] = await Promise.all([
        axios.get(`${API}/api/exams/${examId}`),
        axios.get(`${API}/api/exams/${examId}/students`)
      ]);
      setExam(examRes.data);
      setStudents(studentsRes.data || []);
      
      const initialMarks: Record<string, any> = {};
      (studentsRes.data || []).forEach((s: any) => {
        initialMarks[s.user.id] = {
          mcqMarks: s.result?.mcqMarks || '',
          cqMarks: s.result?.cqMarks || '',
          writtenMarks: s.result?.writtenMarks || '',
          isPresent: s.result ? s.result.isPresent : true
        };
      });
      setMarksData(initialMarks);
    } catch (e) {
      console.error(e);
      alert('Failed to load exam data');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (userId: string, field: string, value: any) => {
    setMarksData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const saveResults = async () => {
    setSaving(true);
    try {
      const payload = Object.keys(marksData).map(userId => {
        const m = marksData[userId];
        const isEmpty = m.mcqMarks === '' && m.cqMarks === '' && m.writtenMarks === '';
        return {
          userId,
          mcqMarks: parseFloat(m.mcqMarks) || 0,
          cqMarks: parseFloat(m.cqMarks) || 0,
          writtenMarks: parseFloat(m.writtenMarks) || 0,
          isPresent: isEmpty ? false : m.isPresent
        };
      });
      
      await axios.post(`${API}/api/exams/${examId}/marks`, { marks: payload });
      alert('Results saved successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to save results');
    } finally {
      setSaving(false);
    }
  };

  // Calculate percentage and grade just for display
  const calculateGrade = (userId: string) => {
    if (!exam || !exam.totalMark) return { pct: 'N/A', gpa: 'N/A', status: 'N/A' };
    const m = marksData[userId];
    if (!m.isPresent) return { pct: 'N/A', gpa: 'N/A', status: 'Absent' };
    
    const totalObtained = (parseFloat(m.mcqMarks) || 0) + (parseFloat(m.cqMarks) || 0) + (parseFloat(m.writtenMarks) || 0);
    const pct = (totalObtained / exam.totalMark) * 100;
    
    let gpa = 'F';
    let status = 'Fail';
    if (pct >= 80) { gpa = 'A+'; status = 'Pass'; }
    else if (pct >= 70) { gpa = 'A'; status = 'Pass'; }
    else if (pct >= 60) { gpa = 'A-'; status = 'Pass'; }
    else if (pct >= 50) { gpa = 'B'; status = 'Pass'; }
    else if (pct >= 40) { gpa = 'C'; status = 'Pass'; }
    else if (pct >= 33) { gpa = 'D'; status = 'Pass'; }
    
    return { pct: pct.toFixed(2) + '%', gpa, status };
  };

  if (!examId) return <div className="p-8 text-center text-slate-500 font-sans">No Exam ID provided.</div>;
  if (loading) return <div className="p-8 text-center text-slate-500 font-sans">Loading...</div>;
  if (!exam) return <div className="p-8 text-center text-slate-500 font-sans">Exam not found.</div>;

  return (
    <div className="max-w-[1600px] mx-auto bg-slate-50 font-sans">
      
      {/* Exam Information Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex items-center gap-2 text-slate-600 font-bold mb-4">
          <i className="fa-regular fa-clock"></i> Exam Information
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-clock text-blue-400"></i>
            <span className="text-xs text-slate-500">Exam Name:</span>
            <span className="text-sm font-bold text-slate-700 truncate">{exam.title}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-circle text-red-400"></i>
            <span className="text-xs text-slate-500">Topic:</span>
            <span className="text-sm font-bold text-slate-700 truncate">{exam.topicName || 'N/A'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-grip-lines text-emerald-400"></i>
            <span className="text-xs text-slate-500">Class:</span>
            <span className="text-sm font-bold text-slate-700">{exam.academicClass?.name || 'N/A'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-solid fa-check text-orange-400"></i>
            <span className="text-xs text-slate-500">Batches:</span>
            <span className="text-sm font-bold text-slate-700 truncate">{exam.batches || exam.batch?.name || 'N/A'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-circle text-purple-400"></i>
            <span className="text-xs text-slate-500">Subject:</span>
            <span className="text-sm font-bold text-slate-700">{exam.academicSubject?.name || 'N/A'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-clock text-blue-400"></i>
            <span className="text-xs text-slate-500">MCQ Pass Marks:</span>
            <span className="text-sm font-bold text-red-500">/{exam.mcqMark || 0}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-clock text-purple-400"></i>
            <span className="text-xs text-slate-500">CQ Pass Marks:</span>
            <span className="text-sm font-bold text-red-500">/{exam.cqMark || 0}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded border border-slate-100 flex items-center gap-2">
            <i className="fa-regular fa-clock text-purple-400"></i>
            <span className="text-xs text-slate-500">Total Marks:</span>
            <span className="text-sm font-bold text-red-500">{exam.totalMark || 0}</span>
          </div>
        </div>
      </div>

      {/* Marks Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-search text-blue-500"></i>
              <input type="text" placeholder="Search by Name" className="border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div className="flex items-center gap-2">
              <i className="fa-solid fa-id-card text-purple-500"></i>
              <input type="text" placeholder="Search by Registration ID" className="border border-slate-200 rounded px-3 py-1.5 text-sm outline-none focus:border-purple-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded text-sm font-bold text-slate-600 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-columns"></i> Columns
            </button>
            <button onClick={saveResults} disabled={saving} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-sm font-bold shadow transition-colors flex items-center gap-2">
              <i className="fa-solid fa-save"></i> {saving ? 'Saving...' : 'Save Result'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold">
                <th className="px-4 py-3 w-12">#</th>
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3">Reg. ID</th>
                <th className="px-4 py-3">
                  MCQ Section <span className="block text-[10px] text-slate-400 font-normal">Obt.</span>
                </th>
                <th className="px-4 py-3">
                  CQ Section <span className="block text-[10px] text-slate-400 font-normal">Obt.</span>
                </th>
                {exam.hasWritten && (
                  <th className="px-4 py-3">
                    Written Section <span className="block text-[10px] text-slate-400 font-normal">Obt.</span>
                  </th>
                )}
                <th className="px-4 py-3">Grade (%)</th>
                <th className="px-4 py-3">GPA</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">
                  Absent
                  <span className="block text-[10px] text-slate-400 font-normal">All</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length === 0 ? (
                <tr><td colSpan={exam.hasWritten ? 10 : 9} className="px-4 py-8 text-slate-500">No students found.</td></tr>
              ) : (
                students.map((s, i) => {
                  const uId = s.user.id;
                  const marks = marksData[uId] || {};
                  const isAbsent = !marks.isPresent;
                  const { pct, gpa, status } = calculateGrade(uId);

                  return (
                    <tr key={uId} className={`hover:bg-slate-50 transition-colors ${isAbsent ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-3 text-sm text-slate-500">{i + 1}</td>
                      <td className="px-4 py-3 text-sm font-bold text-slate-700 text-left">{s.user.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">{s.user.phone}</td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={marks.mcqMarks} 
                          onChange={(e) => handleMarkChange(uId, 'mcqMarks', e.target.value)}
                          disabled={isAbsent || !exam.hasMcq}
                          className="w-16 border border-blue-200 rounded px-2 py-1 text-sm text-center outline-none focus:border-blue-400 disabled:bg-slate-100" 
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input 
                          type="number" 
                          value={marks.cqMarks} 
                          onChange={(e) => handleMarkChange(uId, 'cqMarks', e.target.value)}
                          disabled={isAbsent || !exam.hasCq}
                          className="w-16 border border-emerald-200 rounded px-2 py-1 text-sm text-center outline-none focus:border-emerald-400 disabled:bg-slate-100" 
                        />
                      </td>
                      {exam.hasWritten && (
                        <td className="px-4 py-3">
                          <input 
                            type="number" 
                            value={marks.writtenMarks} 
                            onChange={(e) => handleMarkChange(uId, 'writtenMarks', e.target.value)}
                            disabled={isAbsent}
                            className="w-16 border border-yellow-200 rounded px-2 py-1 text-sm text-center outline-none focus:border-yellow-400 disabled:bg-slate-100" 
                          />
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="border border-slate-200 bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded inline-block w-20">
                          {pct}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="border border-slate-200 bg-slate-50 text-slate-600 text-xs px-2 py-1 rounded inline-block w-12 font-bold">
                          {gpa}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {isAbsent ? (
                          <span className="px-3 py-1 rounded text-[10px] font-bold border border-yellow-400 text-yellow-600 bg-yellow-50">Absent</span>
                        ) : status === 'Pass' ? (
                          <span className="px-3 py-1 rounded text-[10px] font-bold border border-emerald-400 text-emerald-600 bg-emerald-50">Pass</span>
                        ) : (
                          <span className="px-3 py-1 rounded text-[10px] font-bold border border-red-400 text-red-600 bg-red-50">Fail</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={isAbsent} 
                            onChange={(e) => handleMarkChange(uId, 'isPresent', !e.target.checked)} 
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500"></div>
                        </label>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function MarksEntryPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500 font-sans">Loading...</div>}>
      <MarksEntryContent />
    </Suspense>
  );
}
