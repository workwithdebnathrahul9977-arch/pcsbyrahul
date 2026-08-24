import React from 'react';

const features = [
  {
    icon: 'fa-regular fa-user',
    title: 'ব্যক্তিগত একাডেমিক গাইডলাইন',
    desc: 'শিক্ষার্থীদের জন্য নিয়মিত পরামর্শ ও একাডেমিক দিকনির্দেশনা প্রদান করা হয়, যাতে তারা যেকোনো সমস্যার দ্রুত সমাধান করতে পারে। আমাদের একাডেমিক বিশেষজ্ঞরা প্রতিটি শিক্ষার্থীর দুর্বলতা চিহ্নিত করে সঠিক দিকনির্দেশনা প্রদান করেন।',
    bgColor: 'bg-blue-50/70',
    iconBg: 'bg-white',
    iconColor: 'text-blue-600',
    titleColor: 'text-blue-900',
    borderColor: 'border-blue-100',
  },
  {
    icon: 'fa-regular fa-clipboard',
    title: 'মূল্যায়ন ও মডেল টেস্ট',
    desc: 'বিভিন্ন পরীক্ষার জন্য নিয়মিত মডেল টেস্ট ও মূল্যায়নের ব্যবস্থা রাখা হয়েছে। শিক্ষার্থীদের পরীক্ষার সঠিক প্রস্তুতির জন্য বাস্তবধর্মী প্রশ্নপত্র তৈরি করা হয় এবং সময়ানুবর্তী পরীক্ষার মাধ্যমে দক্ষতা যাচাই করা হয়।',
    bgColor: 'bg-pink-50/70',
    iconBg: 'bg-white',
    iconColor: 'text-pink-600',
    titleColor: 'text-pink-900',
    borderColor: 'border-pink-100',
  },
  {
    icon: 'fa-solid fa-chalkboard-user',
    title: 'আধুনিক ক্লাসরুম',
    desc: 'আমাদের ক্লাসরুম অত্যাধুনিক প্রযুক্তি দ্বারা সজ্জিত, যেখানে স্মার্ট বোর্ড ও এসি সুবিধা রয়েছে। স্মার্ট বোর্ডের মাধ্যমে পাঠদানকে আরও ইন্টারেক্টিভ ও সহজবোধ্য করা হয়, যাতে শিক্ষার্থীরা বিষয়গুলো আরও ভালোভাবে বোঝে।',
    bgColor: 'bg-green-50/70',
    iconBg: 'bg-white',
    iconColor: 'text-green-600',
    titleColor: 'text-green-900',
    borderColor: 'border-green-100',
  },
  {
    icon: 'fa-regular fa-circle-question',
    title: 'ব্যক্তিগত সমস্যা সমাধান ক্লাস',
    desc: 'শিক্ষার্থীদের জন্য বিশেষ সাপোর্ট ক্লাসের ব্যবস্থা রাখা হয়েছে, যেখানে তারা যেকোনো বিষয়-সংক্রান্ত সমস্যার জন্য অতিরিক্ত সহায়তা পায়। এই ক্লাসগুলোতে শিক্ষার্থীরা নির্দ্বিধায় প্রশ্ন করতে পারে।',
    bgColor: 'bg-yellow-50/70',
    iconBg: 'bg-white',
    iconColor: 'text-yellow-600',
    titleColor: 'text-yellow-900',
    borderColor: 'border-yellow-100',
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 md:py-24 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            বিশেষ কিছু বৈশিষ্ট্য যা <span className="text-red-600">আমাদের আলাদা করে তোলে</span>
          </h2>
          <p className="text-gray-600 text-base md:text-lg leading-relaxed font-medium">
            আমাদের লক্ষ্য হলো পদার্থ ও রসায়নকে সহজ ও কার্যকর করে তোলা। আমরা দুর্বল শিক্ষার্থীদের বিশেষ সহায়তা প্রদান করি, যা তাদের দক্ষতা বাড়ায় এবং শেখার অভিজ্ঞতাকে উন্নত করে।
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`${feature.bgColor} ${feature.borderColor} border rounded-2xl p-8 flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-md cursor-pointer`}
            >
              {/* Icon */}
              <div className={`w-14 h-14 md:w-16 md:h-16 ${feature.iconBg} rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-100`}>
                <i className={`${feature.icon} text-2xl md:text-3xl ${feature.iconColor}`}></i>
              </div>
              
              {/* Title */}
              <h3 className={`text-xl font-black ${feature.titleColor} mb-4 leading-snug`}>
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-700 text-[13px] md:text-sm leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}