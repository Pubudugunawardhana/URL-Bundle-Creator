const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../app/dashboard/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `  const [isCreating, setIsCreating] = useState(false);
      setLoading(false);
    }
  };`;

const replacement = `  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

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
  };`;

content = content.replace(target, replacement);
fs.writeFileSync(filePath, content, 'utf8');
console.log('Restored fetchBundles correctly.');
