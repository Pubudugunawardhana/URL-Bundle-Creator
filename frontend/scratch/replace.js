const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/page.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
content = content.replace(/FocusTube/g, 'URL Bundle Creator');
content = content.replace(/YouTube/g, 'Link');
content = content.replace(/Collection/g, 'Bundle');
content = content.replace(/collection/g, 'bundle');
content = content.replace(/Video/g, 'Link');
content = content.replace(/video/g, 'link');
content = content.replace(/watched/g, 'visited');
content = content.replace(/Watched/g, 'Visited');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced text successfully.');
