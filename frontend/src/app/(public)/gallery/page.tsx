'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Gallery() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/albums`);
        setAlbums(res.data);
      } catch (error) {
        console.error('Failed to load albums');
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <div className="bg-[#fef9f9] min-h-screen pb-24 font-sans">
      <div className="max-w-[1450px] mx-auto px-5 md:px-8 pt-10 md:pt-16">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div> GALLERY
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-2">আমাদের গ্যালারী</h1>
            <p className="text-gray-500 text-sm md:text-base max-w-2xl">আমাদের সফলতার পেছনে যারা নিষ্ঠা ও দক্ষতার সাথে কাজ করে সেরা অভিজ্ঞতা নিশ্চিত করছেন, তাদের মুহূর্তগুলো।</p>
          </div>
        </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-500 font-bold">লোড হচ্ছে...</p>
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 text-gray-400 font-bold text-xl bg-white rounded-2xl shadow-sm border border-gray-100">
          কোনো ছবি পাওয়া যায়নি!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {albums.map((album) => (
            <div 
              key={album.id} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
              onClick={() => setSelectedAlbum(album)}
            >
              <div className="h-48 relative overflow-hidden bg-gray-100">
                {album.images && album.images.length > 0 ? (
                  <>
                    <img 
                      src={album.images[0]} 
                      alt={album.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {album.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                        +{album.images.length - 1} Photos
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">{album.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">{album.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Album Lightbox Modal */}
      {selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex flex-col p-4 md:p-8 animate-in fade-in duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-white text-2xl md:text-3xl font-bold">{selectedAlbum.title}</h2>
              <p className="text-gray-400 mt-2 max-w-3xl text-sm md:text-base leading-relaxed">{selectedAlbum.content}</p>
            </div>
            <button 
              onClick={() => setSelectedAlbum(null)} 
              className="bg-white/10 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors text-2xl"
            >
              &times;
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-10">
              {selectedAlbum.images?.map((img: string, idx: number) => (
                <div key={idx} className="rounded-xl overflow-hidden bg-gray-900 aspect-video shadow-lg ring-1 ring-white/10">
                  <img src={img} alt={`${selectedAlbum.title} ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
