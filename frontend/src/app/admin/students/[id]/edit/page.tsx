'use client';
import { useState, useEffect, use } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function EditStudent({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/students/${id}`);
      if (data) setFormData(data);
    } catch (e) {
      toast.error('Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/students/${id}`, formData);
      toast.success('Student updated successfully!');
      router.push('/admin/students');
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400"><i className="fa-solid fa-spinner fa-spin text-2xl"></i></div>;
  if (!formData) return <div className="p-8 text-center text-red-500 font-bold">Student not found.</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Student</h1>
          <p className="text-sm text-gray-500">Update registration details for {formData.name}</p>
        </div>
        <Link href="/admin/students" className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 shadow-sm transition-colors">
          <i className="fa-solid fa-arrow-left mr-2"></i> Back to Directory
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Personal Details */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-regular fa-user text-[#4b49ac]"></i> Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Full Name</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Email Address</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Phone (Primary)</label>
              <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" required />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">WhatsApp</label>
              <input type="text" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Gender</label>
              <select name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Date of Birth</label>
              <input type="date" name="dob" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Blood Group</label>
              <input type="text" name="bloodGroup" value={formData.bloodGroup || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" placeholder="e.g. O+" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Religion</label>
              <select name="religion" value={formData.religion || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none">
                <option value="">Select Religion</option>
                <option value="Islam">Islam</option>
                <option value="Hinduism">Hinduism</option>
                <option value="Christianity">Christianity</option>
                <option value="Buddhism">Buddhism</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-graduation-cap text-[#4b49ac]"></i> Academic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Class</label>
              <input type="text" name="studentClass" value={formData.studentClass || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Batch Name</label>
              <input type="text" name="selectedBatch" value={formData.selectedBatch || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Group</label>
              <input type="text" name="group" value={formData.group || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Subject</label>
              <input type="text" name="subject" value={formData.subject || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">School / College Name</label>
              <input type="text" name="schoolName" value={formData.schoolName || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">School Roll</label>
              <input type="text" name="schoolRoll" value={formData.schoolRoll || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
        </div>

        {/* System & IDs Details */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-id-card text-[#4b49ac]"></i> System IDs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Student ID (Username)</label>
              <input type="text" name="studentId" value={formData.studentId || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Registration No</label>
              <input type="text" name="registrationNo" value={formData.registrationNo || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Registration Year</label>
              <input type="text" name="registrationYear" value={formData.registrationYear || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
        </div>

        {/* Family Details */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-people-roof text-[#4b49ac]"></i> Family Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Father's Name</label>
              <input type="text" name="fatherName" value={formData.fatherName || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Father's Mobile</label>
              <input type="text" name="fatherMobile" value={formData.fatherMobile || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Father's Occupation</label>
              <input type="text" name="fatherOccupation" value={formData.fatherOccupation || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Mother's Name</label>
              <input type="text" name="motherName" value={formData.motherName || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Mother's Mobile</label>
              <input type="text" name="motherMobile" value={formData.motherMobile || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Mother's Occupation</label>
              <input type="text" name="motherOccupation" value={formData.motherOccupation || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Local Guardian Mobile</label>
              <input type="text" name="guardianMobile" value={formData.guardianMobile || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><i className="fa-solid fa-map-location-dot text-[#4b49ac]"></i> Address Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Present Address</label>
              <textarea name="presentAddress" value={formData.presentAddress || ''} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">Permanent Address</label>
              <textarea name="permanentAddress" value={formData.permanentAddress || ''} onChange={handleChange} rows={3} className="w-full border border-gray-200 rounded-lg p-2.5 text-sm focus:border-[#4b49ac] focus:ring-1 focus:ring-[#4b49ac] outline-none resize-none" />
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex justify-end gap-3">
          <Link href="/admin/students" className="px-8 py-3 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-100 shadow-sm transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="px-8 py-3 bg-[#4b49ac] hover:bg-[#3f3e91] text-white rounded-lg text-sm font-bold shadow-sm transition-colors disabled:opacity-50">
            {saving ? 'Saving Changes...' : 'Save All Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
