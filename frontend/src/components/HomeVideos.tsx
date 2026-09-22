'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';

const VideoCard = ({ video, playingId, setPlayingId }: any) => {
  const isCurrent = playingId === video.id;

  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = video.youtubeUrl.match(regExp);
  const videoId = match ? match[1] : null;

  if (!videoId) return null;

  return (
    <div className="relative group bg-white rounded-2xl shadow-md md:shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden aspect-[9/16] shrink-0 snap-center w-[290px] md:w-auto mx-auto md:mx-0">
      <div className="absolute inset-0 w-full h-full bg-black">
        {isCurrent ? (
          <div 
            className="absolute inset-0 w-full h-full bg-black z-10 overflow-hidden cursor-pointer group/player" 
            onClick={() => setPlayingId(null)}
          >
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&disablekb=1&playsinline=1&mute=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 transform scale-[1.35] pointer-events-none"
            ></iframe>
            
            {/* Custom Pause Overlay - Fades in on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover/player:bg-black/30 transition-all duration-300 flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-2xl opacity-0 group-hover/player:opacity-100 transition-all duration-300 scale-75 group-hover/player:scale-100">
                <i className="fa-solid fa-pause text-2xl"></i>
              </div>
            </div>
            
            {/* Close Button to return to thumbnail */}
            <button onClick={(e) => { e.stopPropagation(); setPlayingId(null); }} className="absolute top-4 right-4 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover/player:opacity-100">
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        ) : (
          <>
            <img 
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} 
              alt={video.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <button 
                onClick={() => setPlayingId(video.id)}
                className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center backdrop-blur-md shadow-2xl transition-all hover:scale-110"
              >
                <i className="fa-solid fa-play text-2xl ml-1"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default function HomeVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await axios.get(`${url}/api/videos/public`);
        setVideos(res.data);
      } catch (error) {}
    };
    fetchVideos();
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    // item width = 290px (mobile card) + 16px (gap)
    const itemWidth = 290 + 16;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setActiveIndex(newIndex);
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const itemWidth = 290 + 16;
    scrollRef.current.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
    setActiveIndex(index);
  };

  if (videos.length === 0) return null;

  return (
    <div className="py-16 md:py-20 bg-gray-50 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 md:mb-4 tracking-tight">
            ক্যাম্পাস ট্যুর ও ক্লাসরুম
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-2">
            আমাদের ক্লাসরুমের পরিবেশ এবং কিছু ঝলক দেখে নিন।
          </p>
        </div>

        {/* Mobile Slider / Desktop Grid Container */}
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 md:pb-0"
        >
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} playingId={playingId} setPlayingId={setPlayingId} />
          ))}
        </div>

        {/* Mobile Navigation Dots */}
        <div className="flex justify-center items-center gap-2 mt-4 md:hidden">
          {videos.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? 'w-6 bg-red-600' 
                  : 'w-2 bg-gray-300 hover:bg-red-400'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        
      </div>
    </div>
  );
}
