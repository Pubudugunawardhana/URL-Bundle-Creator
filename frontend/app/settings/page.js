'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { User, Key, AlertTriangle, Save, Loader2, PlaySquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { ConfirmModal } from '@/components/confirm-modal';

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, update, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (session && !displayName && session.user?.name) {
      setDisplayName(session.user.name);
    }
  }, [session]);



  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage('');

    try {
      const res = await fetch(`/api/users/profile`, {
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
      const res = await fetch(`/api/users/password`, {
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
    setIsDeleteModalOpen(false);
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/users/profile`, {
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

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black transition-colors duration-300">
        <Loader2 className="animate-spin text-emerald-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans transition-colors duration-300 relative">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 flex justify-center pointer-events-none">
        <div className="absolute top-[-20%] w-[800px] h-[600px] bg-emerald-600/10 dark:bg-emerald-600/15 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen pointer-events-none transition-colors duration-300"></div>
      </div>
      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none transition-colors duration-300"></div>

      {/* Header */}
      <header className="relative z-40 border-b border-black/5 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <ArrowLeft size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Back to Dashboard</h1>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-3">
            <User size={28} className="text-emerald-500" />
            Account Settings
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 ml-10">
            Manage your profile information and security preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          
          {/* Main Content (Forms) */}
          <div className="flex flex-col gap-8">
            
            {/* Profile Information */}
            <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">Profile Information</h3>
              
              <div className="flex flex-col sm:flex-row gap-8 items-start">
                <div className="flex flex-col items-center gap-4 shrink-0 mx-auto sm:mx-0">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-4xl shadow-lg border-4 border-white dark:border-zinc-900 relative overflow-hidden">
                    {(session.user?.name?.[0] || session.user?.email?.[0] || 'U').toUpperCase()}
                  </div>
                  <button className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl">
                    Change Picture
                  </button>
                </div>

                <form onSubmit={handleUpdateProfile} className="flex-1 w-full flex flex-col gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      value={session.user?.email || ''} 
                      disabled 
                      className="w-full bg-zinc-100 dark:bg-zinc-900/50 border border-black/5 dark:border-white/5 text-zinc-500 dark:text-zinc-400 text-sm rounded-xl px-4 py-3 cursor-not-allowed opacity-80"
                    />
                    <p className="text-xs font-medium text-zinc-500 dark:text-zinc-500 ml-1">
                      Email cannot be changed.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      Display Name
                    </label>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. John Doe" 
                      required
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm dark:shadow-inner"
                    />
                  </div>

                  {profileMessage && (
                    <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'}`}>
                      {profileMessage.text}
                    </div>
                  )}

                  <div className="flex justify-end mt-2">
                    <button 
                      type="submit" 
                      disabled={isUpdatingProfile} 
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      Save Profile
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-xl backdrop-blur-xl transition-all relative overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-800 dark:bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                <Key size={20} className="text-zinc-500 dark:text-zinc-400" />
                Security
              </h3>
              
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                    Current Password
                  </label>
                  <input 
                    type="password" 
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-zinc-500 dark:focus:border-white focus:ring-1 focus:ring-zinc-500 dark:focus:ring-white transition-all duration-300 shadow-sm dark:shadow-inner"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      New Password
                    </label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-zinc-500 dark:focus:border-white focus:ring-1 focus:ring-zinc-500 dark:focus:ring-white transition-all duration-300 shadow-sm dark:shadow-inner"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">
                      Confirm New Password
                    </label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-zinc-500 dark:focus:border-white focus:ring-1 focus:ring-zinc-500 dark:focus:ring-white transition-all duration-300 shadow-sm dark:shadow-inner"
                    />
                  </div>
                </div>

                {passwordMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium flex items-center gap-2 ${passwordMessage.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'}`}>
                    {passwordMessage.text}
                  </div>
                )}

                <div className="flex justify-end mt-2">
                  <button 
                    type="submit" 
                    disabled={isUpdatingPassword} 
                    className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-70 text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : null}
                    Update Password
                  </button>
                </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-rose-600 dark:text-rose-500 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} />
                Danger Zone
              </h3>
              <p className="text-sm text-rose-700/80 dark:text-rose-400/80 font-medium mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              
              <button 
                onClick={() => setIsDeleteModalOpen(true)} 
                disabled={isDeleting} 
                className="bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-70 text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                Delete Profile
              </button>
            </div>

          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6 sticky top-28">
            <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-3">Why customize?</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Adding a profile picture and your name makes URL Bundle Creator feel more like home. It helps personalize your learning experience.
              </p>
            </div>
            
            <div className="bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-4">Security Tips</h3>
              <ul className="flex flex-col gap-3">
                <li className="text-sm text-zinc-600 dark:text-zinc-400 font-medium flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  Use a strong password with a mix of letters, numbers, and symbols.
                </li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 font-medium flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  Never share your password with anyone.
                </li>
                <li className="text-sm text-zinc-600 dark:text-zinc-400 font-medium flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div>
                  Update your password regularly to keep your account secure.
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </main>

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProfile}
        title="Delete Account"
        message="Are you absolutely sure? This will delete your account and all your bundles forever. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Keep Account"
        isDestructive={true}
      />
    </div>
  );
}
