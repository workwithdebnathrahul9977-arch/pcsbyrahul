'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function StudentInfoSearch() {
  const [formData, setFormData] = useState({ studentId: '', registrationNo: '' });
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStudent(null);
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/public/student-info`, formData);
      setStudent(data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Student not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      
      {/* PAGE HEADER & SEARCH SECTION */}
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {student && (
          <button onClick={() => setStudent(null)} className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-red-600 transition-colors group">
            <i className="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i> Back to search
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> PROFILE
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">Student Profile</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">Access your complete academic record, current status, and personal details by providing your unique credentials.</p>
          </div>
          
          {!student && (
            <form onSubmit={handleSearch} className="w-full md:max-w-2xl flex flex-col sm:flex-row items-end gap-4">
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
              <button type="submit" disabled={loading} className="w-full sm:w-auto shrink-0 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm px-8 py-3 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(220,38,38,0.39)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.23)] hover:-translate-y-0.5 flex items-center justify-center gap-2 h-[46px]">
                {loading ? <i className="fa-solid fa-spinner fa-spin text-lg"></i> : <><i className="fa-solid fa-magnifying-glass"></i> Search</>}
              </button>
            </form>
          )}
        </div>

        {/* RESULTS AREA */}
        {student && (
          <div className="animate-[fadeIn_0.5s_ease-out_forwards] mt-8">
            
            {/* Full Width Layout for Result */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Basic Info */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] bg-gray-50 border border-gray-100 overflow-hidden mb-6 shadow-sm mx-auto lg:mx-0">
                    <img src={student.photoUrl || 'https://via.placeholder.com/150'} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center lg:text-left">{student.name}</h2>
                  <p className="text-red-600 font-semibold tracking-wide text-sm text-center lg:text-left">{student.studentId}</p>
                  
                  <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 bg-green-50/80 border border-green-100 px-4 py-2 rounded-full w-fit mx-auto lg:mx-0">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-green-700 text-xs font-bold uppercase tracking-widest">Active Student</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Info Grid */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-[0_2px_20px_rgb(0,0,0,0.02)]">
                  <h3 className="text-lg font-bold text-gray-800 border-b border-gray-50 pb-4 mb-8">Academic & Personal Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Registration No</p>
                      <p className="text-gray-800 font-semibold">{student.registrationNo}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Class</p>
                      <p className="text-gray-800 font-semibold">{student.studentClass || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Blood Group</p>
                      <p className="text-red-500 font-bold">{student.bloodGroup || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Phone Number</p>
                      <p className="text-gray-800 font-semibold">{student.phone || '—'}</p>
                    </div>
                    <div className="sm:col-span-2 md:col-span-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Institution</p>
                      <p className="text-gray-800 font-semibold">{student.schoolName || '—'}</p>
                    </div>
                    <div className="sm:col-span-2 md:col-span-3 border-t border-gray-50 pt-8 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Father's Name</p>
                        <p className="text-gray-800 font-semibold">{student.fatherName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Mother's Name</p>
                        <p className="text-gray-800 font-semibold">{student.motherName || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
