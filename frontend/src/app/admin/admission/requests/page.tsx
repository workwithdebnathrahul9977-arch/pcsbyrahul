'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  PENDING:  { label: 'Pending',  color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: 'fa-clock' },
  APPROVED: { label: 'Approved', color: 'text-green-700',  bg: 'bg-green-50 border-green-200',   icon: 'fa-circle-check' },
  REJECTED: { label: 'Rejected', color: 'text-red-700',    bg: 'bg-red-50 border-red-200',         icon: 'fa-circle-xmark' },
};

export default function OnlineAdmissionRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/api/admission`);
      setRequests(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const updateStatus = async (id: string, status: string) => {
    if (updatingId) return; // prevent double clicks
    setUpdatingId(id);
    const toastId = toast.loading(`Marking as ${status}...`);
    try {
      await axios.put(`${API}/api/admission/${id}/status`, { status });
      await fetchRequests();
      if (selected?.id === id) setSelected({ ...selected, status });
      toast.success(`Marked as ${status}`, { id: toastId });
    } catch (e) {
      toast.error('Failed to update status', { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('এই অ্যাডমিশন রিকোয়েস্ট ডিলিট করতে চান?')) return;
    await axios.delete(`${API}/api/admission/${id}`);
    setSelected(null);
    fetchRequests();
  };

  const filtered = requests.filter(r => {
    const matchStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchSearch = !search || r.studentName?.toLowerCase().includes(search.toLowerCase()) || r.studentMobile?.includes(search);
    return matchStatus && matchSearch;
  });

  const counts = {
    ALL: requests.length,
    PENDING: requests.filter(r => r.status === 'PENDING').length,
    APPROVED: requests.filter(r => r.status === 'APPROVED').length,
    REJECTED: requests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Online Admission Requests</h2>
          <p className="text-gray-500 text-sm">Students who applied online via the website</p>
        </div>
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            placeholder="Search by name or mobile..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 w-64"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all ${
              filterStatus === s
                ? 'bg-red-600 text-white border-red-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
            }`}
          >
            {s === 'ALL' ? 'All' : statusConfig[s].label} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-bold">Student</th>
              <th className="p-4 font-bold">Class / Batch</th>
              <th className="p-4 font-bold">Mobile</th>
              <th className="p-4 font-bold">Applied At</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-8 text-center text-gray-400">No requests found.</td></tr>
            ) : filtered.map(r => {
              const sc = statusConfig[r.status] || statusConfig.PENDING;
              return (
                <tr key={r.id} className="border-b border-gray-50 hover:bg-red-50/30 transition cursor-pointer" onClick={() => setSelected(r)}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {r.photoUrl ? (
                        <img src={r.photoUrl} alt={r.studentName} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                          {r.studentName?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-900">{r.studentName}</p>
                        <p className="text-gray-400 text-xs">{r.schoolName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <p className="font-medium">{r.studentClass}</p>
                    <p className="text-gray-400 text-xs">{r.selectedBatch}</p>
                  </td>
                  <td className="p-4 text-gray-600">{r.studentMobile}</td>
                  <td className="p-4 text-gray-500 text-xs">{new Date(r.createdAt).toLocaleString('en-BD')}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${sc.bg} ${sc.color}`}>
                      <i className={`fa-solid ${sc.icon} text-[10px]`}></i>{sc.label}
                    </span>
                  </td>
                  <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      {updatingId === r.id ? (
                        <div className="text-gray-400 text-xs flex items-center justify-center p-1.5"><i className="fa-solid fa-spinner fa-spin"></i></div>
                      ) : (
                        <>
                          {r.status !== 'APPROVED' && (
                            <button onClick={() => updateStatus(r.id, 'APPROVED')} disabled={!!updatingId} className="text-green-600 hover:text-green-700 p-1.5 rounded-lg hover:bg-green-50 transition text-xs font-bold disabled:opacity-50" title="Approve">
                              <i className="fa-solid fa-check"></i>
                            </button>
                          )}
                          {r.status !== 'REJECTED' && (
                            <button onClick={() => updateStatus(r.id, 'REJECTED')} disabled={!!updatingId} className="text-orange-500 hover:text-orange-700 p-1.5 rounded-lg hover:bg-orange-50 transition text-xs font-bold disabled:opacity-50" title="Reject">
                              <i className="fa-solid fa-ban"></i>
                            </button>
                          )}
                          <button onClick={() => handleDelete(r.id)} disabled={!!updatingId} className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 transition text-xs disabled:opacity-50" title="Delete">
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                {selected.photoUrl ? (
                  <img src={selected.photoUrl} alt={selected.studentName} className="w-14 h-14 rounded-full object-cover border-2 border-red-200" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black text-2xl">
                    {selected.studentName?.[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-gray-900">{selected.studentName}</h3>
                  <p className="text-gray-500 text-sm">{selected.studentClass} · {selected.selectedBatch}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xl p-1">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-6 grid grid-cols-2 gap-4 text-sm">
              {[
                ['Student Name', selected.studentName],
                ['Nickname', selected.studentNickname],
                ['Class', selected.studentClass],
                ['Batch', selected.selectedBatch],
                ['Group', selected.group],
                ['Subject', selected.subject],
                ['Mobile', selected.studentMobile],
                ['Guardian Mobile', selected.guardianMobile],
                ['DOB', selected.dob],
                ['Gender', selected.gender],
                ['Blood Group', selected.bloodGroup],
                ['Religion', selected.religion],
                ['School', selected.schoolName],
                ['School Roll', selected.schoolRoll],
                ['Father Name', selected.fatherName],
                ['Father Mobile', selected.fatherMobile],
                ['Father Occupation', selected.fatherOccupation],
                ['Mother Name', selected.motherName],
                ['Mother Mobile', selected.motherMobile],
                ['Mother Occupation', selected.motherOccupation],
                ['Present Address', selected.presentAddress],
                ['Permanent Address', selected.permanentAddress],
                ['Admission Fee', `৳${selected.admissionFee}`],
                ['Payment Method', selected.paymentMethod],
                ['Transaction ID', selected.transactionId],
                ['Advisor', selected.advisorName],
                ['Advisor Mobile', selected.advisorMobile],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label as string} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-1">{label as string}</p>
                  <p className="text-gray-800 font-medium">{value as string}</p>
                </div>
              ))}
            </div>

            {selected.signatureUrl && (
              <div className="px-6 pb-2">
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">Signature</p>
                <img src={selected.signatureUrl} alt="Signature" className="h-16 border border-gray-200 rounded-lg p-2 bg-gray-50" />
              </div>
            )}

            <div className="p-6 border-t border-gray-100 flex gap-3 flex-wrap justify-end sticky bottom-0 bg-white">
              {updatingId === selected.id ? (
                <div className="text-gray-500 font-bold flex items-center gap-2"><i className="fa-solid fa-spinner fa-spin"></i> Processing...</div>
              ) : (
                <>
                  {selected.status !== 'APPROVED' && (
                    <button onClick={() => updateStatus(selected.id, 'APPROVED')} disabled={!!updatingId} className="px-5 py-2.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition text-sm flex items-center gap-2 disabled:opacity-50">
                      <i className="fa-solid fa-check"></i> Approve
                    </button>
                  )}
                  {selected.status !== 'REJECTED' && (
                    <button onClick={() => updateStatus(selected.id, 'REJECTED')} disabled={!!updatingId} className="px-5 py-2.5 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition text-sm flex items-center gap-2 disabled:opacity-50">
                      <i className="fa-solid fa-ban"></i> Reject
                    </button>
                  )}
                  <button onClick={() => handleDelete(selected.id)} disabled={!!updatingId} className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition text-sm flex items-center gap-2 disabled:opacity-50">
                    <i className="fa-solid fa-trash"></i> Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
