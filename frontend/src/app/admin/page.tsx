'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  PENDING:  { label: 'Pending',  color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  APPROVED: { label: 'Approved', color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   dot: 'bg-green-500' },
  REJECTED: { label: 'Rejected', color: 'text-red-700',    bg: 'bg-red-50 border-red-200',       dot: 'bg-red-500' },
};

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    axios.get(`${API}/api/dashboard/stats`)
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <i className="fa-solid fa-spinner fa-spin text-red-500 text-4xl mb-4"></i>
        <p className="text-gray-500 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  const s = data?.stats || {};
  const totalAdm = s.totalAdmissions || 0;

  const statCards = [
    {
      title: 'Total Admissions',
      value: totalAdm,
      sub: `Today: ${s.todayAdmissions || 0} new`,
      icon: 'fa-user-graduate',
      gradient: 'from-red-500 to-red-600',
      lightBg: 'bg-red-50',
      iconColor: 'text-red-500',
      link: '/admin/admission/requests',
    },
    {
      title: 'Pending Approval',
      value: s.newAdmissions || 0,
      sub: `${s.approvedAdmissions || 0} approved total`,
      icon: 'fa-clock',
      gradient: 'from-amber-400 to-orange-500',
      lightBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      link: '/admin/admission/requests',
    },
    {
      title: 'Active Batches',
      value: s.activeBatches || 0,
      sub: `${s.totalClasses || 0} classes · ${s.totalSubjects || 0} subjects`,
      icon: 'fa-layer-group',
      gradient: 'from-violet-500 to-purple-600',
      lightBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      link: '/admin/academic/batch',
    },
    {
      title: 'Public Courses',
      value: s.totalCourses || 0,
      sub: 'Live on website',
      icon: 'fa-book-open',
      gradient: 'from-emerald-500 to-teal-600',
      lightBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      link: '/admin/courses',
    },
  ];

  const breakdown = data?.admissionBreakdown || [];
  const recentAdmissions = data?.recentAdmissions || [];

  return (
    <div className="space-y-6 pb-8">

      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl shadow-red-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-black/10 rounded-full translate-y-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-red-200 text-sm font-medium mb-1">{dateStr}</p>
            <h2 className="text-2xl md:text-3xl font-black mb-1">স্বাগতম, Admin! 👋</h2>
            <p className="text-red-100 text-sm">আজকের সারসংক্ষেপ নিচে দেখুন।</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/admin/admission/new" className="bg-white text-red-600 px-4 py-2.5 rounded-xl font-black text-sm hover:bg-red-50 transition flex items-center gap-2 shadow-sm">
              <i className="fa-solid fa-plus"></i> New Admission
            </Link>
            <Link href="/admin/admission/requests" className="bg-red-500/40 text-white border border-white/20 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-red-500/60 transition flex items-center gap-2 backdrop-blur-sm">
              <i className="fa-solid fa-list-check"></i> View Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {statCards.map((card, i) => (
          <Link href={card.link} key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group cursor-pointer shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.lightBg} rounded-xl flex items-center justify-center`}>
                <i className={`fa-solid ${card.icon} ${card.iconColor} text-xl`}></i>
              </div>
              <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 group-hover:text-gray-400 text-xs transition-colors"></i>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">{card.title}</p>
            <h3 className="text-3xl font-black text-gray-900 mb-1">{card.value.toLocaleString()}</h3>
            <p className="text-gray-400 text-xs">{card.sub}</p>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent Admissions Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <div>
              <h3 className="font-black text-gray-800">Recent Admissions</h3>
              <p className="text-gray-400 text-xs mt-0.5">Latest {recentAdmissions.length} requests</p>
            </div>
            <Link href="/admin/admission/requests" className="text-red-600 text-sm font-bold hover:underline flex items-center gap-1">
              View All <i className="fa-solid fa-chevron-right text-xs"></i>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left font-bold">Student</th>
                  <th className="px-6 py-3 text-left font-bold">Class / Batch</th>
                  <th className="px-6 py-3 text-left font-bold">Date</th>
                  <th className="px-6 py-3 text-left font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                      <i className="fa-solid fa-inbox text-3xl mb-3 block"></i>
                      No admissions yet
                    </td>
                  </tr>
                ) : recentAdmissions.map((adm: any) => {
                  const sc = statusConfig[adm.status] || statusConfig.PENDING;
                  return (
                    <tr key={adm.id} className="border-t border-gray-50 hover:bg-red-50/20 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          {adm.photoUrl ? (
                            <img src={adm.photoUrl} alt="" className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-black text-sm flex items-center justify-center flex-shrink-0">
                              {adm.studentName?.[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-gray-900 leading-tight">{adm.studentName}</p>
                            <p className="text-gray-400 text-[11px]">{adm.studentMobile}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <p className="font-medium text-gray-700">{adm.studentClass}</p>
                        <p className="text-gray-400 text-[11px]">{adm.selectedBatch}</p>
                      </td>
                      <td className="px-6 py-3.5 text-gray-500 text-xs">
                        {new Date(adm.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`}></span>
                          {sc.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Admission Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4">Admission Status</h3>
            <div className="space-y-3">
              {breakdown.map((item: any) => {
                const pct = totalAdm > 0 ? Math.round((item.count / totalAdm) * 100) : 0;
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="font-medium text-gray-700">{item.label}</span>
                      <span className="font-black text-gray-900">{item.count} <span className="text-gray-400 font-normal">({pct}%)</span></span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              {breakdown.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No data yet</p>
              )}
              <div className="pt-2 border-t border-gray-100 flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-black text-gray-900">{totalAdm}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <h3 className="font-black text-gray-800 mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { icon: 'fa-plus', label: 'New Admission', link: '/admin/admission/new', bg: 'bg-red-50', color: 'text-red-600' },
                { icon: 'fa-layer-group', label: 'Manage Batches', link: '/admin/academic/batch', bg: 'bg-violet-50', color: 'text-violet-600' },
                { icon: 'fa-book-open', label: 'Manage Courses', link: '/admin/courses', bg: 'bg-emerald-50', color: 'text-emerald-600' },
                { icon: 'fa-file-arrow-down', label: 'Blank Form (Print)', link: '/admin/admission/blank-form', bg: 'bg-amber-50', color: 'text-amber-600' },
                { icon: 'fa-gear', label: 'Site Settings', link: '/admin/settings/site', bg: 'bg-blue-50', color: 'text-blue-600' },
              ].map((item, i) => (
                <Link key={i} href={item.link} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition group border border-transparent hover:border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.bg} ${item.color} rounded-lg flex items-center justify-center text-sm`}>
                      <i className={`fa-solid ${item.icon}`}></i>
                    </div>
                    <span className="text-gray-700 font-medium text-sm">{item.label}</span>
                  </div>
                  <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-gray-500 text-xs transition-colors"></i>
                </Link>
              ))}
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-sm">
            <h3 className="font-black mb-4 flex items-center gap-2">
              <i className="fa-solid fa-chart-pie text-red-400"></i> Academic Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Classes', val: s.totalClasses || 0, icon: 'fa-chalkboard' },
                { label: 'Subjects', val: s.totalSubjects || 0, icon: 'fa-book' },
                { label: 'Batches', val: s.activeBatches || 0, icon: 'fa-layer-group' },
                { label: 'Courses', val: s.totalCourses || 0, icon: 'fa-video' },
              ].map((item, i) => (
                <div key={i} className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <i className={`fa-solid ${item.icon} text-red-400 text-sm mb-1`}></i>
                  <p className="text-2xl font-black">{item.val}</p>
                  <p className="text-gray-400 text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
