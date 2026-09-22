import Link from 'next/link';
import GallerySection from '../../components/GallerySection';
import HeroSlider from '@/components/HeroSlider';
import TrustSection from '@/components/TrustSection';
import FeaturesSection from '@/components/FeaturesSection';
import HomeCourses from '@/components/HomeCourses';
import HomeVideos from '@/components/HomeVideos';
import TestimonialSlider from '@/components/TestimonialSlider';
import CourseCategories from '@/components/CourseCategories';

async function getSliders() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/sliders`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch sliders server-side:', error);
    return [];
  }
}

export default async function Home() {
  const initialSliders = await getSliders();

  return (
    <div className="bg-white">
      
      {/* 1. Hero Section (Left-Right Layout) */}
      <section className="relative bg-white pt-4 md:pt-12 pb-12 md:pb-20 overflow-hidden border-b border-gray-100">
        
        {/* Subtle Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:30px_30px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] z-0"></div>

        <div className="relative z-10 max-w-[1450px] mx-auto px-3 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 mt-0 md:mt-8">
          
          {/* Text Content (Left Side) */}
          <div className="w-full lg:w-[48%] flex flex-col items-center lg:items-start text-center lg:text-left z-10 order-2 lg:order-1">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-white border border-red-200 mb-5 md:mb-6 shadow-sm hover:shadow-md transition-all">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
              </span>
              <span className="text-sm font-bold text-red-600 uppercase tracking-widest">PhysChemia</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[3.4rem] font-extrabold text-gray-900 leading-[1.3] md:leading-[1.35] mb-5 md:mb-6">
              স্বপ্নের ক্যারিয়ার গড়তে <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-600">
                আমাদের সাথে যুক্ত হোন!
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base md:text-xl text-gray-500 font-medium mb-8 leading-relaxed max-w-2xl px-2 lg:px-0">
              PCS-এ A+ পাওয়ার সেরা প্ল্যাটফর্ম। এখানে আপনি পাচ্ছেন আধুনিক অফলাইন ও অনলাইন ক্লাস, প্র্যাক্টিক্যাল এক্সপেরিমেন্ট এবং স্পেশাল গাইডলাইন।
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 w-full lg:w-auto">
              <Link href="/admission" className="bg-red-600 text-white px-5 md:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-lg font-bold shadow-[0_8px_30px_rgb(220,38,38,0.3)] hover:shadow-[0_8px_30px_rgb(220,38,38,0.5)] hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 flex-1 lg:flex-none">
                <i className="fa-solid fa-user-plus"></i> এডমিশন নিন
              </Link>
              <Link href="/courses" className="bg-white text-gray-800 border border-gray-200 px-5 md:px-8 py-3.5 md:py-4 rounded-xl text-sm md:text-lg font-bold hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 shadow-sm flex-1 lg:flex-none">
                <i className="fa-solid fa-graduation-cap text-red-600"></i> সব কোর্সগুলো
              </Link>
            </div>
          </div>

          {/* Slider Content (Right Side) */}
          <div className="w-full lg:w-[50%] max-w-[800px] relative z-20 group order-1 lg:order-2 flex justify-center lg:justify-end mb-6 lg:mb-0">
             {/* Slider Wrapper */}
             <div className="w-full relative rounded-xl md:rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
               <HeroSlider initialSliders={initialSliders} />
             </div>
          </div>
          
        </div>
      </section>

      {/* Combined Course Categories & Courses Section */}
      <section className="bg-white py-4">
        <CourseCategories />

        <div className="py-12 md:py-16">
          <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                আমাদের প্রোগ্রামসমূহ
              </h2>
              <div className="inline-flex items-center justify-center gap-2 text-green-600 font-semibold text-base md:text-lg">
                <i className="fa-regular fa-calendar-days"></i> <span>ভর্তি চলছে (সীমিত আসন)</span>
              </div>
            </div>
            
            <HomeCourses />
          </div>
        </div>
      </section>

      {/* Campus Tour / Video Gallery */}
      <HomeVideos />

      {/* Dynamic Success Gallery */}
      <GallerySection />

      {/* 4. Trust Section (Dynamic Image) */}
      <TrustSection />

      {/* 5. Features Section */}
      <FeaturesSection />

      {/* Testimonials Slider */}
      <TestimonialSlider />

    </div>
  )
}
