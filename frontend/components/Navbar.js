'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Layers, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="glass no-print" style={{
      position: 'sticky',
      top: '1rem',
      left: '1rem',
      right: '1rem',
      margin: '1rem auto',
      maxWidth: '1000px',
      zIndex: 40,
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--glass-shadow)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.2rem' }}>
          <Layers size={20} color="var(--accent-color)" />
          <span>URL Bundle Creator</span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto', marginRight: '4.5rem' }}>
        {status === 'loading' ? (
          <div className="loader" style={{ width: '16px', height: '16px' }} />
        ) : session ? (
          <>
            <Link href="/dashboard" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              <LayoutDashboard size={16} />
              <span>Dashboard</span>
            </Link>
            <button onClick={handleSignOut} className="btn btn-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              <LogIn size={16} />
              <span>Log In</span>
            </Link>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem', textDecoration: 'none' }}>
              <UserPlus size={16} />
              <span>Sign Up</span>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
