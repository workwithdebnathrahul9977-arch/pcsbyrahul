'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SingleResultSearch() {
  const [formData, setFormData] = useState({ studentId: '', registrationNo: '', date: '' });
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('studentId');
    const reg = params.get('regNo');
    if (sid && reg) {
      setFormData(prev => ({ ...prev, studentId: sid, registrationNo: reg }));
    }
  }, []);

  useEffect(() => {
    if (formData.studentId && formData.registrationNo && !resultData) {
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      // We also need exam date/id, wait. 
      // Actually, if we just set the form data, they still need to select the exam from the dropdown? Wait, `marksheet/page.tsx` requires `date` or `examId`?
      // Let's not auto-fetch if we need date, just pre-fill!
    }
  }, [formData.studentId, formData.registrationNo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultData(null);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/results/single`, formData);
      setResultData(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Result not found');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans print:bg-white print:p-0 print:m-0">
      
      {/* PAGE HEADER & SEARCH SECTION */}
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16 print:hidden">
        
        {resultData && (
          <button onClick={() => setResultData(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors group">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i> Back to search
          </button>
        )}

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> SCORE
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Single Marksheet</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">Check your result for a specific exam date. Provide your credentials and the exact date of the exam to view your marksheet.</p>
          </div>
          
          {!resultData && (
            <form onSubmit={handleSearch} className="w-full xl:max-w-4xl flex flex-col md:flex-row items-end gap-4">
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Student ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-regular fa-id-badge"></i></div>
                  <input required type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="e.g. PCS-2024-001" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registration No</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-hashtag"></i></div>
                  <input required type="text" value={formData.registrationNo} onChange={e => setFormData({...formData, registrationNo: e.target.value})} placeholder="e.g. 7382910" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Exam Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-regular fa-calendar"></i></div>
                  <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full md:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 h-[46px]">
                {loading ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-solid fa-magnifying-glass"></i> View Result</>}
              </button>
            </form>
          )}
        </div>

        {/* RESULT PRINT VIEW */}
        {resultData && (
          <div className="animate-[fadeIn_0.5s_ease-out_forwards] mt-8 print:opacity-100 print:mt-0">
            <div className="flex justify-end items-center mb-8 print:hidden">
              <button onClick={handlePrint} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] flex items-center gap-2">
                <i className="fa-solid fa-print"></i> Print Marksheet
              </button>
            </div>
            
            {/* Printable Single Result */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-10 md:p-14 max-w-3xl mx-auto relative overflow-hidden print:border-none print:shadow-none print:m-0 print:w-full print:p-0 print:rounded-none">
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none print:opacity-[0.05]">
                <h1 className="text-9xl font-black rotate-[-30deg]">PHYSCHEMIA</h1>
              </div>

              {/* Header */}
              <div className="text-center border-b border-gray-100 pb-8 mb-10 relative z-10">
                <h1 className="text-3xl font-bold text-red-600 tracking-[0.2em] uppercase">PhysChemia</h1>
                <div className="inline-block bg-gray-50 border border-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mt-4 mb-2">Single Exam Result Sheet</div>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between mb-10 gap-6 relative z-10">
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Student Details</p>
                  <p className="font-bold text-gray-900 text-lg mb-1">{resultData.student.name}</p>
                  <p className="text-sm font-semibold text-gray-600">Class: {resultData.student.studentClass}</p>
                </div>
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 flex-1 md:text-right flex flex-col md:items-end justify-center">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2">Identification</p>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Reg No: {resultData.student.registrationNo}</p>
                  <p className="text-sm font-semibold text-gray-800">Student ID: {resultData.student.studentId}</p>
                </div>
              </div>

              {resultData.results.length === 0 ? (
                <div className="text-center py-16 text-gray-400 bg-gray-50 rounded-2xl border border-gray-100 relative z-10">
                  <i className="fa-regular fa-folder-open text-4xl mb-4"></i>
                  <p className="font-medium text-base">No exams found for this date.</p>
                </div>
              ) : (
                <div className="relative z-10 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Exam Title</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Total Marks</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Obtained Marks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {resultData.results.map((r: any) => (
                        <tr key={r.id}>
                          <td className="px-6 py-5">
                            <span className="font-bold text-gray-900 block">{r.exam.title}</span>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{r.exam.type?.replace('_', ' ') || '—'}</span>
                          </td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-600">{new Date(r.exam.date).toLocaleDateString('en-GB')}</td>
                          <td className="px-6 py-5 text-sm font-semibold text-gray-800">{r.exam.totalMark}</td>
                          <td className="px-6 py-5 text-right font-bold text-red-600 text-lg">{r.marks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
