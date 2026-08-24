'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TestimonialSlider() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);
  const [itemsPerView, setItemsPerView] = useState(3);

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/testimonials`),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/settings/SHOW_TESTIMONIALS`).catch(() => ({ data: { value: 'true' } }))
    ])
      .then(([testRes, settingRes]) => {
        setTestimonials(testRes.data);
        setShow(settingRes.data.value !== 'false');
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerView(1);
      } else {
        setItemsPerView(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (testimonials.length === 0 || !show) return null;

  const maxIndex = Math.max(0, testimonials.length - itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
  };

  return (
    <section className="bg-gradient-to-b from-red-800 to-red-900 py-16 md:py-24 relative overflow-hidden border-y border-red-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-black text-white inline-block relative pb-4">
            শিক্ষার্থীদের অভিমত
            <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded"></span>
          </h2>
        </div>

        <div className="relative w-full mx-auto px-10">
          {/* Navigation Arrows */}
          {testimonials.length > itemsPerView && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-950 hover:bg-red-600 border border-red-900/50 hover:border-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all duration-300 z-20 shadow-lg"
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <button 
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-red-950 hover:bg-red-600 border border-red-900/50 hover:border-red-600 text-red-400 hover:text-white flex items-center justify-center transition-all duration-300 z-20 shadow-lg"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </>
          )}

          {/* Slider Track */}
          <div className="overflow-hidden px-2 py-4">
            <div 
              className="flex transition-transform duration-500 ease-out" 
              style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
            >
              {testimonials.map((t, idx) => (
                <div 
                  key={idx} 
                  className="w-full md:w-1/3 flex-shrink-0 px-3"
                >
                  <div className="bg-red-950/80 backdrop-blur-sm border border-red-900/30 rounded-[20px] p-6 shadow-xl h-full flex flex-col items-center text-center relative group transition-all duration-500 hover:-translate-y-2 hover:border-red-500/50 hover:shadow-red-900/50 hover:bg-red-950">
                    
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-red-600 to-red-400 mb-4 group-hover:scale-110 transition-transform duration-500 shadow-md">
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        {t.imageUrl ? (
                          <img src={t.imageUrl} alt={t.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-red-600">
                            {t.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-white mb-1 group-hover:text-red-400 transition-colors">{t.name}</h3>
                    <p className="text-xs md:text-sm text-red-200/60 font-medium mb-4">
                      {t.school}
                    </p>

                    <div className="relative mt-auto pt-4">
                      <i className="fa-solid fa-quote-left absolute -top-2 left-0 text-2xl text-red-900/40 group-hover:text-red-900/80 transition-colors"></i>
                      <p className="text-gray-300 font-medium italic text-sm md:text-base leading-relaxed px-4">
                        "{t.opinion}"
                      </p>
                      <i className="fa-solid fa-quote-right absolute -bottom-2 right-0 text-2xl text-red-900/40 group-hover:text-red-900/80 transition-colors"></i>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          {testimonials.length > itemsPerView && (
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-red-900/40 hover:bg-red-400/60'
                  }`}
                ></button>
              ))}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
