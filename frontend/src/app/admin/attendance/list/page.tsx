'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AttendanceList() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [modalType, setModalType] = useState<'VIEW' | 'EDIT' | 'WHATSAPP' | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  
  // Edit states
  const [editData, setEditData] = useState<Record<string, { status: string; comment: string }>>({});
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    fetchSessions();
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/classes`).then(res => setClasses(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/batches`).then(res => setBatches(res.data)).catch(console.error);
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/sessions`);
      setSessions(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this attendance session?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/sessions/${id}`);
      toast.success('Deleted successfully');
      fetchSessions();
    } catch (e) {
      toast.error('Failed to delete');
    }
  };

  const openModal = (type: 'VIEW' | 'EDIT' | 'WHATSAPP', session: any) => {
    setSelectedSession(session);
    setModalType(type);
    if (type === 'EDIT') {
      const initial: any = {};
      session.records.forEach((r: any) => {
        initial[r.id] = { status: r.status, comment: r.comment || '' };
      });
      setEditData(initial);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedSession(null);
  };

  const handleEditToggle = (recordId: string) => {
    setEditData(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], status: prev[recordId].status === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
    }));
  };

  const handleEditComment = (recordId: string, val: string) => {
    setEditData(prev => ({
      ...prev,
      [recordId]: { ...prev[recordId], comment: val }
    }));
  };

  const saveEdit = async () => {
    setSavingEdit(true);
    const records = Object.keys(editData).map(id => ({
      id,
      status: editData[id].status,
      comment: editData[id].comment
    }));
    
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/sessions/${selectedSession.id}`, { records });
      toast.success('Attendance updated successfully');
      closeModal();
      fetchSessions();
    } catch (e) {
      toast.error('Failed to update attendance');
    } finally {
      setSavingEdit(false);
    }
  };

  const sendWhatsAppMsg = async (record: any) => {
    const phone = record.student?.phone || record.student?.guardianMobile;
    if (!phone) return toast.error('No phone number available for this student');
    
    let msg = '';
    if (record.status === 'PRESENT') {
      msg = `সম্মানিত অভিভাবক,\nআপনার সন্তান ${record.student.name} আজকে ক্লাসে উপস্থিত ছিল।\nধন্যবাদ।`;
    } else {
      msg = `সম্মানিত অভিভাবক,\nআপনার সন্তান ${record.student.name} আজকে ক্লাসে অনুপস্থিত ছিল। দয়া করে খোঁজ নিন।\nধন্যবাদ।`;
    }

    const toastId = toast.loading('Sending message...');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/whatsapp/send`, {
        phone,
        message: msg
      });
      toast.success('WhatsApp message sent successfully', { id: toastId });
    } catch (e: any) {
      toast.error(e.response?.data?.error || 'Failed to send WhatsApp message. Please check API connection.', { id: toastId });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students Attendance</h1>
        <p className="text-sm text-gray-500">Take, update, and manage student daily attendance records.</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Select the class:</label>
            <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
              <option value="">Select the class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Select the Batches:</label>
            <select className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#4b49ac] outline-none">
              <option value="">Select Batches...</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="bg-[#4b49ac] hover:bg-[#3f3e91] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
             <i className="fa-solid fa-magnifying-glass mr-2"></i> Search Attendances
          </button>
          <button className="bg-[#4b49ac] hover:bg-[#3f3e91] text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors">
             <i className="fa-solid fa-xmark mr-2"></i> Clear Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
          <h2 className="font-bold text-gray-800 border-l-4 border-[#008080] pl-3">Students Attendance List</h2>
          <button onClick={fetchSessions} className="border border-gray-200 px-3 py-1.5 rounded text-sm font-medium text-gray-600 hover:bg-gray-100 bg-white shadow-sm"><i className="fa-solid fa-rotate mr-2"></i> Reload</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 w-12 text-center">#</th>
                <th className="p-4">Attendance Name</th>
                <th className="p-4 text-center">Class</th>
                <th className="p-4 text-center">Batch</th>
                <th className="p-4">Subjects</th>
                <th className="p-4 text-center">Total Student</th>
                <th className="p-4 text-center">Total Present</th>
                <th className="p-4 text-center">Total Absent</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></td></tr>
              ) : sessions.length === 0 ? (
                <tr><td colSpan={9} className="p-8 text-center text-gray-400">No attendance records found</td></tr>
              ) : (
                sessions.map((s, idx) => (
                  <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="p-4 text-center text-sm font-bold text-[#4b49ac]">{idx + 1}</td>
                    <td className="p-4 text-sm font-bold text-[#4b49ac]">{s.title}</td>
                    <td className="p-4 text-center"><span className="bg-[#008080] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">{s.academicClass?.name}</span></td>
                    <td className="p-4 text-center"><span className="bg-[#9f5fdd] text-white text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap">{s.batch?.name}</span></td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{s.subjects || '-'}</td>
                    <td className="p-4 text-center text-sm font-bold text-[#45a1cd] bg-blue-50/30">{s.totalStudent}</td>
                    <td className="p-4 text-center text-sm font-bold text-green-600 bg-green-50/30">{s.totalPresent}</td>
                    <td className="p-4 text-center text-sm font-bold text-red-500 bg-red-50/30">{s.totalAbsent}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => openModal('VIEW', s)} title="View" className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors shadow-sm"><i className="fa-solid fa-eye"></i></button>
                        <button onClick={() => openModal('WHATSAPP', s)} title="WhatsApp Notifications" className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors shadow-sm"><i className="fa-brands fa-whatsapp"></i></button>
                        <button onClick={() => openModal('EDIT', s)} title="Edit" className="w-8 h-8 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-colors shadow-sm"><i className="fa-solid fa-pen-to-square"></i></button>
                        <button onClick={() => handleDelete(s.id)} title="Delete" className="w-8 h-8 bg-red-50 text-red-600 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors shadow-sm"><i className="fa-solid fa-trash"></i></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      {modalType && selectedSession && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
              <div>
                <h3 className="font-bold text-lg text-gray-900">
                  {modalType === 'VIEW' && 'View Attendance'}
                  {modalType === 'EDIT' && 'Edit Attendance'}
                  {modalType === 'WHATSAPP' && 'WhatsApp Notifications'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{selectedSession.title}</p>
              </div>
              <button onClick={closeModal} className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3">Student Name</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3">Note</th>
                    {modalType === 'WHATSAPP' && <th className="p-3 text-center">Send WA</th>}
                  </tr>
                </thead>
                <tbody>
                  {selectedSession.records.map((r: any, idx: number) => {
                    const isPresent = modalType === 'EDIT' ? editData[r.id]?.status === 'PRESENT' : r.status === 'PRESENT';
                    return (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="p-3 text-center text-sm text-gray-500">{idx + 1}</td>
                        <td className="p-3">
                          <p className="font-bold text-gray-800 text-sm">{r.student?.name}</p>
                          <p className="text-[10px] text-gray-500">{r.student?.phone}</p>
                        </td>
                        <td className="p-3 text-center">
                          {modalType === 'EDIT' ? (
                            <input 
                              type="checkbox" 
                              checked={isPresent} 
                              onChange={() => handleEditToggle(r.id)}
                              className="w-5 h-5 cursor-pointer accent-[#008080]"
                            />
                          ) : (
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isPresent ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {isPresent ? 'PRESENT' : 'ABSENT'}
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          {modalType === 'EDIT' ? (
                            <input 
                              type="text" 
                              value={editData[r.id]?.comment || ''} 
                              onChange={e => handleEditComment(r.id, e.target.value)}
                              placeholder="Add note..." 
                              className="border border-gray-200 rounded px-2 py-1 text-xs w-full outline-none focus:border-[#4b49ac]"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">{r.comment || '-'}</span>
                          )}
                        </td>
                        
                        {modalType === 'WHATSAPP' && (
                          <td className="p-3 text-center">
                            <button 
                              onClick={() => sendWhatsAppMsg(r)}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center gap-1 mx-auto"
                            >
                              <i className="fa-brands fa-whatsapp text-sm"></i> Send
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            {modalType === 'EDIT' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button onClick={closeModal} className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button onClick={saveEdit} disabled={savingEdit} className="px-6 py-2 bg-[#4b49ac] hover:bg-[#3f3e91] text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
            {modalType === 'WHATSAPP' && (
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center shrink-0">
                <p className="text-xs text-gray-500 italic"><i className="fa-solid fa-circle-info mr-1"></i> Make sure pop-ups are allowed if you want to open multiple tabs.</p>
                <button onClick={closeModal} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-bold transition-colors">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
