export default function AdminStudents() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Student Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600 mb-4">Here you can view and manage all registered students.</p>
        <div className="text-center py-20 text-gray-400">
          <i className="fa-solid fa-users text-4xl mb-3 block"></i>
          <p>Student list will be loaded from the API.</p>
        </div>
      </div>
    </div>
  )
}
