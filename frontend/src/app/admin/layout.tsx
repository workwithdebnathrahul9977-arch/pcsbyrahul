import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 text-center text-2xl font-extrabold border-b border-gray-800">
          Admin Panel
        </div>
          <nav className="flex-1 px-4 py-6 space-y-2 text-white">
            <Link href="/admin" className="block px-4 py-2 rounded hover:bg-gray-700">Overview</Link>
            <Link href="/admin/courses" className="block px-4 py-2 rounded hover:bg-gray-700">Courses</Link>
            <Link href="/admin/categories" className="block px-4 py-2 rounded hover:bg-gray-700">Course Categories</Link>
            <Link href="/admin/enrollments" className="block px-4 py-2 rounded hover:bg-gray-700">Enrollments (Students)</Link>
            <Link href="/admin/payments" className="block px-4 py-2 rounded hover:bg-gray-700">Payments</Link>
            <Link href="/admin/results" className="block px-4 py-2 rounded hover:bg-gray-700">Results</Link>
            <Link href="/admin/notices" className="block px-4 py-2 rounded hover:bg-gray-700">Notice Board</Link>
            <Link href="/admin/testimonials" className="block px-4 py-2 rounded hover:bg-gray-700">Student Opinions</Link>
            <Link href="/admin/team" className="block px-4 py-2 rounded hover:bg-gray-700">Team Management</Link>
            <Link href="/admin/gallery" className="block px-4 py-2 rounded hover:bg-gray-700">Success Gallery</Link>
            <Link href="/admin/albums" className="block px-4 py-2 rounded hover:bg-gray-700">Photo Albums</Link>
            <Link href="/admin/popup" className="block px-4 py-2 rounded hover:bg-gray-700">Popup Management</Link>
            <Link href="/admin/sliders" className="block px-4 py-2 rounded hover:bg-gray-700">Sliders</Link>
            <Link href="/admin/settings" className="block px-4 py-2 rounded hover:bg-gray-700">Settings</Link>
          </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="block p-3 text-center text-red-400 hover:text-red-300">Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="bg-white p-4 shadow flex justify-between items-center md:hidden">
            <div className="font-bold text-xl">Admin Panel</div>
            <button className="text-gray-600">Menu</button>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
