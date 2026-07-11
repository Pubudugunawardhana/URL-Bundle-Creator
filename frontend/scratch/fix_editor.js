const fs = require('fs');
const path = require('path');

function replaceInFile(relativePath, replacements) {
  const filePath = path.join(__dirname, relativePath);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of Object.entries(replacements)) {
    content = content.replace(new RegExp(search, 'g'), replace);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Edit Page
replaceInFile('../app/edit/[id]/page.js', {
  'FocusTube': 'URL Bundle Creator',
  'Collection': 'Bundle',
  'collection': 'bundle',
  'Video': 'Link',
  'video': 'link',
  'SortableVideoCard': 'SortableLinkCard',
  "api\\.get\\(`/collections/\\$\\{id\\}`\\)": "fetch(`/api/bundles/${id}`).then(r => r.json())",
  "api\\.get\\(`/collections/\\$\\{id\\}/videos`\\)": "fetch(`/api/bundles/${id}`).then(r => r.json()).then(res => ({ data: res.links || [] }))", // Since /bundles/:id returns links populated
  "api\\.post\\(`/collections/\\$\\{id\\}/videos`": "fetch(`/api/bundles/${id}/links`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify",
  "api\\.delete\\(`/collections/\\$\\{id\\}/videos/\\$\\{videoId\\}`\\)": "fetch(`/api/bundles/${id}/links/${videoId}`, { method: 'DELETE' })",
  "api\\.put\\(`/collections/\\$\\{id\\}/videos/reorder`": "fetch(`/api/bundles/${id}/links`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify", // We use PUT /bundles/:id/links with full array
  "youtube\\.com": "example.com",
  "youtu\\.be": "example.org"
});

// 2. SortableLinkCard
replaceInFile('../components/SortableLinkCard.tsx', {
  'Video': 'Link',
  'video': 'link',
  'videoId': 'url',
  'youtube\\.com': 'example.com',
  'youtu\\.be': 'example.org'
});

// 3. SmartNotepad
replaceInFile('../components/SmartNotepad.tsx', {
  'Video': 'Link',
  'video': 'link',
  "api\\.get\\(`/collections/\\$\\{collectionId\\}/videos/\\$\\{videoId\\}`\\)": "Promise.resolve({ data: { note: '' } })",
  "api\\.put\\(`/collections/\\$\\{collectionId\\}/videos/\\$\\{videoId\\}`": "fetch(`/api/bundles/${collectionId}/links/${videoId}`, { method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify",
});

console.log('Fixed editor files.');
