'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HeroSlider() {
  const [sliders, setSliders] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/sliders`);
        if (res.data && res.data.length > 0) {
          setSliders(res.data);
        }
      } catch (error) {
        console.error('Failed to load sliders', error);
      }
    };
    fetchSliders();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  if (sliders.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-2xl flex items-center justify-center shadow-xl border-4 border-white">
        <span className="text-gray-400 font-bold text-sm md:text-xl">No slider images uploaded yet</span>
      </div>
    );
  }

  const currentSlider = sliders[currentIndex];

  return (
    <div className="w-full aspect-video relative rounded-2xl shadow-xl border-4 border-white overflow-hidden group">
      {sliders.map((slider, index) => (
        <a 
          key={slider.id}
          href={slider.link || '#'}
          target={slider.link ? "_blank" : "_self"}
          rel="noopener noreferrer"
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 cursor-default pointer-events-none'}`}
        >
          <img 
            src={slider.imageUrl} 
            alt="Hero Slider" 
            className="w-full h-full object-fill"
          />
        </a>
      ))}

      {/* Navigation Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors shadow-sm ${index === currentIndex ? 'bg-red-600' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
