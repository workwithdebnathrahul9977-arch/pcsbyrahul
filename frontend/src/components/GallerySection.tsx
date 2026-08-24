'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function GallerySection() {
  const [images, setImages] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if gallery is enabled
    axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_GALLERY`)
      .then(res => {
        if (res.data.value === 'true' || res.data.value === null) {
          setIsVisible(true);
          // Fetch images
          return axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/gallery`);
        }
        setIsVisible(false);
      })
      .then(res => {
        if (res) setImages(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !isVisible || images.length === 0) return null;

  // Split images into two rows
  const midIndex = Math.ceil(images.length / 2);
  const topRow = images.slice(0, midIndex);
  const bottomRow = images.slice(midIndex);

  return (
    <section className="py-12 md:py-20 bg-[#fafafa] overflow-hidden">
      <style jsx>{`
        @keyframes scrollRight {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes scrollLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-right {
          animation: scrollRight 40s linear infinite;
        }
        .animate-scroll-left {
          animation: scrollLeft 40s linear infinite;
        }
      `}</style>

      <div className="text-center mb-10 md:mb-16 px-4">
        <h2 className="text-2xl md:text-5xl font-black text-[#1a0505] mb-4">
          আর শেখার সেই পথেই <span className="text-red-600">গড়ে উঠছে</span>
        </h2>
        <p className="text-lg md:text-xl text-gray-700 font-medium">
          আত্মবিশ্বাসী সফল প্রজন্ম — <span className="text-red-600 font-bold">হাজারো কৃতী</span> শিক্ষার্থীর গল্প
        </p>
        <div className="w-16 h-1 bg-yellow-400 mx-auto mt-6 rounded"></div>
      </div>

      {/* Scrolling Marquee (Mobile & Desktop) */}
      <div className="space-y-4 md:space-y-6">
        {/* Top Row (Scrolls Right) */}
        <div className="flex w-[200%] animate-scroll-right">
          {[...topRow, ...topRow, ...topRow, ...topRow].map((img, i) => (
            <div key={i} className="w-[180px] h-[120px] md:w-[300px] md:h-[200px] flex-shrink-0 mx-2 md:mx-3 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
              <img src={img.imageUrl} className="w-full h-full object-cover" alt="Success Story" />
            </div>
          ))}
        </div>

        {/* Bottom Row (Scrolls Left) */}
        <div className="flex w-[200%] animate-scroll-left">
          {[...bottomRow, ...bottomRow, ...bottomRow, ...bottomRow].map((img, i) => (
            <div key={i} className="w-[180px] h-[120px] md:w-[300px] md:h-[200px] flex-shrink-0 mx-2 md:mx-3 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
              <img src={img.imageUrl} className="w-full h-full object-cover" alt="Success Story" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
