'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BundleEditor from '@/components/BundleEditor';

export default function CreatePage() {
  const router = useRouter();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="grid-pattern-bg"></div>
      <main className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BundleEditor 
          onSave={(bundle) => {
            router.refresh();
            router.push('/dashboard');
          }} 
          onCancel={() => router.back()} 
        />
      </main>
    </div>
  );
}
