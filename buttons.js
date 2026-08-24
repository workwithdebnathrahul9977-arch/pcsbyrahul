const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');

content = content.replace(
  /className="w-12 h-12 rounded-full bg-white\/5 border border-white\/10 flex items-center justify-center text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.5\)\] group"/g,
  'className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white hover:opacity-80 transition-all duration-300 shadow-lg group"'
);

content = content.replace(
  /className="w-12 h-12 rounded-full bg-white\/5 border border-white\/10 flex items-center justify-center text-blue-500 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.5\)\] group"/g,
  'className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:opacity-80 transition-all duration-300 shadow-lg group"'
);

content = content.replace(
  /className="w-12 h-12 rounded-full bg-white\/5 border border-white\/10 flex items-center justify-center text-pink-500 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white hover:border-pink-500 transition-all duration-300 shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.5\)\] group"/g,
  'className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white hover:opacity-80 transition-all duration-300 shadow-lg group"'
);

content = content.replace(
  /className="w-12 h-12 rounded-full bg-white\/5 border border-white\/10 flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-300 shadow-\[inset_2px_2px_4px_rgba\(0,0,0,0\.5\)\] group"/g,
  'className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white hover:opacity-80 transition-all duration-300 shadow-lg group"'
);

fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
