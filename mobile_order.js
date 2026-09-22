const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
content = content.replace('className=\"md:col-span-1 pr-0 lg:pr-4\"', 'className=\"md:col-span-1 pr-0 lg:pr-4 order-2 md:order-1\"');
content = content.replace('className=\"md:col-span-1 lg:pl-6\"', 'className=\"md:col-span-1 lg:pl-6 order-1 md:order-2\"');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
console.log('Done');
