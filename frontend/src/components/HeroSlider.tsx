'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HeroSlider({ initialSliders }: { initialSliders?: any[] }) {
  const [sliders, setSliders] = useState<any[]>(initialSliders || []);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const [isLoading, setIsLoading] = useState(!initialSliders || initialSliders.length === 0);

  useEffect(() => {
    if (initialSliders && initialSliders.length > 0) {
      setIsLoading(false);
      return;
    }
    const fetchSliders = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/sliders`);
        if (res.data && res.data.length > 0) {
          setSliders(res.data);
        }
      } catch (error) {
        console.error('Failed to load sliders', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSliders();
  }, [initialSliders]);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders]);

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchStart(clientX);
    setTouchEnd(clientX); // Reset end position
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    setTouchEnd(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (touchStart - touchEnd > 50) {
      // Swiped left
      setCurrentIndex((prev) => (prev === sliders.length - 1 ? 0 : prev + 1));
    }
    
    if (touchStart - touchEnd < -50) {
      // Swiped right
      setCurrentIndex((prev) => (prev === 0 ? sliders.length - 1 : prev - 1));
    }
  };

  if (isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-100 animate-pulse rounded-xl md:rounded-2xl shadow-sm flex items-center justify-center overflow-hidden border border-gray-100">
        <i className="fa-solid fa-image text-4xl text-gray-200"></i>
      </div>
    );
  }

  if (sliders.length === 0) {
    return (
      <div className="w-full aspect-video bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl md:rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-2">
        <i className="fa-regular fa-images text-3xl"></i>
        <span className="font-medium text-sm">No slider images</span>
      </div>
    );
  }

  return (
    <div 
      className="w-full aspect-video relative rounded-xl shadow-inner bg-black overflow-hidden group touch-pan-y select-none cursor-grab active:cursor-grabbing"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
    >
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {sliders.map((slider) => (
          <a 
            key={slider.id}
            href={slider.link || '#'}
            target={slider.link ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="w-full h-full flex-shrink-0 relative block"
            draggable={false}
            onClick={(e) => {
              if (Math.abs(touchStart - touchEnd) > 10) {
                e.preventDefault(); // Prevent click if user was swiping
              }
            }}
          >
            <img 
              src={slider.imageUrl} 
              alt="Hero Slider" 
              className="w-full h-full object-cover pointer-events-none"
              draggable={false}
            />
          </a>
        ))}
      </div>

      {/* Navigation Dots */}
      {sliders.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-colors shadow-sm ${index === currentIndex ? 'bg-red-600' : 'bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
