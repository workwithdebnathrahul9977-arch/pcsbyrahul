'use client';

export default function RegenerateFeesPage() {
  return (
    <div className="max-w-[900px] mx-auto font-sans space-y-6">
      
      <h1 className="text-xl font-bold text-slate-800">Regenerate fee installments</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 space-y-8">
        
        {/* Single Student Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-dashed border-slate-200 pb-8">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Single Student Fee</h2>
            <p className="text-xs text-slate-500 mt-1">Quickly regenerate fees for a specific student using their ID.</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <i className="fa-solid fa-graduation-cap absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" placeholder="Enter Student ID (e.g. 27005)" className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <button className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
              <i className="fa-solid fa-search"></i> Search
            </button>
          </div>
        </div>

        {/* Bulk Batch Selection */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 mb-6">Bulk Batch Selection</h2>
          
          <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 mb-6">
            <h3 className="text-sm font-bold text-slate-800">Fee type <span className="text-red-500">*</span></h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Choose exactly one. Standard fees filter students who have that fee on file; Category loads all running students.</p>
            
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 bg-white px-4 py-2.5 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-200 transition-colors">
                <input type="radio" name="feeType" className="text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Admission fee</span>
              </label>
              <label className="flex items-center gap-2 bg-white px-4 py-2.5 border border-blue-500 rounded-lg cursor-pointer ring-1 ring-blue-500 shadow-sm transition-colors">
                <input type="radio" name="feeType" defaultChecked className="text-blue-600" />
                <span className="text-sm font-bold text-blue-700">Tuition fee</span>
              </label>
              <label className="flex items-center gap-2 bg-white px-4 py-2.5 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-200 transition-colors">
                <input type="radio" name="feeType" className="text-blue-600" />
                <span className="text-sm font-medium text-slate-600">Extra Fee</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Class</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600">
                <option>— Choose class —</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Batch</label>
              <select className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-600">
                <option>— Choose batch —</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold shadow-md transition-all flex items-center gap-2">
              <i className="fa-solid fa-search"></i> Filter Students
            </button>
            <button className="px-8 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg text-sm font-bold transition-all">
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
