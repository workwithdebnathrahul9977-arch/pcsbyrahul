const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
content = content.replace('className=\"md:col-span-1 lg:pl-10\"', 'className=\"md:col-span-1 lg:pl-10 order-3\"');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
console.log('Done');
