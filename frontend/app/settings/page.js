'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Key, AlertTriangle, Save, Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    },
  });

  const [displayName, setDisplayName] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize display name when session loads
  if (session && !displayName && displayName !== session.user?.name) {
    setDisplayName(session.user?.name || '');
  }

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage('');

    try {
      const res = await fetch(`${backendUrl}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: displayName }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update profile');

      await update({ name: displayName });
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');

    try {
      const res = await fetch(`${backendUrl}/api/users/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to update password');

      setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you absolutely sure? This will delete your account and all your bundles forever.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`${backendUrl}/api/users/profile`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete account');
      }

      await signOut({ callbackUrl: '/' });
    } catch (error) {
      alert(error.message);
      setIsDeleting(false);
    }
  };

  if (!session) return null;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="grid-pattern-bg"></div>
      <main className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            <User size={32} style={{ color: 'var(--accent-color)' }} />
            Account Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginLeft: '3rem' }}>
            Manage your profile information and security preferences.
          </p>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Main Content (Forms) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Profile Information */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--accent-color)' }}></div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem' }}>Profile Information</h2>
              
              <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '120px', height: '120px', borderRadius: '50%', 
                    background: '#8b5cf6', color: 'white', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    fontWeight: 'bold', fontSize: '4rem',
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
                  }}>
                    {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <button className="btn btn-outline" style={{ border: 'none', color: 'var(--accent-color)', padding: '0.5rem', fontWeight: 600 }}>
                    Change Picture
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={session.user?.email || ''} 
                      disabled 
                      style={{ opacity: 0.6, cursor: 'not-allowed', background: 'var(--input-bg)' }}
                    />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      Email cannot be changed.
                    </p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      Display Name
                    </label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. John Doe" 
                      required
                    />
                  </div>

                  {profileMessage && (
                    <div style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', background: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: profileMessage.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                      {profileMessage.text}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button type="submit" disabled={isUpdatingProfile} className="btn btn-primary" style={{ background: 'var(--accent-color)', color: 'white' }}>
                      {isUpdatingProfile ? <Loader2 size={18} className="spin" /> : <Save size={18} />}
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Security */}
            <div className="glass" style={{ padding: '2rem', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'var(--text-primary)' }}></div>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={20} color="var(--text-secondary)" />
                Security
              </h2>
              
              <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      New Password
                    </label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {passwordMessage && (
                  <div style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', background: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: passwordMessage.type === 'success' ? 'var(--success-color)' : 'var(--danger-color)' }}>
                    {passwordMessage.text}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button type="submit" disabled={isUpdatingPassword} className="btn btn-primary" style={{ background: 'var(--text-primary)', color: 'var(--bg-color)' }}>
                    {isUpdatingPassword ? <Loader2 size={18} className="spin" /> : null}
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger-color)' }}>
                <AlertTriangle size={20} />
                Danger Zone
              </h2>
              <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem', opacity: 0.8, marginBottom: '1.5rem' }}>
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              <button onClick={handleDeleteProfile} disabled={isDeleting} className="btn" style={{ background: '#e11d48', color: 'white', padding: '0.75rem 1.5rem' }}>
                {isDeleting ? <Loader2 size={18} className="spin" /> : null}
                Delete Profile
              </button>
            </div>

          </div>

          {/* Sidebar */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Why customize?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Adding a profile picture and your name makes FocusTube feel more like home. It helps personalize your learning experience.
              </p>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Security Tips</h3>
              <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                <li>Use a strong password with a mix of letters, numbers, and symbols.</li>
                <li>Never share your password with anyone.</li>
                <li>Update your password regularly to keep your account secure.</li>
              </ul>
            </div>
          </div>
          
        </div>
      </main>
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
