export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Total Students</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">1,254</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Active Courses</div>
          <div className="text-3xl font-bold text-green-600 mt-2">8</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Revenue (This Month)</div>
          <div className="text-3xl font-bold text-purple-600 mt-2">৳ 4,50,000</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-gray-500 text-sm">Pending Dues</div>
          <div className="text-3xl font-bold text-red-600 mt-2">৳ 25,000</div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Payments</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-gray-600">Student Name</th>
              <th className="py-3 px-4 text-gray-600">Course/Batch</th>
              <th className="py-3 px-4 text-gray-600">Amount</th>
              <th className="py-3 px-4 text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Rahul (Team Nexa)</td>
              <td className="py-3 px-4">HSC 2026 Physics</td>
              <td className="py-3 px-4">৳ 5000</td>
              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Paid</span></td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">Anisur Rahman</td>
              <td className="py-3 px-4">SSC 2026 Chemistry</td>
              <td className="py-3 px-4">৳ 3000</td>
              <td className="py-3 px-4"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Paid</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
