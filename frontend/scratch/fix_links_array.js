const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/edit/[id]/page.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix API payload for reorder
content = content.replace(/videos: newOrder/g, 'links: newOrder');
content = content.replace(/videos: items/g, 'links: items');

// Fix URL fetching (previously it might have looked for YouTube thumbnail)
// We just need to make sure 'linkId' vs 'url' is correct. The model Link has 'url', 'title', 'id'.
// The SortableLinkCard expects 'url', 'title', etc.

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed payload in edit page.');
