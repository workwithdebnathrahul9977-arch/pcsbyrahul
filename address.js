const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(public)/layout.tsx', 'utf8');
content = content.replace('কেটি-পয়েন্ট (হবিগঞ্জ খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার 3200', 'কোর্ট-পয়েন্ট (হাফিজা খাতুন স্কুলের সামনে) ৩য় তলা, শাহমোস্তফা রোড, মৌলভীবাজার, Moulvibazar 3200');
fs.writeFileSync('frontend/src/app/(public)/layout.tsx', content);
