const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');

// The replacement logic
content = content.replace(
  /className="bg-white\/5 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white\/10 flex items-center justify-between group hover:-translate-y-1 hover:shadow-[a-zA-Z0-9-\/]+ hover:border-[a-zA-Z0-9-\/]+ hover:bg-white\/10 transition-all duration-300"/g,
  'className="bg-black/20 p-3 md:p-4 rounded-2xl shadow-[inset_3px_3px_8px_rgba(0,0,0,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.05)] border border-transparent flex items-center justify-between group hover:bg-black/40 transition-all duration-300"'
);

content = content.replace(
  /className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black\/40 text-[a-zA-Z0-9-]+ flex items-center justify-center text-lg md:text-xl mr-3 border border-white\/5 group-hover:bg-[a-zA-Z0-9-]+ group-hover:text-white transition-colors"/g,
  (match) => {
    return match.replace('bg-black/40', 'bg-black/40 shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]').replace('border border-white/5 ', '');
  }
);

fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
