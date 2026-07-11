const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The file has Windows line endings, let's normalize to \n first to make replacing easier
content = content.replace(/\r\n/g, '\n');

const targetRegex = /  const \[isCreating, setIsCreating\] = useState\(false\);\n      setLoading\(false\);\n    }\n  };\n\n  useEffect\(\(\) => \{\n    const token = true;\n    if \(\!token\) \{\n      router\.push\('\/login'\);\n      return;\n    \}\n    const timer = setTimeout\(\(\) => \{\n      fetchBundles\(\);\n    \}, 0\);\n    return \(\) => clearTimeout\(timer\);\n  \}, \[router\]\);/;

const replacement = `  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchBundles = async () => {
    try {
      const res = await api.get('/bundles');
      const bundlesWithProgress = res.data.map((c) => {
        const totalLinks = c.links ? c.links.length : 0;
        return { 
          ...c, 
          progress: { percentage: 0, totalLinks, watchedLinks: 0 } 
        };
      });
      setBundles(bundlesWithProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      const timer = setTimeout(() => {
        fetchBundles();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [status, router]);`;

if (targetRegex.test(content)) {
  content = content.replace(targetRegex, replacement);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Successfully fixed syntax error!');
} else {
  console.log('Target regex did not match. Exiting.');
}
