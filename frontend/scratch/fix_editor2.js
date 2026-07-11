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
  "api\\.get\\(`/collections/\\$\\{id\\}`\\)": "api.get(`/bundles/${id}`)",
  "api\\.get\\(`/collections/\\$\\{id\\}/videos`\\)": "api.get(`/bundles/${id}`).then(res => ({ data: res.data.links || [] }))", // Adapt to return links
  "api\\.post\\(`/collections/\\$\\{id\\}/videos`": "api.post(`/bundles/${id}/links`",
  "api\\.delete\\(`/collections/\\$\\{id\\}/videos/\\$\\{linkId\\}`\\)": "api.delete(`/bundles/${id}/links/${linkId}`)",
  "api\\.put\\(`/collections/\\$\\{id\\}/videos/reorder`": "api.put(`/bundles/${id}/links`", // We use PUT /bundles/:id/links with { links: [...] }
  "youtube\\.com": "example.com",
  "youtu\\.be": "example.org",
  "c\\._id": "c.shortId",
  "_id:": "shortId:"
});

// 2. SortableLinkCard
replaceInFile('../components/SortableLinkCard.tsx', {
  'Video': 'Link',
  'video': 'link',
  'videoId': 'url', // actually wait, the ID might still be 'id' or 'shortId'. Let's replace 'videoId' with 'linkId'.
  'youtube\\.com': 'example.com',
  'youtu\\.be': 'example.org'
});
replaceInFile('../components/SortableLinkCard.tsx', {
  'videoId': 'linkId'
});

// 3. SmartNotepad
replaceInFile('../components/SmartNotepad.tsx', {
  'Video': 'Link',
  'video': 'link',
  "api\\.get\\(`/collections/\\$\\{bundleId\\}/videos/\\$\\{linkId\\}`\\)": "Promise.resolve({ data: { note: '' } })",
  "api\\.put\\(`/collections/\\$\\{bundleId\\}/videos/\\$\\{linkId\\}`": "api.put(`/bundles/${bundleId}/links/${linkId}`",
});

// 4. SortableListItem
replaceInFile('../components/SortableListItem.tsx', {
  'Video': 'Link',
  'video': 'link'
});

console.log('Fixed editor files cleanly.');
