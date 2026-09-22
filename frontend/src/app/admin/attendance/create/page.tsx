'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function CreateAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [allSubjects, setAllSubjects] = useState<any[]>([]);
  
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const [attendanceData, setAttendanceData] = useState<Record<string, {status: string, comment: string}>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [settings, setSettings] = useState({ autoSelect: true });

  useEffect(() => {
    // Fetch initial data
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/classes`)
      .then(res => setClasses(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/subjects`)
      .then(res => setAllSubjects(res.data)).catch(console.error);
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/settings`)
      .then(res => setSettings(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (selectedClass) {
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/academic/batches?classId=${selectedClass}`)
        .then(res => setBatches(res.data)).catch(console.error);
    } else {
      setBatches([]);
    }
    setSelectedBatch('');
    setStudents([]);
  }, [selectedClass]);

  useEffect(() => {
    // Auto-select subjects if enabled
    if (selectedBatch && settings.autoSelect && allSubjects.length > 0) {
      setSelectedSubjects(allSubjects.map(s => s.name));
    }
  }, [selectedBatch, settings.autoSelect, allSubjects]);

  const toggleSubject = (subName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subName) ? prev.filter(s => s !== subName) : [...prev, subName]
    );
  };

  const searchStudents = async () => {
    if (!selectedClass || !selectedBatch) return toast.error('Please select class and batch');
    setLoadingStudents(true);
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/search-students?classId=${selectedClass}&batchId=${selectedBatch}`);
      setStudents(data);
      const initialData: any = {};
      data.forEach((s: any) => {
        initialData[s.id] = { status: 'PRESENT', comment: '' };
      });
      setAttendanceData(initialData);
    } catch (e) {
      toast.error('Failed to load students');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleAttendance = (studentId: string) => {
    setAttendanceData(prev => {
      const currentStatus = prev[studentId].status;
      return {
        ...prev,
        [studentId]: { ...prev[studentId], status: currentStatus === 'PRESENT' ? 'ABSENT' : 'PRESENT' }
      };
    });
  };

  const handleToggleAll = () => {
    const allPresent = Object.values(attendanceData).every(d => d.status === 'PRESENT');
    const newStatus = allPresent ? 'ABSENT' : 'PRESENT';
    const newData: any = {};
    students.forEach(s => {
      newData[s.id] = { ...attendanceData[s.id], status: newStatus };
    });
    setAttendanceData(newData);
  };

  const handleCommentChange = (studentId: string, comment: string) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: { ...prev[studentId], comment } }));
  };

  const handleSubmit = async () => {
    if (!selectedClass || !selectedBatch || !date || !startTime || !endTime) {
      return toast.error('Please fill all required fields');
    }
    
    const records = students.map(s => ({
      studentId: s.id,
      status: attendanceData[s.id].status,
      comment: attendanceData[s.id].comment
    }));

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/attendance/sessions`, {
        classId: selectedClass,
        batchId: selectedBatch,
        date, startTime, endTime, 
        subjects: selectedSubjects.join(', '),
        records
      });
      toast.success('Attendance saved successfully');
      setStudents([]);
    } catch (e) {
      toast.error('Failed to save attendance');
    }
  };

  const totalPresent = Object.values(attendanceData).filter(d => d.status === 'PRESENT').length;
  const totalAbsent = Object.values(attendanceData).filter(d => d.status === 'ABSENT').length;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 bg-[#008080] p-4 rounded-xl text-white shadow-sm">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <i className="fa-solid fa-layer-group"></i> Students Attendance
          </h1>
          <p className="text-sm opacity-90 mt-1">কোচিং সেন্টার অটো ব্যাচ কন্ট্রোলার</p>
        </div>
        <div className="bg-white/20 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div> সিস্টেম একটিভ
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Select Class</label>
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#008080] outline-none">
              <option value="">Choose a class..</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Select the Batches</label>
            <select value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#008080] outline-none">
              <option value="">Select Batches...</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="relative group">
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Select Subjects</label>
            <div className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-white min-h-[42px] cursor-pointer">
              {selectedSubjects.length > 0 ? selectedSubjects.join(', ') : <span className="text-gray-400">Select subjects...</span>}
            </div>
            {/* Dropdown for subjects */}
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg hidden group-hover:block z-10 max-h-48 overflow-y-auto">
              {allSubjects.length === 0 ? <div className="p-3 text-xs text-gray-500">No subjects found</div> : 
                allSubjects.map(sub => (
                  <label key={sub.id} className="flex items-center gap-2 p-3 hover:bg-gray-50 cursor-pointer text-sm border-b border-gray-50">
                    <input 
                      type="checkbox" 
                      checked={selectedSubjects.includes(sub.name)}
                      onChange={() => toggleSubject(sub.name)}
                      className="w-4 h-4 text-[#008080] rounded focus:ring-[#008080]"
                    />
                    {sub.name}
                  </label>
                ))
              }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Attendance Date *</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#008080] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Starting Time *</label>
            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#008080] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Ending Time *</label>
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#008080] outline-none" />
          </div>
        </div>
        
        <div className="flex justify-end pt-2">
          <button onClick={searchStudents} disabled={loadingStudents} className="bg-[#4b49ac] hover:bg-[#3f3e91] text-white px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-sm disabled:opacity-50">
            {loadingStudents ? 'Searching...' : 'Search Students'}
          </button>
        </div>
      </div>

      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
            <div>
              <span className="text-[10px] font-bold text-[#4b49ac] uppercase tracking-wider mb-1 block">Session Details</span>
              <p className="text-sm text-gray-600">
                Class: <span className="font-bold text-gray-900 mr-4">{classes.find(c=>c.id===selectedClass)?.name}</span> 
                Batch: <span className="font-bold text-gray-900">{batches.find(b=>b.id===selectedBatch)?.name}</span>
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-white px-5 py-2 rounded-lg border border-gray-200 shadow-sm"><span className="block text-[10px] font-bold text-gray-500 uppercase">Total Students</span><span className="font-bold text-gray-800 text-lg">{students.length}</span></div>
              <div className="text-center bg-[#f0fdf4] px-5 py-2 rounded-lg border border-[#bbf7d0] shadow-sm"><span className="block text-[10px] font-bold text-green-600 uppercase">Present</span><span className="font-bold text-green-700 text-lg">{totalPresent}</span></div>
              <div className="text-center bg-[#fef2f2] px-5 py-2 rounded-lg border border-[#fecaca] shadow-sm"><span className="block text-[10px] font-bold text-red-600 uppercase">Absent</span><span className="font-bold text-red-700 text-lg">{totalAbsent}</span></div>
            </div>
          </div>
          
          <div className="p-4 flex justify-between items-center bg-white">
             <div className="relative">
               <i className="fa-solid fa-search absolute left-3 top-3 text-gray-400 text-sm"></i>
               <input type="text" placeholder="Search by name or registration ID..." className="border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm w-72 focus:outline-none focus:border-[#4b49ac]" />
             </div>
             <button onClick={handleSubmit} className="bg-[#4b49ac] hover:bg-[#3f3e91] text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                Submit Attendance Summary
             </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1f2937] text-white text-xs uppercase tracking-wider">
                <th className="p-4 w-16 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 cursor-pointer accent-[#008080]" 
                      checked={totalPresent === students.length && students.length > 0}
                      onChange={handleToggleAll} 
                    />
                    <span className="text-[9px]">All</span>
                  </div>
                </th>
                <th className="p-4">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Guardian Number</th>
                <th className="p-4">Student Number</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Comment</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const isPresent = attendanceData[student.id]?.status === 'PRESENT';
                return (
                  <tr key={student.id} className={`border-b border-gray-100 transition-colors ${isPresent ? 'hover:bg-green-50/50' : 'bg-red-50/30 hover:bg-red-50/50'}`}>
                    <td className="p-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isPresent} 
                        onChange={() => handleToggleAttendance(student.id)}
                        className="w-5 h-5 cursor-pointer accent-[#008080]"
                      />
                    </td>
                    <td className="p-4">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold border border-gray-300 shadow-sm">{student.name.charAt(0)}</div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-gray-800 text-sm">{student.name}</td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{student.guardianMobile || '-'}</td>
                    <td className="p-4 text-sm text-gray-600 font-medium">{student.phone || '-'}</td>
                    <td className="p-4 text-center">
                      <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${isPresent ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        {isPresent ? 'PRESENT' : 'ABSENT'}
                      </span>
                    </td>
                    <td className="p-4">
                      <input 
                        type="text" 
                        value={attendanceData[student.id]?.comment || ''} 
                        onChange={e => handleCommentChange(student.id, e.target.value)}
                        placeholder="Add note..." 
                        className="border border-gray-200 rounded-lg px-3 py-2 text-xs w-full outline-none focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] transition-all bg-white"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
