'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function DownloadAdmitCard() {
  const [formData, setFormData] = useState({ studentId: '', registrationNo: '', studentClass: '' });
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  const [classes, setClasses] = useState<any[]>([]);

  useEffect(() => {
    // Read from URL if present
    const params = new URLSearchParams(window.location.search);
    const sid = params.get('studentId');
    const reg = params.get('regNo');
    const cls = params.get('class');
    if (sid && reg) {
      setFormData({ studentId: sid, registrationNo: reg, studentClass: cls || '' });
    }

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
    if (formData.studentId && formData.registrationNo && !student) {
      const formEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSearch(formEvent);
    }
  }, [formData.studentId, formData.registrationNo]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStudent(null);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/student-info`, {
        studentId: formData.studentId,
        registrationNo: formData.registrationNo
      });
      if (data.studentClass !== formData.studentClass) {
        toast.error('Student found, but class does not match.');
      } else {
        setStudent(data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Student not found');
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
        {student && (
          <button onClick={() => setStudent(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors group">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i> Back to search
          </button>
        )}

        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> EXAM
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Admit Card</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">Download and print your official examination admit card. You must bring a printed copy to the exam hall.</p>
          </div>
          
          {!student && (
            <form onSubmit={handleSearch} className="w-full xl:max-w-4xl flex flex-col md:flex-row items-end gap-4">
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Student ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-regular fa-id-badge"></i></div>
                  <input required type="text" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})} placeholder="e.g. PCS-2024-001" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                </div>
              </div>
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Class</label>
                <div className="relative">
                  <select required value={formData.studentClass} onChange={e => setFormData({...formData, studentClass: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-4 pr-10 py-3 appearance-none focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium">
                    <option value="" disabled className="font-light">Select Class</option>
                    {classes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-chevron-down text-xs"></i></div>
                </div>
              </div>
              <div className="w-full">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Registration No</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400"><i className="fa-solid fa-hashtag"></i></div>
                  <input required type="text" value={formData.registrationNo} onChange={e => setFormData({...formData, registrationNo: e.target.value})} placeholder="e.g. 7382910" className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-xl pl-11 pr-4 py-3 focus:bg-white focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all shadow-sm font-medium" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full md:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 h-[46px]">
                {loading ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-solid fa-download"></i> Get Card</>}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RESULT / ADMIT CARD PRINT VIEW */}
      <div className="max-w-[1450px] mx-auto px-5 md:px-8">
        {student && (
          <div className="animate-[fadeIn_0.5s_ease-out_forwards] mt-8 print:opacity-100 print:mt-0">
            <div className="flex justify-end mb-8 print:hidden">
              <button onClick={handlePrint} className="bg-gray-900 hover:bg-black text-white px-8 py-3 rounded-xl text-sm font-semibold transition-all shadow-[0_4px_14px_0_rgb(0,0,0,0.39)] flex items-center gap-2">
                <i className="fa-solid fa-print"></i> Print Admit Card
              </button>
            </div>
            
            {/* Printable Admit Card Design */}
            <div className="relative mx-auto w-full max-w-[400px] print:max-w-none print:w-full">
              
              {/* ============================== */}
              {/* SCREEN VIEW (Vertical Layout) */}
              {/* ============================== */}
              <div className="bg-[#fff5f5] rounded-xl shadow-lg border border-red-100 p-6 relative overflow-hidden print:hidden text-center min-h-[500px]">
                
                {/* Logo and Header */}
                <div className="relative z-10 mb-5 flex flex-col items-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 shadow-sm mb-3">
                    <img src="/logo.png" alt="Logo" className="max-w-full max-h-full rounded-full" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.insertAdjacentHTML('afterend', '<i class="fa-solid fa-graduation-cap text-3xl text-red-600"></i>'); }} />
                  </div>
                  <h1 className="text-2xl font-black text-red-700 uppercase tracking-tight">PHYSCHEMIA</h1>
                  <p className="text-red-600 text-sm font-medium mb-3">Admit Card</p>
                  
                  <div className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-xs font-bold inline-block">
                    {student.studentClass} - {student.group || 'Science'}
                  </div>
                </div>

                {/* Photo with ID Pill */}
                <div className="relative w-28 h-28 mx-auto mb-8 z-10">
                  <div className="w-full h-full bg-white overflow-hidden shadow-sm border-2 border-red-100 rounded-sm">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <i className="fa-regular fa-user text-3xl"></i>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-md whitespace-nowrap tracking-wider">
                    ID: {student.studentId}
                  </div>
                </div>

                {/* Vertical Details */}
                <div className="space-y-4 relative z-10 text-left px-2">
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-0.5">Name</p>
                    <p className="text-sm font-bold text-gray-900">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-0.5">Father's Name</p>
                    <p className="text-sm font-bold text-gray-900">{student.fatherName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-0.5">Registration No</p>
                    <p className="text-sm font-bold text-gray-900">{student.registrationNo}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-medium mb-0.5">School</p>
                    <p className="text-sm font-bold text-gray-900">{student.schoolName || 'N/A'}</p>
                  </div>
                </div>
                
                {/* Screen Watermark Center */}
                <div className="absolute top-[60%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-5 pointer-events-none w-48 h-48">
                  <img src="/logo.png" alt="Watermark" className="w-full grayscale" onError={(e) => e.currentTarget.style.display='none'} />
                </div>

                {/* Footer */}
                <div className="mt-10 pt-4 border-t border-gray-200 text-center relative z-10">
                  <p className="text-[11px] text-gray-500 font-medium mb-1">This is an official admit card for examination</p>
                  <p className="text-[10px] text-gray-400">Valid until: {student.registrationYear ? parseInt(student.registrationYear) + 1 : new Date().getFullYear() + 1}</p>
                </div>
              </div>


              {/* ============================== */}
              {/* PRINT VIEW (Horizontal Layout) */}
              {/* ============================== */}
              <div className="hidden print:block w-full border border-gray-300 p-8 relative bg-white box-border font-sans">
                {/* Print Header */}
                <div className="flex justify-between items-start mb-6 relative z-10">
                  {/* Left: Logo */}
                  <div className="w-24 h-24 rounded-full border border-gray-200 flex items-center justify-center p-1 bg-white">
                    <img src="/logo.png" alt="Logo" className="max-w-full max-h-full rounded-full" onError={(e) => { e.currentTarget.style.display='none'; e.currentTarget.insertAdjacentHTML('afterend', '<i class="fa-solid fa-graduation-cap text-4xl text-red-600"></i>'); }} />
                  </div>
                  
                  {/* Center: Title */}
                  <div className="flex-1 text-center px-4 pt-1">
                    <h1 className="text-xl font-bold text-red-600 uppercase tracking-wide">PHYSCHEMIA, MOULVIBAZAR</h1>
                    <h2 className="text-lg font-bold text-gray-900 mt-1">{student.studentClass} BATCH</h2>
                    <h3 className="text-base font-semibold text-red-600 mt-1">Year {student.registrationYear || new Date().getFullYear()}</h3>
                    <p className="text-lg text-gray-500 font-bold mt-4 tracking-widest uppercase">Admit Card</p>
                  </div>

                  {/* Right: Photo */}
                  <div className="w-24 h-32 border border-gray-300 bg-gray-50 overflow-hidden shrink-0">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <i className="fa-regular fa-user text-3xl"></i>
                      </div>
                    )}
                  </div>
                </div>

                {/* Print Watermark Center */}
                <div className="absolute top-[55%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center opacity-[0.04] pointer-events-none w-64 h-64 z-0">
                  <img src="/logo.png" alt="Watermark" className="w-full grayscale" onError={(e) => e.currentTarget.style.display='none'} />
                </div>

                {/* Print Body (2 columns) */}
                <div className="grid grid-cols-[1.2fr_1fr] gap-6 relative z-10 mb-8 mt-8">
                  <div className="space-y-3">
                    <div className="flex">
                      <span className="w-40 text-sm font-medium text-gray-700">Student's name</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.name}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-sm font-medium text-gray-700">Father's name</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.fatherName || 'N/A'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-40 text-sm font-medium text-gray-700">Educational Institution</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.schoolName || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex">
                      <span className="w-24 text-sm font-medium text-gray-700">Id No</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.studentId}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-sm font-medium text-gray-700">Reg. No</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.registrationNo}</span>
                    </div>
                    <div className="flex">
                      <span className="w-24 text-sm font-medium text-gray-700">Group</span>
                      <span className="mr-3">:</span>
                      <span className="font-bold text-gray-900 text-sm">{student.group || 'Science'}</span>
                    </div>
                  </div>
                </div>

                                {/* Print Subjects Section */}
                <div className="relative z-10 mb-16">
                  <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase">Subject code and Subject's Name</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3 w-full">
                    <div className="text-[12px] font-bold text-gray-800">101 - Bangla I</div>
                    <div className="text-[12px] font-bold text-gray-800">102 - Bangla II</div>
                    <div className="text-[12px] font-bold text-gray-800">107 - English I</div>
                    <div className="text-[12px] font-bold text-gray-800">108 - English II</div>
                    <div className="text-[12px] font-bold text-gray-800">109 - General Math</div>
                    <div className="text-[12px] font-bold text-gray-800">112 - Religion and moral education</div>
                    <div className="text-[12px] font-bold text-gray-800">126 - Higher Math</div>
                    <div className="text-[12px] font-bold text-gray-800">136 - Physics</div>
                    <div className="text-[12px] font-bold text-gray-800">137 - Chemistry</div>
                    <div className="text-[12px] font-bold text-gray-800">138 - Biology</div>
                    <div className="text-[12px] font-bold text-gray-800">150 - BGS</div>
                    <div className="text-[12px] font-bold text-gray-800">154 - ICT</div>
                  </div>
                </div>

                {/* Print Signature */}
                <div className="absolute bottom-6 right-8 text-center z-10">
                  <div className="relative mb-1">
                    <div className="text-xl font-[GreatVibes,cursive] text-gray-800 mb-1">Sumel Sir</div>
                    <div className="w-48 border-b border-gray-800 absolute bottom-0 left-1/2 -translate-x-1/2"></div>
                  </div>
                  <p className="text-[11px] font-medium text-gray-700">Director, PhysChemia</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
