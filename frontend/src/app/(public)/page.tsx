import Link from 'next/link';
import GallerySection from '../../components/GallerySection';
import HeroSlider from '@/components/HeroSlider';
import TrustSection from '@/components/TrustSection';
import FeaturesSection from '@/components/FeaturesSection';
import HomeCourses from '@/components/HomeCourses';
import TestimonialSlider from '@/components/TestimonialSlider';
import CourseCategories from '@/components/CourseCategories';

export default function Home() {
  return (
    <div className="bg-white">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gray-50 border-b border-gray-100">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-100 opacity-50 blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pt-5 pb-8 md:py-16 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12">
          <div className="w-full md:w-5/12 order-2 md:order-1 text-center md:text-left z-10 px-2 md:px-0">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 mb-4 md:mb-6 leading-tight">
              বিজ্ঞানের জটিল বিষয়গুলো <br/><span className="text-red-600">হোক একদম সহজ!</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium mb-6 md:mb-8 leading-relaxed">
              PCS-এ A+ পাওয়ার জন্য রয়েছে সঠিক দিকনির্দেশনা, মানসম্মত লেকচার শিট এবং সেরা মেন্টরশিপ। আজই যুক্ত হও।
            </p>
            <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/courses" className="bg-red-600 text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-bold shadow-lg hover:bg-red-700 transition">
                কোর্সসমূহ দেখুন
              </Link>
            </div>
          </div>
          <div className="w-full md:w-7/12 flex justify-center relative order-1 md:order-2 z-10">
             <HeroSlider />
          </div>
        </div>
      </section>

      {/* Combined Course Categories & Courses Section */}
      <section className="bg-gradient-to-b from-red-800 to-red-900 border-y border-red-900/30">
        <CourseCategories />

        <div className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-4xl font-black text-center text-white mb-8 md:mb-12 relative inline-block left-1/2 -translate-x-1/2 pb-4">
              আমাদের কোর্সসমূহ
              <span className="absolute bottom-0 left-0 w-full h-1 bg-red-500 rounded"></span>
            </h2>
            
            <HomeCourses />
          </div>
        </div>
      </section>

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
