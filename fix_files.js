const fs = require('fs');

// Fix admin dashboard
let adminPage = \export default function AdminDashboard() {
  const stats = [
    { title: 'Total Students', value: '1,245', icon: 'fa-solid fa-users', color: 'bg-blue-500' },
    { title: 'New Admissions', value: '128', icon: 'fa-solid fa-user-plus', color: 'bg-green-500' },
    { title: 'Fee Collected', value: '৳ 4.2M', icon: 'fa-solid fa-money-bill-wave', color: 'bg-yellow-500' },
    { title: 'Active Batches', value: '24', icon: 'fa-solid fa-layer-group', color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800">Welcome Back, Admin!</h2>
          <p className="text-gray-500 text-sm mt-1">Here is the summary of your coaching center today.</p>
        </div>
        <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-md transition-colors flex items-center gap-2">
          <i className="fa-solid fa-plus"></i> Quick Admission
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={\\ w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl shadow-lg\}>
              <i className={stat.icon}></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-black text-gray-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      {/* ... rest of your code ... */}
    </div>
  );
}\;
// Let's just rewrite the whole admin page to avoid escaping hell
fs.writeFileSync('frontend/src/app/admin/page.tsx', adminPage);
