'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function InfoRow({ icon, label, value, iconColor = 'text-blue-500' }: any) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 transition-colors rounded-xl px-2 -mx-2">
      <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100 ${iconColor}`}>
        <i className={`${icon} text-[15px]`}></i>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-[15px] font-medium text-gray-800 truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  return (
    <div className="bg-white rounded-[24px] p-5 md:p-6 shadow-[0_2px_15px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-start hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300">
      <div className={`w-12 h-12 rounded-[14px] ${color.bg} flex items-center justify-center mb-4`}>
        <i className={`${icon} text-lg ${color.icon}`}></i>
      </div>
      <p className="text-[22px] md:text-[26px] font-bold text-gray-800 tracking-tight leading-none mb-1.5">{value}</p>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function gradeFromPct(pct: number) {
  if (pct >= 80) return { grade: 'A+', color: 'text-emerald-600', bg: 'bg-emerald-50' };
  if (pct >= 70) return { grade: 'A', color: 'text-emerald-500', bg: 'bg-emerald-50' };
  if (pct >= 60) return { grade: 'A-', color: 'text-teal-500', bg: 'bg-teal-50' };
  if (pct >= 50) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
  if (pct >= 40) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' };
  if (pct >= 33) return { grade: 'D', color: 'text-orange-500', bg: 'bg-orange-50' };
  return { grade: 'F', color: 'text-red-600', bg: 'bg-red-50' };
}

export default function UserDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'payments' | 'attendance'>('overview');
  
  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    axios.get(`${API}/api/user/dashboard`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setUserData(res.data);
        setEditFormData({
          name: res.data.name || '',
          dob: res.data.dob || '',
          bloodGroup: res.data.bloodGroup || '',
          presentAddress: res.data.presentAddress || '',
          permanentAddress: res.data.permanentAddress || '',
          schoolName: res.data.schoolName || '',
          religion: res.data.religion || '',
          gender: res.data.gender || '',
          whatsapp: res.data.whatsapp || '',
        });
      })
      .catch(err => {
        console.error(err);
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  const handleEditChange = (e: any) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(`${API}/api/user/profile`, editFormData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserData((prev: any) => ({ ...prev, ...data }));
      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f5f9]">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mb-4 shadow-sm"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!userData) return null;

  const regId = userData.registrationNo || userData.studentId || '—';
  const joinYear = userData.createdAt ? new Date(userData.createdAt).getFullYear() : '—';
  const totalCourses = userData.enrollments?.length || 0;
  const pendingDues = userData.payments?.filter((p: any) => ['PENDING', 'OVERDUE'].includes(p.status)).length || 0;
  const examResults = userData.ExamResult || [];
  const attendanceRecords = userData.attendanceRecords || userData.attendances || [];
  const presentDays = attendanceRecords.filter((a: any) => a.status === 'PRESENT').length;
  const attendancePct = attendanceRecords.length > 0 ? Math.round((presentDays / attendanceRecords.length) * 100) : 0;

  const latestResult = examResults[0];
  let latestPct = 0;
  let latestGrade = { grade: 'N/A', color: 'text-gray-400', bg: 'bg-gray-50' };
  if (latestResult && latestResult.exam?.totalMark > 0) {
    latestPct = (latestResult.totalMarks / latestResult.exam.totalMark) * 100;
    latestGrade = gradeFromPct(latestPct);
  }

  return (
    <div className="bg-[#f4f5f9] min-h-screen pb-24 font-sans selection:bg-red-100 selection:text-red-900">
      
      {/* ── BANNER ─────────────────────────────────────────── */}
      <div className="relative h-[160px] md:h-[220px] w-full bg-cover bg-center" style={{ backgroundImage: "url('/dashboard-bg.jpg')" }}>
        <div className="absolute inset-0 bg-red-900/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-red-900/90 to-red-800/40"></div>
        
        <div className="max-w-[1450px] mx-auto px-5 md:px-8 h-full relative">
          
          {/* Avatar (Inside the banner, aligned with text) */}
          <div className="absolute bottom-3 md:bottom-6 left-5 md:left-8 z-30 shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-[4px] md:border-[5px] border-[#f4f5f9] overflow-hidden bg-white shadow-md">
              {userData.photoUrl ? (
                <img src={userData.photoUrl} alt={userData.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-red-100 flex items-center justify-center text-4xl font-bold text-red-500">
                  {userData.name?.charAt(0)?.toUpperCase()}
                </div>
              )}
            </div>
            <div className={`absolute bottom-2 right-1 md:right-2 w-4 h-4 md:w-5 md:h-5 rounded-full border-[3px] border-[#f4f5f9] ${userData.isActive ? 'bg-[#10b981]' : 'bg-red-500'}`}></div>
          </div>
          
          {/* User Details (Inside the banner) */}
          <div className="absolute bottom-4 md:bottom-6 left-[125px] md:left-[175px] right-5 md:right-8 z-20 text-white">
            <h1 className="text-xl md:text-3xl font-bold tracking-tight truncate">{userData.name}</h1>
            <p className="text-red-100 text-xs md:text-sm mt-0.5 mb-2.5 truncate">{userData.email || 'No email provided'}</p>
            <button onClick={() => setIsEditModalOpen(true)} className="px-5 py-1.5 bg-white/20 hover:bg-white/30 border border-white/20 rounded-full text-xs font-semibold backdrop-blur-md transition-all">
              Edit Profile
            </button>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); router.push('/login'); }}
            className="absolute top-6 right-5 md:right-8 bg-black/20 hover:bg-black/40 border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-2 z-20"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ── MAIN CONTENT ────────────────────────────────────── */}
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-6 md:pt-8">
        
        <div className="flex flex-col xl:flex-row gap-6">
          
          {/* LEFT SIDE (Stats & Tabs) */}
          <div className="flex-1 overflow-hidden">

            {/* TABS MENU */}
            <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] gap-2 mb-8 bg-white p-2 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 w-fit max-w-full">
              {[
                { key: 'overview', icon: 'fa-regular fa-user', label: 'Profile' },
                { key: 'results', icon: 'fa-solid fa-chart-simple', label: 'Exam Results' },
                { key: 'payments', icon: 'fa-solid fa-receipt', label: 'Payments' },
                { key: 'attendance', icon: 'fa-regular fa-calendar-check', label: 'Attendance' },
                { key: 'documents', icon: 'fa-regular fa-folder-open', label: 'Documents' },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-red-50 text-red-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <i className={`${tab.icon}`}></i> {tab.label}
                </button>
              ))}
            </div>

            {/* TABS CONTENT */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Personal Information */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group">
                  <div className="p-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500">
                        <i className="fa-regular fa-user"></i>
                      </div>
                      Personal Details
                    </h2>
                    <div className="space-y-1">
                      <InfoRow icon="fa-solid fa-hashtag" label="Registration No" value={regId} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-mobile-screen" label="Mobile Number" value={userData.phone} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-venus-mars" label="Gender" value={userData.gender} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-cake-candles" label="Date of Birth" value={userData.dob} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-droplet" label="Blood Group" value={userData.bloodGroup} iconColor="text-red-400" />
                      <InfoRow icon="fa-solid fa-hands-praying" label="Religion" value={userData.religion} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-school" label="School / College" value={userData.schoolName} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-location-dot" label="Present Address" value={userData.presentAddress} iconColor="text-gray-400" />
                      <InfoRow icon="fa-solid fa-map-pin" label="Permanent Address" value={userData.permanentAddress} iconColor="text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Academic Info */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                    <div className="p-8">
                      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <i className="fa-solid fa-graduation-cap"></i>
                        </div>
                        Academic Setup
                      </h2>
                      <div className="space-y-1 mb-6">
                        <InfoRow icon="fa-solid fa-school-flag" label="Class" value={userData.studentClass} iconColor="text-gray-400" />
                        <InfoRow icon="fa-solid fa-users-viewfinder" label="Group" value={userData.group} iconColor="text-gray-400" />
                      </div>
                      
                      {userData.enrollments?.length > 0 && (
                        <div className="mt-4">
                          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">Enrolled Courses</p>
                          <div className="space-y-3">
                            {userData.enrollments.map((e: any) => (
                              <div key={e.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 shadow-sm">
                                  <i className="fa-solid fa-book text-sm"></i>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-gray-800 leading-tight">{e.batch?.course?.title || e.batch?.name || 'Course'}</p>
                                  <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">{e.batch?.name}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Family Information */}
                  <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative group">
                    <div className="p-8">
                      <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                          <i className="fa-solid fa-people-roof"></i>
                        </div>
                        Family Info
                      </h2>
                      <div className="space-y-1">
                        <InfoRow icon="fa-solid fa-user-tie" label="Father's Name" value={userData.fatherName} iconColor="text-gray-400" />
                        <InfoRow icon="fa-solid fa-phone" label="Father's Mobile" value={userData.fatherMobile} iconColor="text-gray-400" />
                        <InfoRow icon="fa-solid fa-user-nurse" label="Mother's Name" value={userData.motherName} iconColor="text-gray-400" />
                        <InfoRow icon="fa-solid fa-phone" label="Mother's Mobile" value={userData.motherMobile} iconColor="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'results' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                <div className="p-8 md:p-10 border-b border-gray-50">
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-5">
                    <i className="fa-solid fa-chart-simple text-2xl"></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Exam Results</h2>
                  <p className="text-gray-400 text-sm mt-1">Complete history of all your examination scores.</p>
                </div>
                
                {examResults.length === 0 ? (
                  <div className="p-20 text-center text-gray-400">
                    <i className="fa-regular fa-folder-open text-4xl mb-4"></i>
                    <p className="text-sm font-medium">No exam results found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Exam Title</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">MCQ</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">CQ</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Written</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Total</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">%</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {examResults.map((r: any) => {
                          const pct = r.exam?.totalMark > 0 ? (r.totalMarks / r.exam.totalMark) * 100 : 0;
                          const g = gradeFromPct(pct);
                          return (
                            <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5 text-sm font-medium text-gray-500">{r.exam?.date ? new Date(r.exam.date).toLocaleDateString('en-GB') : '—'}</td>
                              <td className="px-8 py-5 font-semibold text-gray-800 text-sm max-w-[250px] truncate">{r.exam?.title}</td>
                              <td className="px-8 py-5 text-sm text-gray-600 text-center">{r.exam?.hasMcq ? r.mcqMarks : '—'}</td>
                              <td className="px-8 py-5 text-sm text-gray-600 text-center">{r.exam?.hasCq ? r.cqMarks : '—'}</td>
                              <td className="px-8 py-5 text-sm text-gray-600 text-center">{r.exam?.hasWritten ? r.writtenMarks : '—'}</td>
                              <td className="px-8 py-5 text-center">
                                <span className="font-semibold text-gray-800">{r.totalMarks}</span>
                                <span className="text-[11px] text-gray-400">/{r.exam?.totalMark}</span>
                              </td>
                              <td className="px-8 py-5 font-medium text-gray-700 text-center text-sm">{pct.toFixed(1)}%</td>
                              <td className="px-8 py-5 text-center">
                                <span className={`inline-flex items-center justify-center w-10 h-8 rounded-lg font-bold text-sm ${g.bg} ${g.color}`}>
                                  {g.grade}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                <div className="p-8 md:p-10 border-b border-gray-50">
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-5">
                    <i className="fa-solid fa-receipt text-2xl"></i>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">Payment History</h2>
                  <p className="text-gray-400 text-sm mt-1">Track your course fees and transactions.</p>
                </div>
                
                {!userData.payments?.length ? (
                  <div className="p-20 text-center text-gray-400">
                    <i className="fa-regular fa-folder-open text-4xl mb-4"></i>
                    <p className="text-sm font-medium">No payment history found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                      <thead className="bg-gray-50/50">
                        <tr>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Course / Details</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Transaction ID</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Amount</th>
                          <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {userData.payments.map((p: any) => (
                          <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-5 text-sm font-medium text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-GB')}</td>
                            <td className="px-8 py-5 text-sm font-semibold text-gray-800">{p.enrollment?.batch?.course?.title || p.enrollment?.batch?.name || 'General Fee'}</td>
                            <td className="px-8 py-5 text-sm text-gray-400 font-mono">{p.transactionId || '—'}</td>
                            <td className="px-8 py-5 text-right font-semibold text-gray-800 text-base">৳ {p.amount}</td>
                            <td className="px-8 py-5 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                p.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                p.status === 'OVERDUE' ? 'bg-red-50 text-red-600 border-red-100' :
                                p.status === 'CANCELED' ? 'bg-gray-50 text-gray-500 border-gray-200' :
                                'bg-yellow-50 text-yellow-600 border-yellow-100'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'attendance' && (
              <div className="space-y-8">
                <div className="grid grid-cols-3 gap-5">
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-100 p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3"><i className="fa-solid fa-check"></i></div>
                    <p className="text-3xl font-semibold text-gray-800">{presentDays}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">Days Present</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-red-100 p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3"><i className="fa-solid fa-xmark"></i></div>
                    <p className="text-3xl font-semibold text-gray-800">{attendanceRecords.filter((a: any) => a.status !== 'PRESENT').length}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">Days Absent</p>
                  </div>
                  <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-blue-100 p-8 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-3"><i className="fa-solid fa-percent"></i></div>
                    <p className="text-3xl font-semibold text-gray-800">{attendancePct}%</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mt-2">Total Rate</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative">
                  <div className="p-8 md:p-10 border-b border-gray-50">
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-5">
                      <i className="fa-regular fa-calendar-check text-2xl"></i>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800">Attendance Log</h2>
                    <p className="text-gray-400 text-sm mt-1">Daily attendance records for your enrolled batches.</p>
                  </div>
                  
                  {attendanceRecords.length === 0 ? (
                    <div className="p-20 text-center text-gray-400">
                      <i className="fa-regular fa-calendar-xmark text-4xl mb-4"></i>
                      <p className="text-sm font-medium">No attendance records found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-gray-50/50">
                          <tr>
                            <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                            <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Day</th>
                            <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-center">Status</th>
                            <th className="px-8 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {attendanceRecords.map((a: any) => (
                            <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-8 py-5 text-sm font-semibold text-gray-800">{new Date(a.session?.date || a.createdAt).toLocaleDateString('en-GB')}</td>
                              <td className="px-8 py-5 text-sm font-medium text-gray-500">{new Date(a.session?.date || a.createdAt).toLocaleDateString('en-US', { weekday: 'long' })}</td>
                              <td className="px-8 py-5 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                                  a.status === 'PRESENT' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  a.status === 'LATE' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                                  'bg-red-50 text-red-600 border-red-100'
                                }`}>
                                  {a.status}
                                </span>
                              </td>
                              <td className="px-8 py-5 text-sm text-gray-500 max-w-[200px] truncate">{a.comment || a.note || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {/* Admit Card */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center flex flex-col items-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300"><i className="fa-regular fa-id-card"></i></div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Admit Card</h3>
                  <p className="text-sm text-gray-500 mb-6 flex-1">Download and print your official exam admit card.</p>
                  <Link href={`/admit-card?studentId=${userData.studentId}&regNo=${userData.registrationNo}&class=${userData.studentClass}`} target="_blank" className="w-full py-3 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-600 font-semibold rounded-xl transition-colors border border-gray-100 block">View Admit Card</Link>
                </div>

                {/* Single Marksheet */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center flex flex-col items-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300"><i className="fa-regular fa-file-lines"></i></div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Single Marksheet</h3>
                  <p className="text-sm text-gray-500 mb-6 flex-1">View detailed marksheet for a specific examination.</p>
                  <Link href={`/marksheet?studentId=${userData.studentId}&regNo=${userData.registrationNo}&class=${userData.studentClass}`} target="_blank" className="w-full py-3 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 font-semibold rounded-xl transition-colors border border-gray-100 block">View Marksheet</Link>
                </div>

                {/* Full Marksheet */}
                <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 text-center flex flex-col items-center group hover:-translate-y-1 transition-all duration-300">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform duration-300"><i className="fa-solid fa-list-check"></i></div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Full Marksheet</h3>
                  <p className="text-sm text-gray-500 mb-6 flex-1">View combined performance report across all exams.</p>
                  <Link href={`/marksheet-all?studentId=${userData.studentId}&regNo=${userData.registrationNo}&class=${userData.studentClass}`} target="_blank" className="w-full py-3 bg-gray-50 hover:bg-emerald-50 text-gray-700 hover:text-emerald-600 font-semibold rounded-xl transition-colors border border-gray-100 block">View Full Marksheet</Link>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDE (User Info Card) */}
          <div className="w-full xl:w-[350px] shrink-0">
            <div className="bg-[#f8f9fc] rounded-[24px] border border-gray-100 overflow-hidden shadow-[0_2px_15px_rgb(0,0,0,0.03)] sticky top-24">
              <div className="bg-[#eef0f6] px-6 py-4 flex items-center gap-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-500 flex items-center justify-center shrink-0">
                  <i className="fa-regular fa-user text-sm"></i>
                </div>
                <h3 className="font-bold text-gray-800 text-sm">User Information</h3>
              </div>
              
              <div className="p-6 space-y-6 bg-white">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-phone text-lg"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5">{userData.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                    <i className="fa-regular fa-envelope text-lg"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-gray-800 text-sm mt-0.5 truncate max-w-[180px]">{userData.email || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-t border-gray-50 px-6 py-4 flex justify-between items-center">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Status</span>
                <span className={`text-xs font-bold flex items-center gap-1.5 ${userData.isActive ? 'text-[#10b981]' : 'text-red-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${userData.isActive ? 'bg-[#10b981]' : 'bg-red-500'}`}></span>
                  {userData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg p-1.5 transition-colors"
              >
                <i className="fa-solid fa-xmark w-4 h-4 flex items-center justify-center"></i>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="editProfileForm" onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student Name</label>
                    <input type="text" name="name" value={editFormData.name} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={editFormData.dob} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Blood Group</label>
                    <select name="bloodGroup" value={editFormData.bloodGroup} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all">
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                    <select name="gender" value={editFormData.gender} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all">
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Religion</label>
                    <select name="religion" value={editFormData.religion} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all">
                      <option value="">Select</option>
                      <option value="Islam">Islam</option>
                      <option value="Hinduism">Hinduism</option>
                      <option value="Christianity">Christianity</option>
                      <option value="Buddhism">Buddhism</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Institution</label>
                    <input type="text" name="schoolName" value={editFormData.schoolName} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">WhatsApp Number</label>
                    <input type="text" name="whatsapp" value={editFormData.whatsapp} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Present Address</label>
                    <input type="text" name="presentAddress" value={editFormData.presentAddress} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Permanent Address</label>
                    <input type="text" name="permanentAddress" value={editFormData.permanentAddress} onChange={handleEditChange} className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl px-4 py-2.5 focus:border-red-300 focus:ring-2 focus:ring-red-100 outline-none transition-all" />
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 text-orange-800 text-xs p-3 rounded-lg mt-4 flex gap-2">
                  <i className="fa-solid fa-circle-info mt-0.5"></i>
                  <p>Security Notice: For security reasons, sensitive information like Mobile Number, Email, Registration No, and Parents' Contact Numbers cannot be modified here. Please contact admin to change them.</p>
                </div>
              </form>
            </div>
            
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button 
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="editProfileForm"
                disabled={isSaving}
                className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-xl text-sm hover:bg-red-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-check"></i>}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
