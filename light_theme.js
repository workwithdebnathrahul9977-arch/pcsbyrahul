const fs = require('fs');

// 1. page.tsx
let page = fs.readFileSync('frontend/src/app/(public)/page.tsx', 'utf8');
page = page.replace('bg-gradient-to-b from-red-800 to-red-900 border-y border-red-900/30', 'bg-white py-4');
page = page.replace('text-white mb-8 md:mb-12 relative inline-block left-1/2 -translate-x-1/2 pb-4', 'text-gray-900 mb-8 md:mb-12 relative inline-block left-1/2 -translate-x-1/2 pb-4');
fs.writeFileSync('frontend/src/app/(public)/page.tsx', page);

// 2. CourseCategories.tsx
let cat = fs.readFileSync('frontend/src/components/CourseCategories.tsx', 'utf8');
cat = cat.replace('text-white mb-10 md:mb-16 relative', 'text-gray-900 mb-10 md:mb-16 relative');
cat = cat.replace('bg-white/5 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-white/10 hover:border-white/30 hover:bg-white/10', 'bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 hover:border-red-200 hover:shadow-2xl');
cat = cat.replace('bg-black/20', 'bg-gray-50');
cat = cat.replace('text-white/20', 'text-gray-200');
cat = cat.replace('from-black/40', 'from-black/10');
cat = cat.replace('text-white tracking-wide', 'text-gray-900 tracking-wide');
fs.writeFileSync('frontend/src/components/CourseCategories.tsx', cat);

// 3. HomeCourses.tsx
let hc = fs.readFileSync('frontend/src/components/HomeCourses.tsx', 'utf8');
hc = hc.replace('bg-white/5 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-white/10 hover:border-red-500/40 hover:bg-gradient-to-b hover:from-white/10 hover:to-red-900/30', 'bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:bg-gray-50');
hc = hc.replace('bg-black/20', 'bg-gray-50');
hc = hc.replace('from-[#1a0101]', 'from-black/30');
hc = hc.replace('text-white mb-2', 'text-gray-900 mb-2');
hc = hc.replace('text-gray-300 text-sm mb-6', 'text-gray-600 text-sm mb-6');
hc = hc.replace('[&_p]:!text-gray-200', '[&_p]:!text-gray-600');
hc = hc.replace('[&_span]:!text-gray-200', '[&_span]:!text-gray-600');
hc = hc.replace('[&_li]:!text-gray-200', '[&_li]:!text-gray-600');
hc = hc.replace('[&_strong]:!text-white', '[&_strong]:!text-gray-900');
hc = hc.replace('border-white/10', 'border-gray-100');
hc = hc.replace('text-red-200/60', 'text-gray-400');
fs.writeFileSync('frontend/src/components/HomeCourses.tsx', hc);

// 4. TrustSection.tsx
let trust = fs.readFileSync('frontend/src/components/TrustSection.tsx', 'utf8');
trust = trust.replace('bg-gradient-to-b from-red-900 to-red-800 py-16 md:py-24 overflow-hidden border-t border-red-900/30', 'bg-white py-16 md:py-24 overflow-hidden border-t border-gray-100');
trust = trust.replace('text-white mb-10', 'text-gray-900 mb-10');
trust = trust.replace('bg-black/20 p-4 lg:p-5 rounded-2xl flex items-center shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] hover:bg-black/30 transition-all duration-300 group border border-transparent', 'bg-white p-4 lg:p-5 rounded-2xl flex items-center shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200 transition-all duration-300 group');
trust = trust.replace('text-gray-200 font-bold', 'text-gray-700 font-bold group-hover:text-red-600 transition-colors');
trust = trust.replace('bg-black/20 rounded-3xl overflow-hidden border border-white/10', 'bg-gray-50 rounded-3xl overflow-hidden border border-gray-100');
trust = trust.replace('from-[#1a0505]', 'from-white');
fs.writeFileSync('frontend/src/components/TrustSection.tsx', trust);

console.log('Light theme applied');
