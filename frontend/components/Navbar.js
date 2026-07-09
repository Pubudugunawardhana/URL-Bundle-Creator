'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { PlaySquare, LogOut, LogIn, UserPlus, Heart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { data: session, status } = useSession();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
            
            {/* User Avatar with dropdown */}
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                title="Account"
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

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="glass" style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  right: 0,
                  width: '300px',
                  padding: '2rem 1.5rem',
                  borderRadius: '16px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--bg-color)'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: '64px', height: '64px', borderRadius: '50%', 
                      background: '#8b5cf6', color: 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontWeight: 'bold', fontSize: '1.8rem', marginBottom: '1rem' 
                    }}>
                      {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>
                      Hi, {session.user?.name || 'User'}!
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                      {session.user?.email}
                    </p>
                    <Link href="/settings" onClick={() => setIsDropdownOpen(false)} className="btn btn-outline" style={{ borderRadius: '99px', padding: '0.4rem 1rem', fontSize: '0.9rem', textDecoration: 'none' }}>
                      Manage your Account
                    </Link>
                  </div>
                  
                  <hr style={{ border: 'none', borderTop: '1px solid var(--card-border)', margin: '0 -1.5rem 1rem -1.5rem' }} />
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', 
                      padding: '0.75rem', background: 'transparent', border: 'none', 
                      color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px',
                      fontSize: '1rem', textAlign: 'left', fontWeight: 500
                    }}>
                      <Heart size={20} color="#f43f5e" />
                      Favourite Collections
                    </button>
                    
                    <button onClick={handleSignOut} style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', 
                      padding: '0.75rem', background: 'transparent', border: 'none', 
                      color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '8px',
                      fontSize: '1rem', textAlign: 'left', fontWeight: 500
                    }}>
                      <LogOut size={20} color="var(--text-secondary)" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
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
