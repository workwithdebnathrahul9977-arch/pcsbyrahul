const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('http://localhost:5000')) {
    // We use a regex to replace exactly the string 'http://localhost:5000'
    // But since it's inside quotes like 'http://localhost:5000/api...', 
    // it's better to replace 'http://localhost:5000' with ${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"} 
    // Wait, if we just replace it blindly, if it was in single quotes, it will break.
    // e.g. axios.get('http://localhost:5000/api/courses')
    // becomes axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/courses`)
    
    content = content.replace(/'http:\/\/localhost:5000([^']*)'/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
    content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
    content = content.replace(/`http:\/\/localhost:5000([^`]*)`/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}$1`');
    
    fs.writeFileSync(file, content);
    console.log('Updated: ' + file);
    count++;
  }
});
console.log('Total files updated: ' + count);
