'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none bg-white";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export default function BatchManagementPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState('');

  const [formData, setFormData] = useState({
    classId: '', groupId: '', subjectIds: [] as string[],
    name: '', sessionYear: '', startingDate: '', closingDate: '',
    admissionFee: 0, tuitionFee: 0, courseFee: 0
  });

  const fetchData = async () => {
    const [bRes, cRes, gRes, sRes] = await Promise.all([
      axios.get(`${API}/api/academic/batches`),
      axios.get(`${API}/api/academic/classes`),
      axios.get(`${API}/api/academic/groups`),
      axios.get(`${API}/api/academic/subjects`),
    ]);
    setBatches(bRes.data);
    setClasses(cRes.data);
    setGroups(gRes.data);
    setSubjects(sRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubjectChange = (id: string) => {
    setFormData(prev => ({
      ...prev,
      subjectIds: prev.subjectIds.includes(id)
        ? prev.subjectIds.filter(s => s !== id)
        : [...prev.subjectIds, id]
    }));
  };

  const openCreateModal = () => {
    setEditMode(false);
    setEditId('');
    setFormData({ classId: '', groupId: '', subjectIds: [], name: '', sessionYear: '', startingDate: '', closingDate: '', admissionFee: 0, tuitionFee: 0, courseFee: 0 });
    setShowModal(true);
  };

  const openEditModal = (b: any) => {
    setEditMode(true);
    setEditId(b.id);
    setFormData({
      classId: b.classId || '',
      groupId: b.groupId || '',
      subjectIds: b.subjects?.map((s: any) => s.id) || [],
      name: b.name || '',
      sessionYear: b.sessionYear || '',
      startingDate: b.startingDate ? new Date(b.startingDate).toISOString().split('T')[0] : '',
      closingDate: b.closingDate ? new Date(b.closingDate).toISOString().split('T')[0] : '',
      admissionFee: b.admissionFee || 0,
      tuitionFee: b.tuitionFee || 0,
      courseFee: b.courseFee || 0
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editMode) {
      await axios.put(`${API}/api/academic/batches/${editId}`, formData);
      toast.success('Batch updated!');
    } else {
      await axios.post(`${API}/api/academic/batches`, formData);
      toast.success('Batch created!');
    }
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this batch?')) return;
    await axios.delete(`${API}/api/academic/batches/${id}`);
    toast.success('Deleted!');
    fetchData();
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[80vh]">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Batch Management</h2>
          <p className="text-gray-500 text-sm">Create and manage student batches for each class</p>
        </div>
        <button onClick={openCreateModal} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-sm flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Create Batch
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-100 rounded-xl">
        <table className="w-full text-left border-collapse min-w-max text-sm">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-100">
              <th className="p-4 font-bold">#</th>
              <th className="p-4 font-bold">Batch Name</th>
              <th className="p-4 font-bold">Class</th>
              <th className="p-4 font-bold">Session</th>
              <th className="p-4 font-bold">Start Date</th>
              <th className="p-4 font-bold">Close Date</th>
              <th className="p-4 font-bold">Adm. Fee</th>
              <th className="p-4 font-bold">Tuition Fee</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.length === 0 ? (
              <tr><td colSpan={9} className="p-8 text-center text-gray-400">No batches found. Create one!</td></tr>
            ) : batches.map((b: any, i) => (
              <tr key={b.id} className="border-b border-gray-50 hover:bg-red-50/30 transition">
                <td className="p-4 text-gray-400">{i + 1}</td>
                <td className="p-4 font-semibold text-gray-900">{b.name}</td>
                <td className="p-4 text-gray-600">{classes.find((c: any) => c.id === b.classId)?.name || '-'}</td>
                <td className="p-4 text-gray-600">{b.sessionYear || '-'}</td>
                <td className="p-4 text-gray-500">{b.startingDate ? new Date(b.startingDate).toLocaleDateString('en-BD') : '-'}</td>
                <td className="p-4 text-gray-500">{b.closingDate ? new Date(b.closingDate).toLocaleDateString('en-BD') : '-'}</td>
                <td className="p-4 text-gray-600">৳{b.admissionFee || 0}</td>
                <td className="p-4 text-gray-600">৳{b.tuitionFee || 0}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEditModal(b)} className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition mr-1">
                    <i className="fa-solid fa-pen text-sm"></i>
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition">
                    <i className="fa-solid fa-trash text-sm"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-black text-gray-900">
                {editMode ? 'Edit Batch' : 'Create New Batch'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto">
              <form id="batchForm" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><span className="text-red-500 mr-1">*</span>Class</label>
                    <select required value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} className={inputClass}>
                      <option value="">Select Class</option>
                      {classes.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}><span className="text-red-500 mr-1">*</span>Group</label>
                    <select required value={formData.groupId} onChange={e => setFormData({...formData, groupId: e.target.value})} className={inputClass}>
                      <option value="">Select Group</option>
                      {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}><span className="text-red-500 mr-1">*</span>Batch Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. SSC 2025 Final Revision" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}><span className="text-red-500 mr-1">*</span>Session Year</label>
                    <input type="text" required value={formData.sessionYear} onChange={e => setFormData({...formData, sessionYear: e.target.value})} placeholder="e.g. 2025" className={inputClass} />
                  </div>
                  <div></div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" value={formData.startingDate} onChange={e => setFormData({...formData, startingDate: e.target.value})} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Close Date</label>
                    <input type="date" value={formData.closingDate} onChange={e => setFormData({...formData, closingDate: e.target.value})} className={inputClass} />
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <label className={labelClass}>Subjects</label>
                  <div className="border border-gray-200 rounded-xl max-h-32 overflow-y-auto p-2 space-y-1 bg-gray-50">
                    {subjects.map((s: any) => (
                      <label key={s.id} className="flex items-center gap-2.5 text-sm p-1.5 hover:bg-white rounded-lg cursor-pointer transition">
                        <input
                          type="checkbox"
                          checked={formData.subjectIds.includes(s.id)}
                          onChange={() => handleSubjectChange(s.id)}
                          className="accent-red-600"
                        />
                        <span className="text-gray-700 font-medium">{s.name}</span>
                      </label>
                    ))}
                    {subjects.length === 0 && <p className="text-gray-400 text-xs p-2">No subjects added yet</p>}
                  </div>
                </div>

                {/* Fees */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Fee Structure</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Admission Fee</label>
                      <input type="number" value={formData.admissionFee} onChange={e => setFormData({...formData, admissionFee: Number(e.target.value)})} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Tuition Fee</label>
                      <input type="number" value={formData.tuitionFee} onChange={e => setFormData({...formData, tuitionFee: Number(e.target.value)})} className={inputClass} placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-600 mb-1">Course Fee</label>
                      <input type="number" value={formData.courseFee} onChange={e => setFormData({...formData, courseFee: Number(e.target.value)})} className={inputClass} placeholder="0" />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} type="button" className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
                Cancel
              </button>
              <button form="batchForm" type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition shadow-sm">
                {editMode ? 'Update Batch' : 'Create Batch'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
