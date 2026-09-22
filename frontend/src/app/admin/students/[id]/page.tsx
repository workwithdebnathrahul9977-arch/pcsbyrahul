'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const TABS = ['Personal', 'Family', 'Academic', 'Payments', 'Attendance', 'Exams'] as const;
type Tab = typeof TABS[number];

const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 disabled:bg-gray-50 disabled:text-gray-500";
const labelCls = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1";

export default function StudentProfilePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('Personal');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deactivateModal, setDeactivateModal] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState('');

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/students/${id}`);
      setStudent(data);
      setForm(data);
    } catch { toast.error('Student not found'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchStudent(); }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`${API}/api/students/${id}`, form);
      toast.success('Profile updated!');
      setEditing(false);
      fetchStudent();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async () => {
    if (!deactivateReason) { toast.error('Reason দিন'); return; }
    try {
      await axios.put(`${API}/api/students/${id}/deactivate`, { reason: deactivateReason });
      toast.success('Student deactivated');
      setDeactivateModal(false);
      fetchStudent();
    } catch { toast.error('Failed'); }
  };

  const handleReactivate = async () => {
    if (!confirm('এই student কে আবার active করতে চান?')) return;
    try {
      await axios.put(`${API}/api/students/${id}/reactivate`);
      toast.success('Student reactivated!');
      fetchStudent();
    } catch { toast.error('Failed'); }
  };

  if (loading) return <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Loading...</div>;
  if (!student) return <div className="p-8 text-center text-red-500">Student not found.</div>;

  const f = (key: string, label: string, type = 'text') => (
    <div>
      <label className={labelCls}>{label}</label>
      <input type={type} value={form[key] || ''} onChange={e => setForm((p: any) => ({ ...p, [key]: e.target.value }))} disabled={!editing} className={inputCls} />
    </div>
  );

  const attendances: any[] = student.attendances || [];
  const present = attendances.filter((a: any) => a.status === 'PRESENT').length;
  const absent = attendances.filter((a: any) => a.status === 'ABSENT').length;
  const late = attendances.filter((a: any) => a.status === 'LATE').length;

  return (
    <div className="space-y-5">
      {/* Back nav */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/students" className="hover:text-red-600 transition flex items-center gap-1">
          <i className="fa-solid fa-arrow-left text-xs"></i> Students List
        </Link>
        <span>/</span>
        <span className="text-gray-800 font-medium">{student.name}</span>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 h-24 relative">
          <div className="absolute -bottom-10 left-6">
            {student.photoUrl ? (
              <img src={student.photoUrl} alt={student.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-lg" />
            ) : (
              <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg bg-gradient-to-br from-red-400 to-red-600 text-white font-black text-3xl flex items-center justify-center">
                {student.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        </div>
        <div className="pt-12 pb-5 px-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{student.name}</h2>
            <p className="text-gray-500 text-sm">{student.email} · {student.phone || 'No phone'}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {student.isActive
                ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Active</span>
                : <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Inactive — {student.deactivationReason}</span>
              }
              {student.studentClass && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">{student.studentClass}</span>}
              {student.selectedBatch && <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-200">{student.selectedBatch}</span>}
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {editing ? (
              <>
                <button onClick={() => { setEditing(false); setForm(student); }} className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
                <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 text-sm disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setEditing(true)} className="px-4 py-2 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 text-sm flex items-center gap-2">
                  <i className="fa-solid fa-pen text-xs"></i> Edit
                </button>
                {student.isActive ? (
                  <button onClick={() => setDeactivateModal(true)} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 font-bold rounded-xl hover:bg-red-100 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-user-slash text-xs"></i> Deactivate
                  </button>
                ) : (
                  <button onClick={handleReactivate} className="px-4 py-2 bg-green-50 text-green-600 border border-green-200 font-bold rounded-xl hover:bg-green-100 text-sm flex items-center gap-2">
                    <i className="fa-solid fa-user-check text-xs"></i> Reactivate
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-100 px-6 flex gap-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${tab === t ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        {tab === 'Personal' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {f('name', 'Full Name')}
            {f('phone', 'Mobile Number')}
            {f('whatsapp', 'WhatsApp Number')}
            {f('dob', 'Date of Birth')}
            {f('gender', 'Gender')}
            {f('bloodGroup', 'Blood Group')}
            {f('religion', 'Religion')}
            {f('presentAddress', 'Present Address')}
            {f('permanentAddress', 'Permanent Address')}
            {f('schoolName', 'School / College')}
            {f('schoolRoll', 'School Roll')}
          </div>
        )}

        {tab === 'Family' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {f('fatherName', "Father's Name")}
            {f('fatherMobile', "Father's Mobile")}
            {f('fatherOccupation', "Father's Occupation")}
            {f('motherName', "Mother's Name")}
            {f('motherMobile', "Mother's Mobile")}
            {f('motherOccupation', "Mother's Occupation")}
            {f('guardianMobile', 'Guardian Mobile')}
          </div>
        )}

        {tab === 'Academic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {f('studentClass', 'Class')}
            {f('selectedBatch', 'Batch')}
            {f('group', 'Group')}
            {f('subject', 'Subject')}
            <div>
              <label className={labelCls}>Joined On</label>
              <input type="text" value={new Date(student.createdAt).toLocaleDateString('en-BD', { day: '2-digit', month: 'long', year: 'numeric' })} disabled className={inputCls} />
            </div>
          </div>
        )}

        {tab === 'Payments' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-green-700">৳{(student.payments || []).filter((p: any) => p.status === 'PAID').reduce((sum: number, p: any) => sum + (p.amount || 0), 0).toLocaleString()}</p>
                <p className="text-green-600 text-xs font-bold mt-1">Total Paid</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-yellow-700">{(student.payments || []).filter((p: any) => p.status === 'PENDING').length}</p>
                <p className="text-yellow-600 text-xs font-bold mt-1">Pending</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-2xl font-black text-gray-700">{(student.payments || []).length}</p>
                <p className="text-gray-600 text-xs font-bold mt-1">Total Records</p>
              </div>
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Method</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Date</th>
                </tr></thead>
                <tbody>
                  {(student.payments || []).length === 0 ? (
                    <tr><td colSpan={4} className="p-6 text-center text-gray-400">No payment records</td></tr>
                  ) : (student.payments || []).map((p: any) => (
                    <tr key={p.id} className="border-t border-gray-50">
                      <td className="p-3 font-bold">৳{p.amount}</td>
                      <td className="p-3 text-gray-600">{p.method || '—'}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${p.status === 'PAID' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{p.status}</span></td>
                      <td className="p-3 text-gray-500 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Attendance' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Days', val: attendances.length, color: 'bg-gray-50 text-gray-700 border-gray-200' },
                { label: 'Present', val: present, color: 'bg-green-50 text-green-700 border-green-200' },
                { label: 'Absent', val: absent, color: 'bg-red-50 text-red-700 border-red-200' },
                { label: 'Late', val: late, color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.color} border rounded-xl p-4 text-center`}>
                  <p className="text-2xl font-black">{stat.val}</p>
                  <p className="text-xs font-bold mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Note</th>
                </tr></thead>
                <tbody>
                  {attendances.length === 0 ? (
                    <tr><td colSpan={3} className="p-6 text-center text-gray-400">No attendance records</td></tr>
                  ) : attendances.slice(0, 30).map((a: any) => (
                    <tr key={a.id} className="border-t border-gray-50">
                      <td className="p-3 text-gray-700">{new Date(a.date).toLocaleDateString('en-BD')}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-bold ${a.status === 'PRESENT' ? 'bg-green-50 text-green-700' : a.status === 'LATE' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>{a.status}</span></td>
                      <td className="p-3 text-gray-400 text-xs">{a.note || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'Exams' && (
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                <th className="p-3 text-left">Exam</th>
                <th className="p-3 text-left">MCQ</th>
                <th className="p-3 text-left">CQ</th>
                <th className="p-3 text-left">Written</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Out Of</th>
                <th className="p-3 text-left">Grade</th>
                <th className="p-3 text-left">Status</th>
              </tr></thead>
              <tbody>
                {(student.ExamResult || []).length === 0 ? (
                  <tr><td colSpan={8} className="p-6 text-center text-gray-400">No exam results</td></tr>
                ) : (student.ExamResult || []).map((r: any) => {
                  const pct = r.exam?.totalMark > 0 ? (r.totalMarks / r.exam.totalMark) * 100 : 0;
                  const grade = pct >= 80 ? 'A+' : pct >= 70 ? 'A' : pct >= 60 ? 'A-' : pct >= 50 ? 'B' : pct >= 40 ? 'C' : pct >= 33 ? 'D' : 'F';
                  return (
                    <tr key={r.id} className="border-t border-gray-50 hover:bg-gray-50">
                      <td className="p-3 font-medium text-gray-800">{r.exam?.title || '—'}</td>
                      <td className="p-3 text-gray-600">{r.exam?.hasMcq ? r.mcqMarks : '—'}</td>
                      <td className="p-3 text-gray-600">{r.exam?.hasCq ? r.cqMarks : '—'}</td>
                      <td className="p-3 text-gray-600">{r.exam?.hasWritten ? r.writtenMarks : '—'}</td>
                      <td className="p-3 font-black text-gray-900">{r.totalMarks}</td>
                      <td className="p-3 text-gray-500">{r.exam?.totalMark || '—'}</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded text-xs font-black ${pct >= 33 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{grade}</span></td>
                      <td className="p-3">
                        {r.isPresent === false
                          ? <span className="px-2 py-0.5 rounded text-xs font-black bg-yellow-50 text-yellow-700">Absent</span>
                          : pct >= 33
                          ? <span className="px-2 py-0.5 rounded text-xs font-black bg-green-50 text-green-700">Pass</span>
                          : <span className="px-2 py-0.5 rounded text-xs font-black bg-red-50 text-red-700">Fail</span>
                        }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Deactivate Modal */}
      {deactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-black text-gray-900 mb-1">Deactivate Student</h3>
            <p className="text-gray-500 text-sm mb-4">{student.name} কে inactive করার কারণ দিন।</p>
            <div className="space-y-3 mb-5">
              {['Dropped Out', 'Transfer Certificate (TC)', 'Exam Completed', 'Long Absent', 'Other'].map(r => (
                <label key={r} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-red-50 hover:border-red-200 transition">
                  <input type="radio" name="reason" value={r} checked={deactivateReason === r} onChange={() => setDeactivateReason(r)} className="accent-red-600" />
                  <span className="text-sm font-medium text-gray-700">{r}</span>
                </label>
              ))}
              <input type="text" placeholder="অন্য কারণ লিখুন..." value={!['Dropped Out', 'Transfer Certificate (TC)', 'Exam Completed', 'Long Absent', 'Other'].includes(deactivateReason) ? deactivateReason : ''} onChange={e => setDeactivateReason(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeactivateModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={handleDeactivate} className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 text-sm">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
