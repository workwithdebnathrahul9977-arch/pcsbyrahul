export default function Gallery() {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-900 mb-12">গ্যালারি</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-gray-200 h-64 rounded-xl flex items-center justify-center shadow hover:shadow-lg transition">
            <span className="text-gray-500 font-bold">[Image {i}]</span>
          </div>
        ))}
      </div>
    </div>
  )
}
