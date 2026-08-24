export default function Results() {
  return (
    <div className="py-16 px-4 md:px-8 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-4">রেজাল্ট অনুসন্ধান</h1>
      <p className="text-center text-gray-600 mb-10 text-lg">
        তোমার রোল নাম্বার এবং পরীক্ষার নাম দিয়ে মডেল টেস্ট ও মান্থলি টেস্টের রেজাল্ট দেখো।
      </p>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <form className="flex flex-col gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">পরীক্ষার নাম / টাইপ</label>
            <select className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Model Test 1 - Physics</option>
              <option>Monthly Exam - Jan (Chemistry)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-700 font-bold mb-2">স্টুডেন্ট আইডি / রোল</label>
            <input type="text" placeholder="e.g. 2601001" className="w-full border border-gray-300 p-3 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <button type="button" className="bg-blue-600 text-white font-bold py-3 rounded-lg mt-2 hover:bg-blue-800 transition">
            রেজাল্ট খুঁজুন
          </button>
        </form>
      </div>
      
      {/* Result Placeholder */}
      <div className="mt-12 bg-green-50 p-6 rounded-xl border border-green-200 text-center hidden">
         <h2 className="text-2xl font-bold text-green-800 mb-2">Congratulations!</h2>
         <p className="text-gray-700">Name: <strong>Rahul</strong></p>
         <p className="text-gray-700">Marks: <strong>95/100</strong></p>
      </div>
    </div>
  )
}
