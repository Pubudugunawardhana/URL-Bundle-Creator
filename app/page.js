'use client';
import { useState } from 'react';
import BundleEditor from '@/components/BundleEditor';
import ShareModal from '@/components/ShareModal';
import { Layers } from 'lucide-react';

export default function Home() {
  const [createdBundle, setCreatedBundle] = useState(null);

  return (
    <main className="container" style={{ padding: '4rem 1rem' }}>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-glow)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
          <Layers size={40} color="var(--accent-color)" />
        </div>
        <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          URL Bundle Creator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Share 20 links with 1 link. Perfect for creators and teams.</p>
      </header>

      {createdBundle ? (
        <ShareModal bundle={createdBundle} onClose={() => setCreatedBundle(null)} />
      ) : (
        <BundleEditor onSave={setCreatedBundle} />
      )}
    </main>
  );
}
