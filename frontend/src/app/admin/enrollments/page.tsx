'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/enrollments`);
      setEnrollments(res.data);
    } catch (error) {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this student from the course?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/enrollments/${id}`);
      toast.success('Enrollment deleted');
      fetchEnrollments();
    } catch (error) {
      toast.error('Failed to delete enrollment');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/enrollments/${id}/status`, { status: newStatus });
      toast.success(`Enrollment marked as ${newStatus}`);
      fetchEnrollments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Enrollment Management</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow font-bold">
          + Manual Enroll
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Student</th>
              <th className="p-3 border-b">Course & Batch</th>
              <th className="p-3 border-b">Payment Mode</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  <div className="font-bold text-gray-900">{enrollment.user.name}</div>
                  <div className="text-xs text-gray-500">{enrollment.user.phone || enrollment.user.email}</div>
                </td>
                <td className="p-3 border-b">
                  <div className="font-bold text-gray-800 text-sm">{enrollment.batch.course.title}</div>
                  <div className="text-xs text-blue-600 font-bold">{enrollment.batch.name} - {enrollment.batch.schedule}</div>
                </td>
                <td className="p-3 border-b">
                  <span className="text-xs font-bold px-2 py-1 bg-gray-100 rounded text-gray-700">
                    {enrollment.batch.course.paymentType}
                  </span>
                </td>
                <td className="p-3 border-b">
                  <button 
                    onClick={() => handleStatusToggle(enrollment.id, enrollment.status)}
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      enrollment.status === 'ACTIVE' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {enrollment.status}
                  </button>
                </td>
                <td className="p-3 border-b text-right">
                  <button 
                    onClick={() => handleDelete(enrollment.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-bold"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">No enrollments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
