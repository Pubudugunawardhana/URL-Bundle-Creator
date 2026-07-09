'use client';
import { useState } from 'react';
import BundleEditor from '@/components/BundleEditor';
import ShareModal from '@/components/ShareModal';
import { Layers, BookOpen, Code, GraduationCap, Users, Link as LinkIcon, Box, Share2, ArrowRight, Lock } from 'lucide-react';

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
      <main style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center', display: (!isEditing && !createdBundle) ? 'block' : 'none', position: 'relative' }} className="animate-fade-in">
        
        {/* Background ambient glow */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'var(--accent-glow)', borderRadius: '50%', filter: 'blur(120px)', zIndex: -1, pointerEvents: 'none' }}></div>
        
        {/* Hero Section */}
        <header style={{ marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '0.5rem 1rem', borderRadius: '9999px', marginBottom: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-color)' }}></span>
            Organize your links seamlessly
          </div>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', marginBottom: '1.5rem', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
            Share multiple URLs with <br/>
            <span style={{ background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>one elegant bundle</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem auto', lineHeight: 1.6 }}>
            Package your resources, documentation, or reading lists into a single, secure, and easily shareable link. No signup required.
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-primary" 
              onClick={() => setIsEditing(true)}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem', borderRadius: '9999px' }}
            >
              Create Bundle <ArrowRight size={20} />
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(true)}
              style={{ fontSize: '1.1rem', padding: '1rem 2rem', borderRadius: '9999px' }}
            >
              View Live Demo
            </button>
          </div>
        </header>

        {/* Mockup Dashboard Section */}
        <section style={{ marginBottom: '8rem', position: 'relative', zIndex: 1 }}>
          <div className="glass" style={{ padding: '0', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', border: '1px solid var(--card-border)' }}>
            {/* Browser Header */}
            <div style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
              <div style={{ marginLeft: '1rem', background: 'var(--input-bg)', padding: '0.25rem 1rem', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={12} /> https://urlbundle.com/create
              </div>
            </div>
            {/* Mockup Content */}
            <div style={{ padding: '3rem', background: 'var(--card-bg)', textAlign: 'left', minHeight: '300px' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>New Bundle</h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, height: '48px', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--card-border)' }}></div>
                <div style={{ width: '100px', height: '48px', background: 'var(--text-primary)', borderRadius: '8px' }}></div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', opacity: 0.7 }}>
                <div style={{ flex: 1, height: '48px', background: 'var(--input-bg)', borderRadius: '8px', border: '1px solid var(--card-border)' }}></div>
                <div style={{ width: '100px', height: '48px', background: 'var(--text-primary)', borderRadius: '8px' }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ marginBottom: '6rem', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--accent-color)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.85rem' }}>Features</div>
          <h2 style={{ fontSize: '3rem', marginBottom: '4rem', color: 'var(--text-primary)', fontWeight: 700 }}>Everything you need</h2>
          
          <div className="features-grid">
            
            <div className="glass hover-lift" style={{ padding: '2rem', borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                <LinkIcon size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Unlimited Links</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>Add as many URLs as you want into a single bundle. Organize your resources effortlessly.</p>
            </div>

            <div className="glass hover-lift" style={{ padding: '2rem', borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                <Lock size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Password Protected</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>Secure your bundles with a password to ensure only the right people can access your links.</p>
            </div>

            <div className="glass hover-lift" style={{ padding: '2rem', borderRadius: '16px', transition: 'all 0.3s ease' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', marginBottom: '1.5rem' }}>
                <Share2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 600 }}>Easy Sharing</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>Generate a short, clean URL that you can share anywhere. No accounts required for your viewers.</p>
            </div>

          </div>
        </section>
        
        <style dangerouslySetInnerHTML={{__html: `
          .hover-lift:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 40px -10px var(--accent-glow);
            border-color: var(--card-border);
          }
          .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
            text-align: left;
          }
          @media (max-width: 768px) {
            .features-grid {
              grid-template-columns: 1fr;
            }
          }
        `}} />
      </main>
    </>
  );
}
