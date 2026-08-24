'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function UserDashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/user/dashboard`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setUserData(res.data);
      })
      .catch(err => {
        console.error(err);
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  // Derived Stats
  const joinYear = userData?.createdAt ? new Date(userData.createdAt).getFullYear() : new Date().getFullYear();
  let numericPart = '00000';
  if (userData?.id) {
    const hexSegment = userData.id.substring(0, 5);
    numericPart = parseInt(hexSegment, 16).toString().padStart(5, '0');
  }
  const studentId = `${joinYear}${numericPart}`;
  
  const totalCourses = userData?.enrollments?.length || 0;
  const pendingDuesCount = userData?.payments?.filter((p: any) => p.status === 'PENDING' || p.status === 'OVERDUE').length || 0;
  
  // Calculate Latest Result Percentage
  let latestResultStr = 'N/A';
  if (userData?.ExamResult?.length > 0) {
    const latest = userData.ExamResult[0];
    const percentage = ((latest.marks / latest.exam.totalMark) * 100).toFixed(1);
    latestResultStr = `${percentage}%`;
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      
      {/* 1. Header / Cover Section */}
      <div className="bg-gradient-to-r from-gray-900 via-[#2a0a0a] to-red-950 h-72 md:h-80 relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end justify-between w-full pb-16 md:pb-20 gap-6">
            
            {/* User Info */}
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-6 text-center md:text-left mt-8 md:mt-0">
              <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex items-center justify-center text-4xl md:text-5xl font-black text-red-600 shadow-2xl border-4 border-white/20 shrink-0">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-white">
                <h1 className="text-2xl md:text-4xl font-black tracking-tight mb-2">{userData?.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs md:text-sm font-bold tracking-wider border border-white/20 shadow-sm flex items-center">
                    <i className="fa-solid fa-id-badge mr-2 opacity-70"></i> {studentId}
                  </span>
                  <span className="text-gray-300 text-xs md:text-sm font-medium bg-black/20 px-3 py-1.5 rounded-lg">
                    Joined {joinYear}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/login');
              }}
              className="bg-white/10 hover:bg-red-600 text-white border border-white/20 hover:border-red-500 backdrop-blur-md px-6 py-2.5 rounded-full font-bold text-sm transition-all flex items-center shadow-lg"
            >
              <i className="fa-solid fa-right-from-bracket mr-2"></i> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 md:-mt-20 relative z-20">
        
        {/* 2. Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl mb-6">
              <i className="fa-solid fa-book-open"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 leading-none">{totalCourses}</p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-2">Enrolled Courses</p>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center text-xl mb-6">
              <i className="fa-solid fa-file-invoice-dollar"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 leading-none">{pendingDuesCount}</p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-2">Pending Dues</p>
          </div>
          
          {/* Stat 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-xl mb-6">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <p className="text-3xl font-bold text-gray-900 leading-none">{latestResultStr}</p>
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-2">Latest Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* My Courses Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-lg font-black text-gray-900 flex items-center">
                  My Courses
                </h2>
                <Link href="/courses" className="text-sm font-bold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-4 py-1.5 rounded-lg transition-colors">
                  Browse More
                </Link>
              </div>
              
              <div className="p-6">
                {userData?.enrollments?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                      <i className="fa-solid fa-folder-open"></i>
                    </div>
                    <h3 className="text-lg font-bold text-gray-700 mb-2">No active enrollments</h3>
                    <p className="text-gray-500 text-sm mb-4">You haven't enrolled in any courses yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {userData?.enrollments?.map((enrollment: any) => (
                      <div key={enrollment.id} className="group border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col bg-white">
                        <div className="h-36 relative bg-gray-100 shrink-0 overflow-hidden">
                          {enrollment.batch.course.imageUrl ? (
                            <img src={enrollment.batch.course.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-100"><i className="fa-solid fa-image text-3xl"></i></div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent"></div>
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                            <span className="bg-red-600 text-xs font-bold px-2.5 py-1 rounded-md text-white shadow-sm">
                              {enrollment.batch.course.category || 'Course'}
                            </span>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm text-white ${enrollment.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-500'}`}>
                              {enrollment.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <h3 className="font-bold text-gray-900 mb-2 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
                            {enrollment.batch.course.title}
                          </h3>
                          <p className="text-sm text-gray-600 font-medium mb-4 flex items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <i className="fa-solid fa-users text-red-500 mr-2"></i> {enrollment.batch.name}
                          </p>
                          
                          <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center text-xs font-medium text-gray-500">
                              <i className="fa-regular fa-clock mr-1.5 text-gray-400"></i>
                              <span className="truncate max-w-[120px]">{enrollment.batch.schedule}</span>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 px-2 py-1 rounded-md">
                              {enrollment.batch.course.paymentType}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Exam Results Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center bg-gray-50/50">
                <h2 className="text-lg font-black text-gray-900">Performance Record</h2>
              </div>
              
              <div className="p-0 sm:p-6">
                {userData?.ExamResult?.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 text-sm font-medium">
                    No exam results published yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto sm:rounded-2xl sm:border sm:border-gray-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
                          <th className="p-4 border-b border-gray-200">Exam Details</th>
                          <th className="p-4 border-b border-gray-200">Date</th>
                          <th className="p-4 border-b border-gray-200 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {userData?.ExamResult?.map((result: any) => (
                          <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-gray-900 mb-0.5">{result.exam.title}</p>
                              <p className="text-xs text-gray-500">{result.exam.batch.course.title}</p>
                            </td>
                            <td className="p-4 text-sm text-gray-600 font-medium whitespace-nowrap">
                              {new Date(result.exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="p-4 text-right">
                              <div className="inline-flex items-baseline gap-1">
                                <span className="font-black text-lg text-gray-900">{result.marks}</span>
                                <span className="text-gray-400 text-sm font-medium">/ {result.exam.totalMark}</span>
                              </div>
                              {/* Small percentage bar */}
                              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden flex justify-end">
                                <div 
                                  className="h-full bg-green-500 rounded-full" 
                                  style={{ width: `${(result.marks / result.exam.totalMark) * 100}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            
            {/* Profile Info Card (Redesigned to match user image) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 bg-[#f3f4f6] border-b border-gray-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-sm">
                  <i className="fa-regular fa-user"></i>
                </div>
                <h2 className="text-base font-bold text-gray-900">User Information</h2>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                    <p className="font-bold text-gray-900 text-[15px]">{userData?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-lg shrink-0">
                    <i className="fa-regular fa-envelope"></i>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email Address</p>
                    <p className="font-bold text-gray-900 text-[15px] truncate">{userData?.email}</p>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                  <span className="text-[13px] font-bold text-gray-500">Account Status</span>
                  <span className="text-[13px] font-bold text-green-600 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span> Active
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col max-h-[500px]">
              <div className="px-6 py-5 border-b border-gray-100 shrink-0">
                <h2 className="text-lg font-black text-gray-900 flex items-center justify-between">
                  <span>Billing & Payments</span>
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-xs font-bold">{userData?.payments?.length || 0}</span>
                </h2>
              </div>
              
              <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
                {userData?.payments?.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm font-medium">
                    <i className="fa-solid fa-receipt text-3xl text-gray-200 mb-3 block"></i>
                    No payment history.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {userData?.payments?.map((payment: any) => (
                      <div key={payment.id} className={`p-4 rounded-2xl border transition-all ${
                        payment.status === 'OVERDUE' ? 'bg-red-50/50 border-red-200' : 
                        payment.status === 'PENDING' ? 'bg-yellow-50/30 border-yellow-100' :
                        'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="pr-3">
                            <p className="font-bold text-gray-900 text-sm mb-0.5">{payment.month || 'Course Fee'}</p>
                            <p className="text-[11px] text-gray-500 font-medium leading-tight line-clamp-1">{payment.enrollment?.batch?.course?.title || 'General'}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shrink-0 shadow-sm ${
                            payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                            payment.status === 'OVERDUE' ? 'bg-red-600 text-white' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100/60">
                          <span className="text-xs font-bold text-gray-400">Amount</span>
                          <span className="font-black text-gray-900">৳ {payment.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
