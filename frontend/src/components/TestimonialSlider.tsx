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
    <section className="bg-gray-50 py-16 md:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-[2rem] p-6 md:p-12 shadow-2xl">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-white inline-block relative pb-4">
              শিক্ষার্থীদের অভিমত
              <span className="absolute bottom-0 left-0 w-full h-1 bg-white/50 rounded"></span>
            </h2>
          </div>

          <div className="relative w-full mx-auto px-6 md:px-10">
            {/* Navigation Arrows */}
            {testimonials.length > itemsPerView && (
              <>
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-red-600 border border-white/20 flex items-center justify-center transition-all duration-300 z-20 shadow-lg backdrop-blur-sm"
                >
                  <i className="fa-solid fa-chevron-left"></i>
                </button>

                <button 
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white text-white hover:text-red-600 border border-white/20 flex items-center justify-center transition-all duration-300 z-20 shadow-lg backdrop-blur-sm"
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
                    className="w-full md:w-1/3 flex-shrink-0 px-2 md:px-3"
                  >
                    <div className="bg-[#1a0505] rounded-[1.5rem] p-6 shadow-xl h-full flex flex-col items-center text-center relative group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
                      
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

                      <h3 className="text-lg md:text-xl font-black text-white mb-1">{t.name}</h3>
                      <p className="text-xs md:text-sm text-gray-400 font-medium mb-4">
                        {t.school}
                      </p>

                      <div className="relative mt-auto pt-4">
                        <p className="text-gray-300 font-medium italic text-sm md:text-base leading-relaxed">
                          "{t.opinion}"
                        </p>
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
                      currentIndex === idx ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                  ></button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
