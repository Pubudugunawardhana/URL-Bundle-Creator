'use client';

import { useState } from 'react';
import { verifyPassword } from '@/app/b/[id]/actions';
import { Lock, Loader2, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PasswordPrompt({ bundleId, bundleName }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('password', password);

    const result = await verifyPassword(bundleId, formData);
    
    if (result.error) {
      setError(result.error);
      setIsLoading(false);
    } else if (result.success) {
      // Re-fetch the current page to run the Server Component again
      router.refresh();
    }
  };

  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="glass animate-fade-in" style={{ padding: '3rem', maxWidth: '450px', width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
          <Lock size={32} />
        </div>
        
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Protected Bundle</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          "{bundleName}" requires a password to view its contents.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input 
              type="password" 
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ fontSize: '1.1rem', padding: '1rem', background: 'var(--input-bg-dark)', textAlign: 'center' }}
              autoFocus
            />
          </div>
          
          {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem', margin: 0 }}>{error}</p>}
          
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading || !password}
            style={{ padding: '1rem', fontSize: '1.1rem', marginTop: '0.5rem' }}
          >
            {isLoading ? <Loader2 className="loader" /> : <>Unlock <ArrowRight size={20} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}
