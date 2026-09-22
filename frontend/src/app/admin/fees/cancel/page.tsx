'use client';

export default function CancelRefundPage() {
  return (
    <div className="max-w-[1200px] mx-auto font-sans space-y-4">
      
      {/* Header */}
      <div className="bg-[#ef4444] rounded-xl p-4 md:p-6 text-white flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <i className="fa-solid fa-file-invoice text-xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold">Payment Cancel & Refund</h1>
          <p className="text-red-100 text-xs mt-0.5">Student এর পেমেন্ট বাতিল, রিফান্ড বা ডিলিট করুন</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded bg-blue-50 text-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-none">Student খুঁজুন</h3>
              <p className="text-[10px] text-slate-400 mt-1">Student ID দিয়ে সার্চ করুন</p>
            </div>
          </div>
          <div className="relative">
            <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input type="text" placeholder="Student ID লিখুন..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex items-end self-end mb-1">
          <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
            <i className="fa-solid fa-search"></i> সার্চ
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#2563eb] rounded-xl shadow-md p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 border-2 border-white/30 rounded-xl flex items-center justify-center bg-white/10">
            <i className="fa-regular fa-user text-2xl"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold">—</h2>
            <p className="text-blue-200 text-sm">ID: —</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">CLASS</p>
            <p className="font-bold">—</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">BATCH</p>
            <p className="font-bold">—</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 border border-white/10">
            <p className="text-[10px] text-blue-200 font-bold tracking-wider mb-1">INSTITUTE</p>
            <p className="font-bold">—</p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-red-50 text-red-500 flex items-center justify-center">
            <i className="fa-solid fa-clipboard-list text-xs"></i>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm leading-none">Payment History</h3>
            <p className="text-[10px] text-slate-400 mt-1">Cancel, Refund বা Delete করুন</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-[#1e293b] text-white">
                <th className="px-4 py-3 text-[10px] font-black uppercase">#</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">মাস (Month)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">পরিমাণ (Amount)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">ছাড় (Discount)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">ধরন (Fee Type)</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">Received Date</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase">Status</th>
                <th className="px-4 py-3 text-[10px] font-black uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-400 text-sm">
                  No payment history found. Search for a student to view their payments.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
