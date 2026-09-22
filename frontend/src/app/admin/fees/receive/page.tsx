'use client';
import { useState } from 'react';

export default function ReceiveFeePage() {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<any>(null);
  
  const [selectedMethod, setSelectedMethod] = useState('Cash');
  const [paymentNumber, setPaymentNumber] = useState('');
  const [partialAmount, setPartialAmount] = useState('');
  
  const [dues, setDues] = useState([
    { id: 1, type: 'Tuition Fee', month: 'August 2026', amount: 1500, selected: false }
  ]);

  const totalSelected = dues.filter(d => d.selected).reduce((acc, curr) => acc + curr.amount, 0);
  const payingAmount = partialAmount ? Number(partialAmount) : totalSelected;
  const dueRemaining = totalSelected > payingAmount ? totalSelected - payingAmount : 0;

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    try {
      const axios = (await import('axios')).default;
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await axios.get(`${API}/api/students?search=${search}`);
      if (res.data.students && res.data.students.length > 0) {
        setStudent(res.data.students[0]);
        // Mock dues for demonstration if none exist in DB (as we lack a robust fee schema right now)
        setDues([{ id: 1, type: 'Tuition Fee', month: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }), amount: 1500, selected: true }]);
        setPartialAmount('');
      } else {
        alert('Student not found!');
        setStudent(null);
      }
    } catch (e) {
      console.error(e);
      alert('Error searching student');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!student) return alert('Please select a student first');
    if (totalSelected === 0) return alert('Please select at least one due fee');
    if (payingAmount <= 0) return alert('Invalid amount');
    if (selectedMethod !== 'Cash' && !paymentNumber) return alert('Please enter account/mobile number for this payment method');
    
    try {
      const axios = (await import('axios')).default;
      const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const payload = {
        userId: student.id,
        enrollmentId: student.enrollments?.[0]?.id,
        amount: payingAmount,
        method: selectedMethod,
        paymentNumber: selectedMethod !== 'Cash' ? paymentNumber : undefined,
        month: dues.find(d => d.selected)?.month,
        status: 'PAID'
      };

      await axios.post(`${API}/api/payments`, payload);
      alert('Payment collected successfully!');
      
      // Reset
      setStudent(null);
      setSearch('');
      setPaymentNumber('');
      setPartialAmount('');
      setDues([{ id: 1, type: 'Tuition Fee', month: 'August 2026', amount: 1500, selected: false }]);
      
    } catch (e) {
      console.error(e);
      alert('Failed to process payment');
    }
  };
  
  return (
    <div className="max-w-[1200px] mx-auto bg-[#f0f4f8] font-sans space-y-6">
      
      {/* Header Box */}
      <div className="bg-[#2563eb] rounded-xl p-4 md:p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <i className="fa-solid fa-file-invoice text-2xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold">ফি সংগ্রহ করুন</h1>
            <p className="text-blue-100 text-xs mt-0.5">Student সার্চ করে ফি গ্রহণ করুন।</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-xs flex items-center gap-2 backdrop-blur-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          সিস্টেম একটিভ <span className="opacity-50 mx-1">|</span> {new Date().toLocaleDateString('bn-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Student খুঁজুন</h3>
            <p className="text-xs text-slate-400">নাম, ফোন নম্বর, Student ID — যেকোনো কিছু লিখুন</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              placeholder="নাম / ফোন / ID লিখুন..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button onClick={handleSearch} disabled={loading} className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-70">
            {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-search"></i>} সার্চ
          </button>
        </div>
      </div>

      {/* Student Profile Box */}
      <div className="bg-[#1e40af] rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 border-2 border-white/30 rounded-xl flex items-center justify-center bg-white/10 overflow-hidden">
            {student?.photoUrl ? (
              <img src={student.photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <i className="fa-regular fa-user text-2xl"></i>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold">{student ? student.name : '— (—)'}</h2>
            <p className="text-blue-200 text-sm">ID: {student ? (student.studentId || student.phone) : '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">CLASS</p>
            <p className="font-bold">{student?.studentClass || student?.enrollments?.[0]?.batch?.academicClass?.name || '—'}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">BATCH</p>
            <p className="font-bold">{student?.selectedBatch || student?.enrollments?.[0]?.batch?.name || '—'}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">RECEIVED BY</p>
            <p className="font-bold">Admin</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">INSTITUTE</p>
            <p className="font-bold truncate" title="PHYSCHEMIA With Sumel Sir">PHYSCHEMIA</p>
          </div>
        </div>
      </div>

      {/* Payment Information */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <i className="fa-solid fa-credit-card"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Payment Information</h3>
            <p className="text-xs text-slate-400">বকেয়া ফি — Checkbox দিয়ে সিলেক্ট করুন</p>
          </div>
        </div>
        
        {student ? (
          <div className="space-y-3">
            {dues.map((due, idx) => (
              <label key={due.id} className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-colors ${due.selected ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 hover:border-slate-300'}`}>
                <div className="flex items-center gap-4">
                  <input 
                    type="checkbox" 
                    checked={due.selected}
                    onChange={(e) => {
                      const newDues = [...dues];
                      newDues[idx].selected = e.target.checked;
                      setDues(newDues);
                    }}
                    className="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{due.type}</h4>
                    <p className="text-xs text-slate-500">{due.month}</p>
                  </div>
                </div>
                <div className="font-black text-emerald-600">৳ {due.amount}</div>
              </label>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-slate-400 text-sm">
            No dues found. Search and select a student first.
          </div>
        )}
      </div>

      {/* Amount Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded bg-amber-50 text-amber-500 flex items-center justify-center">
            <i className="fa-solid fa-chart-simple"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Amount Summary</h3>
            <p className="text-xs text-slate-400">স্বয়ংক্রিয় Live Calculation</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-2 font-bold">মোট নির্বাচিত</p>
            <h3 className="text-2xl font-black text-slate-800">৳ {totalSelected}</h3>
          </div>
          <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/30">
            <p className="text-xs text-indigo-500 mb-2 font-bold">আংশিক পেমেন্ট</p>
            <div className="flex items-center border-b-2 border-indigo-500">
              <input 
                type="number" 
                value={partialAmount} 
                onChange={e => setPartialAmount(e.target.value)}
                placeholder={totalSelected.toString()} 
                className="w-full bg-transparent text-xl font-bold text-indigo-900 outline-none pb-1" 
              />
              <span className="text-indigo-400 font-bold pb-1">৳</span>
            </div>
          </div>
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <p className="text-xs text-red-500 mb-2 font-bold">বকেয়া (DUE)</p>
            <h3 className="text-2xl font-black text-red-600">৳ {dueRemaining}</h3>
          </div>
          <div className="bg-emerald-600 rounded-lg p-4 text-white shadow-md">
            <p className="text-xs text-emerald-100 mb-2 font-bold flex items-center gap-1.5"><i className="fa-solid fa-check-circle"></i> এখন পরিশোধযোগ্য</p>
            <h3 className="text-2xl font-black">৳ {payingAmount}</h3>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded bg-purple-50 text-purple-500 flex items-center justify-center">
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Payment Method</h3>
            <p className="text-xs text-slate-400">পেমেন্টের ধরন নির্বাচন করুন</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {['Cash', 'bKash', 'Nagad', 'Bank'].map((method, i) => {
            const isSelected = selectedMethod === method;
            return (
              <label key={method} className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${isSelected ? 'border-blue-500 bg-blue-50/50' : 'border-slate-100 hover:border-slate-300'}`}>
                <input 
                  type="radio" 
                  name="method" 
                  value={method}
                  checked={isSelected}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="sr-only" 
                />
                {isSelected && <i className="fa-solid fa-check text-blue-500 absolute top-2 right-2 text-xs"></i>}
                <i className={`fa-solid ${method === 'Cash' ? 'fa-money-bill-1-wave text-green-500' : method === 'bKash' ? 'fa-spa text-pink-500' : method === 'Nagad' ? 'fa-fire text-orange-500' : 'fa-building-columns text-slate-500'} text-2xl`}></i>
                <div className="text-center">
                  <p className={`font-bold text-sm ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>{method}</p>
                  <p className="text-[10px] text-slate-400">{method === 'Cash' ? 'নগদ' : method === 'Bank' ? 'ট্রান্সফার' : 'মোবাইল ব্যাংকিং'}</p>
                </div>
              </label>
            );
          })}
        </div>

        {/* Conditional Number Input */}
        {selectedMethod !== 'Cash' && (
          <div className="animate-fade-in-down border-t border-slate-100 pt-4">
            <label className="block text-xs font-bold text-slate-500 mb-2">নম্বর লিখুন (Account/Mobile Number)</label>
            <input 
              type="text" 
              placeholder="01XXXXXXXXX" 
              value={paymentNumber}
              onChange={(e) => setPaymentNumber(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Receipt Details */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded bg-slate-100 text-slate-500 flex items-center justify-center">
            <i className="fa-solid fa-receipt"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Receipt Details</h3>
            <p className="text-xs text-slate-400">প্রাপ্তি রশিদের তথ্য</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><i className="fa-solid fa-user"></i> RECEIVED BY</label>
            <input type="text" defaultValue="Sumel" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" readOnly />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1"><i className="fa-solid fa-bars-staggered"></i> NOTE / মন্তব্য</span>
              <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">বন্ধ</span>
            </label>
            <input type="text" placeholder="Note বন্ধ আছে" className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm outline-none" disabled />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 flex items-center gap-1"><i className="fa-solid fa-calendar"></i> তারিখ</label>
            <input type="text" defaultValue="২৭ আগস্ট, ২০২৬" className="w-full border border-blue-200 bg-blue-50 text-blue-700 font-bold rounded-lg px-4 py-2.5 text-sm outline-none" readOnly />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
           <button onClick={handlePayment} className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg transition-all flex items-center gap-2">
            <i className="fa-solid fa-check-double"></i> পেমেন্ট সম্পন্ন করুন
           </button>
        </div>
      </div>

    </div>
  );
}
