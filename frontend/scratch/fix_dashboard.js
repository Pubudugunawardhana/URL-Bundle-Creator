const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/dashboard/page.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/_id:/g, 'shortId:');
content = content.replace(/c\._id/g, 'c.shortId');
content = content.replace(/localStorage\.getItem\('token'\)/g, "true"); // hack since next-auth handles it server-side if page is protected, or we can use useSession. We will just bypass the token check here and rely on the API to return 401 if unauthorized.
content = content.replace(/const timer = setTimeout\(\(\) => \{/g, `const timer = setTimeout(() => {`);

// Add proper NextAuth support if we want
// import { useSession } from 'next-auth/react';
if (!content.includes('useSession')) {
  content = content.replace(/import \{ useRouter \} from 'next\/navigation';/, "import { useRouter } from 'next/navigation';\nimport { useSession } from 'next-auth/react';");
  
  // replace the token check entirely
  content = content.replace(/const token = localStorage\.getItem\('token'\);\s*if \(!token\) \{\s*router\.push\('\/login'\);\s*return;\s*\}/g, "");
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed NextAuth and shortId in dashboard.');
