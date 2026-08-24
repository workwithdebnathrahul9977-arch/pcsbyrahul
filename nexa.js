const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
content = content.replace('<a href=\"#\" className=\"ml-1 text-red-500 font-bold hover:underline\">Team Nexa</a>', '<a href=\"https://wa.me/8801717855327\" target=\"_blank\" rel=\"noopener noreferrer\" className=\"ml-1 text-red-500 font-bold hover:underline\">Team Nexa</a>');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
