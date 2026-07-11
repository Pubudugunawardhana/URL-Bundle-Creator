const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/dashboard/page.js');
let content = fs.readFileSync(filePath, 'utf8');

// Remove interfaces
content = content.replace(/interface BundleProgress \{[\s\S]*?\}/g, '');
content = content.replace(/interface Bundle \{[\s\S]*?\}/g, '');

// Remove type assertions and generic types
content = content.replace(/useState<Bundle\[\]>\(\[\]\)/g, 'useState([])');
content = content.replace(/\(c: Bundle\)/g, '(c)');
content = content.replace(/React\.FormEvent/g, '');
content = content.replace(/React\.MouseEvent/g, '');
content = content.replace(/\(e: ,/g, '(e,'); // fix trailing comma if replaced FormEvent left it blank
content = content.replace(/const handleCreateBundle = async \(e\) =>/g, 'const handleCreateBundle = async (e) =>');
content = content.replace(/const handleToggleFavorite = async \(e, /g, 'const handleToggleFavorite = async (e, ');
// General regex fix for the event types
content = content.replace(/e: \s*,\s*/g, 'e, ');
content = content.replace(/e:\s*\)/g, 'e)');

// Let's just do it cleanly
content = content.replace(/e: React\.FormEvent/g, 'e');
content = content.replace(/e: React\.MouseEvent/g, 'e');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Removed TS syntax from dashboard.');
