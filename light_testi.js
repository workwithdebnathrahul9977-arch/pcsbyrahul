const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/TestimonialSlider.tsx', 'utf8');
content = content.replace('bg-[#1a0505]', 'bg-white');
content = content.replace('text-lg md:text-xl font-black text-white', 'text-lg md:text-xl font-black text-red-700');
content = content.replace('text-xs md:text-sm text-gray-400', 'text-xs md:text-sm text-gray-500');
content = content.replace('text-gray-300 font-medium italic', 'text-gray-700 font-medium italic');
fs.writeFileSync('frontend/src/components/TestimonialSlider.tsx', content);
console.log('Done');
