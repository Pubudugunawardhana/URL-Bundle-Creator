'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { PlaySquare, LogOut, LogIn, UserPlus } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '1.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      opacity: visible ? 1 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
          <div className="glass" style={{ padding: '0.5rem', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlaySquare size={18} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '1.1rem' }}>URL Bundle</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />
        
        {status === 'loading' ? (
          <div className="loader" style={{ width: '16px', height: '16px' }} />
        ) : session ? (
          <>
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '99px', textDecoration: 'none' }}>
              Dashboard
            </Link>
            
            {/* User Avatar with dropdown for logout (simplified for now as click to logout or just avatar) */}
            <button 
              onClick={handleSignOut} 
              title="Sign out"
              style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                background: '#8b5cf6', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.1rem'
              }}
            >
              {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '99px', textDecoration: 'none' }}>
              Log In
            </Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', borderRadius: '99px', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
