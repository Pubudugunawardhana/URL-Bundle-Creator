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
        <section style={{ marginBottom: '8rem', position: 'relative', zIndex: 1, perspective: '1000px' }}>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '80%', height: '80%', background: 'var(--accent-glow)', filter: 'blur(100px)', zIndex: -1 }}></div>
          
          <div className="glass" style={{ 
            padding: '0', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px var(--card-border)', 
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0.2) 100%)',
            backdropFilter: 'blur(20px)',
            transform: 'rotateX(2deg) rotateY(-1deg)',
            transition: 'transform 0.5s ease',
          }}>
            {/* Browser Header */}
            <div style={{ padding: '1.25rem', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--card-border)' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56', boxShadow: '0 0 5px #ff5f56' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e', boxShadow: '0 0 5px #ffbd2e' }}></div>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f', boxShadow: '0 0 5px #27c93f' }}></div>
              </div>
              <div style={{ 
                margin: '0 auto', 
                background: 'rgba(0,0,0,0.3)', 
                padding: '0.4rem 2rem', 
                borderRadius: '99px', 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)',
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                border: '1px solid rgba(255,255,255,0.05)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)'
              }}>
                <Lock size={12} color="var(--success-color)" /> <span style={{ opacity: 0.8 }}>urlbundle.com/create</span>
              </div>
              <div style={{ width: '56px' }}></div> {/* Spacer for balance */}
            </div>
            
            {/* Mockup Content */}
            <div style={{ padding: '3rem', textAlign: 'left', minHeight: '350px', background: 'rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>New Bundle</h3>
                <div style={{ background: 'var(--accent-color)', padding: '0.5rem 1.5rem', borderRadius: '8px', color: 'white', fontSize: '0.9rem', fontWeight: 600, boxShadow: '0 4px 15px var(--accent-glow)' }}>
                  Save Bundle
                </div>
              </div>
              
              {/* Mock Input Row 1 */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', position: 'relative' }}>
                <div style={{ flex: 1, height: '54px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-secondary)' }}>
                  <LinkIcon size={16} style={{ marginRight: '0.75rem', opacity: 0.5 }} />
                  https://github.com/facebook/react
                </div>
                <div style={{ width: '120px', height: '54px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  Edit
                </div>
              </div>

              {/* Mock Input Row 2 */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ flex: 1, height: '54px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '0 1rem', color: 'var(--text-secondary)' }}>
                  <LinkIcon size={16} style={{ marginRight: '0.75rem', opacity: 0.5 }} />
                  https://nextjs.org/docs
                </div>
                <div style={{ width: '120px', height: '54px', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  Edit
                </div>
              </div>

              {/* Mock Add Row */}
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', opacity: 0.6 }}>
                <div style={{ flex: 1, height: '54px', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                  + Paste another URL here...
                </div>
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
