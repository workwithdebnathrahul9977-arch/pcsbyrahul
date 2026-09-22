const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
content = content.replace('bg-[#0a0a0a]', 'bg-[#1a1a1a]');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
