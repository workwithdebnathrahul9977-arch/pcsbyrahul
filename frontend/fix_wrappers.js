const fs = require('fs');
const path = require('path');

function walk(dir, done) {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          if (file.endsWith('.tsx')) results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
}

walk(path.join(__dirname, 'src/app/admin'), function(err, results) {
  if (err) throw err;
  let updated = 0;
  for (const file of results) {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;
    
    if (content.includes('bg-[#f8f9fc]')) {
      content = content.replace(/bg-\[#f8f9fc\]/g, '');
      changed = true;
    }
    if (content.includes('min-h-screen')) {
      content = content.replace(/min-h-screen/g, '');
      changed = true;
    }
    
    if (changed) {
      content = content.replace(/p-4 md:p-6 lg:p-8 /g, '');
      content = content.replace(/p-4 md:p-6 lg:p-8/g, '');
      content = content.replace(/className="([^"]+)"/g, (match, p1) => {
          return 'className="' + p1.replace(/\s+/g, ' ').trim() + '"';
      });
      fs.writeFileSync(file, content);
      console.log('Fixed:', file);
      updated++;
    }
  }
  console.log('Total fixed:', updated);
});
