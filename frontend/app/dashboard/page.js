import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';
import { Layers, Eye, Calendar, ExternalLink } from 'lucide-react';
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
    <main className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            Your Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, {session.user.name || session.user.email}! Here are your created link bundles.
          </p>
        </div>
        <Link href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          Create New Bundle
        </Link>
      </header>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Bundles</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--accent-color)' }}>{bundles.length}</span>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Views</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--success-color)' }}>
            {bundles.reduce((acc, b) => acc + b.views, 0)}
          </span>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>Total Links Shared</span>
          <span style={{ fontSize: '2.2rem', fontWeight: 700, color: '#f59e0b' }}>
            {bundles.reduce((acc, b) => acc + b.links.length, 0)}
          </span>
        </div>
      </div>

      {bundles.length === 0 ? (
        <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '50%', color: 'var(--accent-color)' }}>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {bundles.map((bundle) => (
            <div key={bundle.id} className="glass hover-lift" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem', transition: 'all 0.2s ease' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                  {bundle.name}
                </h3>
                {bundle.description && (
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                    {bundle.description}
                  </p>
                )}
                
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Layers size={14} /> {bundle.links.length} link{bundle.links.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Eye size={14} /> {bundle.views} view{bundle.views !== 1 ? 's' : ''}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Calendar size={14} /> Created {new Date(bundle.createdAt).toLocaleDateString()}
                  </span>
                  {bundle.expiresAt && (
                    <span style={{ color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Expires {new Date(bundle.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <Link
                  href={`/b/${bundle.shortId}`}
                  target="_blank"
                  className="btn btn-outline"
                  style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}
                >
                  <ExternalLink size={16} />
                  <span>View</span>
                </Link>
                
                <DeleteBundleButton bundle={bundle} />
              </div>
            </div>
          ))}
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: var(--glass-shadow);
          border-color: var(--accent-glow);
        }
      `}} />
    </main>
  );
}
