'use client';
import { useState } from 'react';
import BundleEditor from '@/components/BundleEditor';
import ShareModal from '@/components/ShareModal';
import { Layers, BookOpen, Code, GraduationCap, Users, Link as LinkIcon, Box, Share2, ArrowRight } from 'lucide-react';

export default function Home() {
  const [createdBundle, setCreatedBundle] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      {/* Share Modal View */}
      {createdBundle && (
        <main className="container animate-fade-in" style={{ padding: '4rem 1rem' }}>
          <ShareModal bundle={createdBundle} onClose={() => setCreatedBundle(null)} />
        </main>
      )}

      {/* Editor View */}
      <main className="container animate-fade-in" style={{ padding: '4rem 1rem', display: (isEditing && !createdBundle) ? 'block' : 'none' }}>
        <BundleEditor onSave={setCreatedBundle} onCancel={() => setIsEditing(false)} />
      </main>

      {/* Landing Page View */}
      <main style={{ padding: '4rem 1rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'center', display: (!isEditing && !createdBundle) ? 'block' : 'none' }} className="animate-fade-in">
      {/* Hero Section */}
      <header style={{ marginBottom: '5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'var(--accent-glow)', padding: '1.2rem', borderRadius: '50%', marginBottom: '1.5rem', boxShadow: '0 0 30px var(--accent-glow)' }}>
          <Layers size={48} color="var(--accent-color)" />
        </div>
        <h1 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2 }}>
          URL Bundle Creator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.5rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Share 20 links with 1 link.
        </p>
        
        <button 
          className="btn btn-primary" 
          onClick={() => setIsEditing(true)}
          style={{ fontSize: '1.3rem', padding: '1rem 3rem', borderRadius: '12px' }}
        >
          Create Bundle <ArrowRight size={22} />
        </button>
        
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '1.5rem', opacity: 0.8 }}>
          No signup required
        </p>
      </header>

      {/* Benefits Section */}
      <section style={{ marginBottom: '6rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-primary)' }}>Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          
          <div className="glass hover-lift" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--accent-color)' }}>
              <BookOpen size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Teachers</h3>
          </div>

          <div className="glass hover-lift" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--success-color)' }}>
              <Code size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Developers</h3>
          </div>

          <div className="glass hover-lift" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', color: '#f59e0b' }}>
              <GraduationCap size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Students</h3>
          </div>

          <div className="glass hover-lift" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
            <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: '#ec4899' }}>
              <Users size={40} />
            </div>
            <h3 style={{ fontSize: '1.4rem' }}>Teams</h3>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', color: 'var(--text-primary)' }}>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          <div style={{ position: 'relative', padding: '2.5rem', textAlign: 'left' }} className="glass hover-lift">
            <div style={{ position: 'absolute', top: '-1rem', left: '2rem', background: 'var(--accent-color)', color: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px var(--accent-glow)' }}>1</div>
            <LinkIcon size={36} color="var(--text-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Add links</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>Paste all the URLs you want to share into our simple editor.</p>
          </div>

          <div style={{ position: 'relative', padding: '2.5rem', textAlign: 'left' }} className="glass hover-lift">
            <div style={{ position: 'absolute', top: '-1rem', left: '2rem', background: 'var(--accent-color)', color: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px var(--accent-glow)' }}>2</div>
            <Box size={36} color="var(--text-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Generate bundle</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>We package your links together into one secure, beautiful collection.</p>
          </div>

          <div style={{ position: 'relative', padding: '2.5rem', textAlign: 'left' }} className="glass hover-lift">
            <div style={{ position: 'absolute', top: '-1rem', left: '2rem', background: 'var(--accent-color)', color: 'white', width: '2.5rem', height: '2.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', boxShadow: '0 4px 10px var(--accent-glow)' }}>3</div>
            <Share2 size={36} color="var(--text-secondary)" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Share one URL</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>Send a single short link to anyone. No accounts or signups required.</p>
          </div>

        </div>
      </section>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: var(--glass-shadow);
          border-color: var(--accent-glow);
        }
      `}} />
    </main>
    </>
  );
}
