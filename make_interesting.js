const fs = require('fs');

// 1. page.tsx
let page = fs.readFileSync('frontend/src/app/(public)/page.tsx', 'utf8');
const replacement = '<section className=\"relative bg-white py-8 md:py-12 overflow-hidden border-t border-gray-100\">\n  {/* Abstract Background Orbs */}\n  <div className=\"absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0\">\n    <div className=\"absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]\"></div>\n    <div className=\"absolute bottom-40 -right-40 w-96 h-96 bg-red-600/10 rounded-full blur-[100px]\"></div>\n    <div className=\"absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(220,38,38,0.03)_0%,rgba(255,255,255,0)_70%)] rounded-full\"></div>\n  </div>\n  <div className=\"relative z-10\">';
page = page.replace('<section className=\"bg-white py-4\">', replacement);
page = page.replace('<GallerySection />', '</div>\n      </section>\n\n      {/* Dynamic Success Gallery */}\n      <GallerySection />');
fs.writeFileSync('frontend/src/app/(public)/page.tsx', page);

// 2. CourseCategories.tsx
let cat = fs.readFileSync('frontend/src/components/CourseCategories.tsx', 'utf8');
cat = cat.replace('bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 hover:border-red-200 hover:shadow-2xl', 
'bg-white/80 backdrop-blur-xl rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:border-red-300 hover:shadow-[0_20px_40px_rgba(220,38,38,0.1)] hover:-translate-y-2');
cat = cat.replace('bg-gray-50', 'bg-gradient-to-br from-red-50 to-white border border-red-100/50');
fs.writeFileSync('frontend/src/components/CourseCategories.tsx', cat);

// 3. HomeCourses.tsx
let hc = fs.readFileSync('frontend/src/components/HomeCourses.tsx', 'utf8');
hc = hc.replace('bg-white rounded-[20px] p-4 shadow-xl border border-gray-100 hover:border-red-200 hover:shadow-2xl hover:bg-gray-50', 
'bg-white/90 backdrop-blur-lg rounded-[24px] p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-red-300 hover:shadow-[0_20px_50px_-10px_rgba(220,38,38,0.15)] hover:-translate-y-2');
hc = hc.replace('bg-gray-50', 'bg-red-50 border border-red-100/50');
hc = hc.replace('from-black/30', 'from-red-900/40 via-red-900/5');
fs.writeFileSync('frontend/src/components/HomeCourses.tsx', hc);

// 4. TrustSection.tsx
let trust = fs.readFileSync('frontend/src/components/TrustSection.tsx', 'utf8');
trust = trust.replace('bg-white py-16 md:py-24 overflow-hidden border-t border-gray-100', 'relative bg-[#fafafa] py-16 md:py-24 overflow-hidden border-y border-gray-100');
const trustRepl = '<div className=\"absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-50 to-transparent pointer-events-none\"></div>\n  <div className=\"absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none\"></div>\n  <div className=\"max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10\">';
trust = trust.replace('<div className=\"max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-8\">', trustRepl);
trust = trust.replace('bg-white p-4 lg:p-5 rounded-2xl flex items-center shadow-sm border border-gray-100 hover:shadow-md hover:border-red-200', 
'bg-white p-4 lg:p-5 rounded-2xl flex items-center shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100/50 hover:shadow-[0_10px_30px_rgba(220,38,38,0.08)] hover:border-red-200 hover:-translate-y-1');
fs.writeFileSync('frontend/src/components/TrustSection.tsx', trust);

console.log('Made it interesting');
