export default function AdminResults() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Exam Results</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <p className="text-gray-600">Publish or edit Model Test and Monthly Exam results.</p>
          <button className="bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700">
            + Publish Result
          </button>
        </div>
        <div className="text-center py-20 text-gray-400 border-t border-gray-100 mt-4">
          <i className="fa-solid fa-square-poll-vertical text-4xl mb-3 block"></i>
          <p>Exam results will be loaded from the API.</p>
        </div>
      </div>
    </div>
  )
}
