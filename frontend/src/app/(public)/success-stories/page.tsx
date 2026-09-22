// Server Component — no loading state, data fetched server-side instantly

async function getStories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/success-stories`,
      { next: { revalidate: 30 } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function SuccessStories() {
  const stories = await getStories();

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> SUCCESS STORIES
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">কৃতি শিক্ষার্থী</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">আমাদের সফল শিক্ষার্থীদের গল্প ও তাদের অসামান্য সাফল্যের মুহূর্তগুলো।</p>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-20 text-gray-400 font-bold text-xl bg-white rounded-2xl shadow-sm border border-gray-100">
            কোনো তথ্য পাওয়া যায়নি!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {stories.map((story: any) => (
              <div 
                key={story.id} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group transform hover:-translate-y-1 flex flex-col"
              >
                <div className="h-56 relative overflow-hidden bg-gray-100 shrink-0">
                  {story.imageUrl ? (
                    <img 
                      src={story.imageUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><i className="fa-solid fa-image text-3xl"></i></div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-800 mb-3 group-hover:text-red-600 transition-colors line-clamp-2">{story.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed whitespace-pre-wrap">{story.content}</p>
                  <div className="mt-auto pt-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {new Date(story.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
