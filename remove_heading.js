const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
const searchString = '              <h3 className=\"text-white font-bold mb-6 text-lg relative inline-block\">\n                আমাদের সাথে যুক্ত থাকুন\n                <span className=\"absolute -bottom-2 left-0 w-1/2 h-0.5 bg-red-600 rounded\"></span>\n              </h3>\n';
content = content.replace(searchString, '');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
console.log(content.includes('আমাদের সাথে যুক্ত থাকুন') ? 'Failed to remove' : 'Successfully removed');
