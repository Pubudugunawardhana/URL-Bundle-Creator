const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/dashboard/page.js');
let content = fs.readFileSync(filePath, 'utf8');

// Replacements
content = content.replace(/FocusTube/g, 'URL Bundle Creator');
content = content.replace(/Collection/g, 'Bundle');
content = content.replace(/collection/g, 'bundle');
content = content.replace(/Video/g, 'Link');
content = content.replace(/video/g, 'link');
content = content.replace(/api\.get\('\/collections'\)/g, 'fetch(\'/api/bundles\').then(res => res.json())');
content = content.replace(/api\.get\(`\/collections\/\$\{c\._id\}\/progress`\)/g, 'Promise.resolve({ data: { percentage: c.links?.length > 0 ? 100 : 0, totalVideos: c.links?.length || 0, watchedVideos: 0 } })');
content = content.replace(/api\.post\('\/collections'/g, 'fetch(\'/api/bundles\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify');
content = content.replace(/}\);/g, '} )'); // fix for fetch body
content = content.replace(/api\.put\(`\/collections\/\$\{collectionId\}`/g, 'fetch(`/api/bundles/${collectionId}`, { method: \'PUT\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced text successfully.');
