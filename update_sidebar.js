const fs = require('fs');
let content = fs.readFileSync('frontend/src/components/admin/Sidebar.tsx', 'utf8');
content = content.replace(
  "{ name: 'Academic Function', icon: 'fa-solid fa-laptop-file', hasSub: true, id: 'academic' },",
  "{ name: 'Academic Function', icon: 'fa-solid fa-laptop-file', hasSub: true, id: 'academic', children: [ { name: 'Create Class', icon: 'fa-solid fa-plus', path: '/admin/academic/class' }, { name: 'Create Subject', icon: 'fa-solid fa-plus', path: '/admin/academic/subject' }, { name: 'Create Group', icon: 'fa-solid fa-plus', path: '/admin/academic/group' }, { name: 'Create Batch', icon: 'fa-solid fa-plus', path: '/admin/academic/batch' } ] },"
);
fs.writeFileSync('frontend/src/components/admin/Sidebar.tsx', content);
console.log('Sidebar updated');
