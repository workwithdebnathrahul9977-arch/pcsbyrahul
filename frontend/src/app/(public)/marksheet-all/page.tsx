'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AllResultsSearch() {
  const [formData, setFormData] = useState({ studentId: '', registrationNo: '', studentClass: '', registrationYear: '' });
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/classes`);
        setClasses(data);
      } catch (error) {
        console.error('Failed to load classes', error);
      }
    };
    fetchClasses();
  }, []);

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
      handleSearch(formEvent);
    }
  }, [formData.studentId, formData.registrationNo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResultData(null);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/results/all`, formData);
      if (data.student.studentClass !== formData.studentClass) {
         toast.error('Student found, but class does not match.');
      } else {
         setResultData(data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'No results found matching these criteria');
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

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-10 mb-8">
          <div className="xl:max-w-xl">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> TRANSCRIPT
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Full Marksheet</h1>
            <p className="text-gray-500 text-sm md:text-base">View your complete academic transcript. Please provide all the required credentials below to access your full history.</p>
          </div>
          
          {!resultData && (
            <form onSubmit={handleSearch} className="w-full xl:w-auto flex-1 max-w-5xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Reg Year</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-regular fa-calendar-days"></i></div>
                    <input type="text" value={formData.registrationYear} onChange={e => setFormData({...formData, registrationYear: e.target.value})} placeholder="e.g. 2024" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Class</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-graduation-cap"></i></div>
                    <select value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-10 py-3 appearance-none focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium">
                      <option value="" disabled>Select Class</option>
                      {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registration No</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-hashtag"></i></div>
                    <input required type="text" value={formData.registrationNo} onChange={e => setFormData({...formData, registrationNo: e.target.value})} placeholder="Required" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Student ID</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-regular fa-id-badge"></i></div>
                    <input required type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="Required" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <button type="submit" disabled={loading} className="w-full lg:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-10 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 h-[46px]">
                  {loading ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-solid fa-magnifying-glass"></i> View Full Transcript</>}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* RESULT PRINT VIEW */}
        {resultData && (
          <div className="animate-[fadeIn_0.5s_ease-out_forwards] mt-8 print:opacity-100 print:mt-0">
            <div className="flex justify-end items-center mb-8 print:hidden">
              <button onClick={handlePrint} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] flex items-center gap-2">
                <i className="fa-solid fa-print"></i> Print Transcript
              </button>
            </div>
            
            {/* Printable Multiple Results */}
            <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-10 md:p-14 max-w-4xl mx-auto relative overflow-hidden print:border-none print:shadow-none print:m-0 print:w-full print:p-0 print:rounded-none">
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none print:opacity-[0.05]">
                <h1 className="text-9xl font-black rotate-[-30deg]">PHYSCHEMIA</h1>
              </div>

              {/* Header */}
              <div className="text-center border-b border-gray-100 pb-8 mb-10 relative z-10">
                <h1 className="text-3xl font-bold text-red-600 tracking-[0.2em] uppercase">PhysChemia</h1>
                <div className="inline-block bg-gray-50 border border-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase mt-4 mb-2">Complete Academic Transcript</div>
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
                  <p className="font-medium text-base">No exams found matching your criteria.</p>
                </div>
              ) : (
                <div className="relative z-10 border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left whitespace-nowrap md:whitespace-normal">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Date</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Exam Title</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100">Type</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Total Marks</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right">Obtained</th>
                        <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 text-center">Percentage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {resultData.results.map((r: any) => {
                        const percentage = ((r.marks / r.exam.totalMark) * 100).toFixed(1);
                        return (
                          <tr key={r.id}>
                            <td className="px-6 py-5 text-sm font-semibold text-gray-600 whitespace-nowrap">{new Date(r.exam.date).toLocaleDateString('en-GB')}</td>
                            <td className="px-6 py-5 font-bold text-gray-900 min-w-[150px]">{r.exam.title}</td>
                            <td className="px-6 py-5 text-xs text-gray-500 font-bold uppercase tracking-widest">{r.exam.type.replace('_', ' ')}</td>
                            <td className="px-6 py-5 text-sm font-semibold text-gray-800 text-center">{r.exam.totalMark}</td>
                            <td className="px-6 py-5 font-bold text-red-600 text-lg text-right">{r.marks}</td>
                            <td className="px-6 py-5 text-sm font-bold text-gray-700 text-center">
                              <span className="inline-block px-2 py-1 bg-gray-50 rounded-md border border-gray-100">{percentage}%</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-50 border-t border-gray-200">
                      <tr>
                        <td colSpan={3} className="px-6 py-5 text-right text-[11px] font-bold text-gray-400 uppercase tracking-widest">Overall Total:</td>
                        <td className="px-6 py-5 text-center font-bold text-gray-800 text-lg">{resultData.results.reduce((sum: number, r: any) => sum + r.exam.totalMark, 0)}</td>
                        <td className="px-6 py-5 text-right font-bold text-red-600 text-2xl">{resultData.results.reduce((sum: number, r: any) => sum + r.marks, 0)}</td>
                        <td className="px-6 py-5 text-center">
                          {(() => {
                            const totalPossible = resultData.results.reduce((sum: number, r: any) => sum + r.exam.totalMark, 0);
                            const totalObtained = resultData.results.reduce((sum: number, r: any) => sum + r.marks, 0);
                            const overallPercentage = totalPossible ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0';
                            return (
                              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-md border border-green-100 font-bold">
                                {overallPercentage}%
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    </tfoot>
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
