import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Link as LinkIcon, ExternalLink, Calendar, Eye, Layers } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import PasswordPrompt from '@/components/PasswordPrompt';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const bundle = await prisma.bundle.findUnique({
    where: { shortId: id }
  });

  if (!bundle) return { title: 'Bundle Not Found' };

  return {
    title: `${bundle.name} | URL Bundle`,
    description: bundle.description || `A collection of useful links shared via URL Bundle.`,
  };
}

export default async function BundlePage({ params }) {
  const { id } = await params;
  
  // Fetch bundle and increment views
  const bundle = await prisma.bundle.update({
    where: { shortId: id },
    data: { views: { increment: 1 } },
    include: {
      links: {
        orderBy: { order: 'asc' }
      }
    }
  }).catch(() => null);

  if (!bundle) {
    notFound();
  }

  const cookieStore = await cookies();
  const passCookie = cookieStore.get(`bundle_pass_${id}`);
  const hasAccess = !bundle.password || (passCookie && passCookie.value === bundle.password);

  if (!hasAccess) {
    return <PasswordPrompt bundleId={id} bundleName={bundle.name} />;
  }

  return (
    <main className="container" style={{ padding: '3rem 1rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '2rem' }}>
          <Layers size={18} /> Create your own bundle
        </Link>
      </div>

      <div className="glass" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{bundle.name}</h1>
        {bundle.description && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>{bundle.description}</p>
        )}

        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={16} />
            {new Date(bundle.createdAt).toLocaleDateString()}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Eye size={16} />
            {bundle.views} views
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LinkIcon size={16} />
            {bundle.links.length} links
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bundle.links.map((link) => (
          <a 
            key={link.id} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="glass link-card"
            style={{ 
              display: 'flex', 
              padding: '1.5rem', 
              gap: '1.5rem', 
              textDecoration: 'none', 
              color: 'inherit',
              transition: 'transform 0.2s, background 0.2s'
            }}
          >
            {link.favicon ? (
              <img src={link.favicon} alt="" style={{ width: 32, height: 32, borderRadius: 6, flexShrink: 0 }} onError={(e) => { e.target.style.display='none'; }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <LinkIcon size={16} />
              </div>
            )}

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{link.title || link.url}</h3>
                <ExternalLink size={14} color="var(--text-secondary)" />
              </div>
              
              {link.description && (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {link.description}
                </p>
              )}

              {link.note && (
                <div style={{ display: 'inline-block', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 500, marginTop: '0.5rem' }}>
                  💡 {link.note}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>
    </main>
  );
}
