'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, PAID, OVERDUE

  useEffect(() => {
    fetchPayments();
  }, [filter]);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payments?status=${filter}`);
      setPayments(res.data);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/payments/${id}/status`, { status: newStatus });
      toast.success(`Payment marked as ${newStatus}`);
      fetchPayments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  const totalCollected = payments.filter(p => p.status === 'PAID').reduce((acc, curr) => acc + curr.amount, 0);
  const totalPending = payments.filter(p => p.status !== 'PAID').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Payment Management</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow border-l-4 border-green-500">
          <p className="text-gray-500 text-sm font-bold">Total Collected (Shown below)</p>
          <p className="text-2xl font-black text-green-600">৳ {totalCollected}</p>
        </div>
        <div className="bg-white p-4 rounded shadow border-l-4 border-red-500">
          <p className="text-gray-500 text-sm font-bold">Total Due (Shown below)</p>
          <p className="text-2xl font-black text-red-600">৳ {totalPending}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2">
        {['ALL', 'PENDING', 'OVERDUE', 'PAID'].map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded text-sm font-bold ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-3 border-b">Student Info</th>
              <th className="p-3 border-b">Course / Batch</th>
              <th className="p-3 border-b">Month / Purpose</th>
              <th className="p-3 border-b">Amount</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map(payment => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  <div className="font-bold text-gray-900">{payment.user.name}</div>
                  <div className="text-xs text-gray-500">{payment.user.phone}</div>
                </td>
                <td className="p-3 border-b">
                  <div className="font-bold text-gray-800 text-sm">{payment.enrollment?.batch?.course?.title || 'General'}</div>
                  <div className="text-xs text-gray-500">{payment.enrollment?.batch?.name}</div>
                </td>
                <td className="p-3 border-b font-medium text-gray-700">{payment.month || 'Full Course Fee'}</td>
                <td className="p-3 border-b font-bold text-gray-900">৳ {payment.amount}</td>
                <td className="p-3 border-b">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    payment.status === 'PAID' ? 'bg-green-100 text-green-700' : 
                    payment.status === 'OVERDUE' ? 'bg-red-100 text-red-700' : 
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="p-3 border-b text-right space-x-2">
                  {payment.status !== 'PAID' && (
                    <button 
                      onClick={() => handleStatusChange(payment.id, 'PAID')}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-bold"
                    >
                      Mark Paid
                    </button>
                  )}
                  {payment.status === 'PAID' && (
                    <button 
                      onClick={() => handleStatusChange(payment.id, 'PENDING')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-xs font-bold"
                    >
                      Undo
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">No payments found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
