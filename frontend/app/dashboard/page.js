import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Layers, Eye, Calendar, ExternalLink, LayoutGrid, Heart, Code, PlaySquare, MoreHorizontal } from 'lucide-react';
import DeleteBundleButton from './DeleteBundleButton';
import { headers } from 'next/headers';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';
  const res = await fetch(`${backendUrl}/api/bundles`, {
    headers: {
      cookie: cookieHeader,
    },
    cache: 'no-store',
  });

  const bundles = res.ok ? await res.json() : [];

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="grid-pattern-bg"></div>
      <main className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              <LayoutGrid size={28} style={{ color: 'var(--accent-color)' }} />
              Your Bundles
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Organize and track your link bundles
            </p>
          </div>
          <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none', borderRadius: '99px', padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}>
            + New Bundle
          </Link>
        </header>

        {bundles.length === 0 ? (
          <div className="dashboard-card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ padding: '1.5rem', background: 'var(--input-bg)', borderRadius: '50%', color: 'var(--accent-color)' }}>
              <Layers size={48} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Bundles Yet</h3>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                You haven&apos;t created any URL bundles under this account. Create one now to start tracking and managing them.
              </p>
            </div>
            <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Create Your First Bundle
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {bundles.map((bundle) => {
              // Extract a mock tag for UI purposes, could use actual data if available
              const tag = bundle.name.includes('Auto') ? 'n8n' : 'Code';
              const progressPct = Math.min(100, Math.max(0, bundle.views * 10)); // Just a mock visualization
              
              return (
                <div key={bundle.id} className="dashboard-card hover-lift" style={{ position: 'relative' }}>
                  {/* Top icons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--input-bg)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                      <Code size={20} />
                    </div>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <Heart size={20} />
                    </button>
                  </div>
                  
                  {/* Title and Tag */}
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      <Link href={`/b/${bundle.shortId}`} target="_blank" style={{ color: 'inherit', textDecoration: 'none' }}>
                        {bundle.name}
                      </Link>
                    </h3>
                    <span className="pill-tag">{tag}</span>
                  </div>
                  
                  {/* Progress section */}
                  <div style={{ marginTop: '2.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                      <span>Progress</span>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{progressPct}%</span>
                    </div>
                    
                    <div style={{ width: '100%', height: '8px', background: 'var(--input-bg)', borderRadius: '99px', overflow: 'hidden', marginBottom: '1rem' }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--text-primary)', borderRadius: '99px' }}></div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <PlaySquare size={14} />
                        <span>{Math.floor((progressPct/100) * bundle.links.length)} of {bundle.links.length} links visited</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <DeleteBundleButton bundle={bundle} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
