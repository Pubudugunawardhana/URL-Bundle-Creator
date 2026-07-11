"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Heart } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function UserMenu() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const email = session?.user?.email || '';
  const name = session?.user?.name || '';
  const profilePicture = session?.user?.image || '';

  const defaultInitial = email ? email.charAt(0).toUpperCase() : 'U';
  const displayInitial = name ? name.charAt(0).toUpperCase() : defaultInitial;
  const displayName = name || (email ? email.split('@')[0] : 'User');

  if (status === 'loading') {
    return (
      <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
    );
  }

  if (!session) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm hover:shadow-md hover:scale-105 transition-all border-2 border-white dark:border-zinc-900 overflow-hidden"
      >
        {profilePicture ? (
          <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          displayInitial
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-6 flex flex-col items-center border-b border-black/5 dark:border-white/5">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl mb-3 shadow-md border-2 border-white dark:border-zinc-800 relative overflow-hidden">
              {profilePicture ? (
                <img src={profilePicture} alt={name} className="w-full h-full object-cover" />
              ) : (
                displayInitial
              )}
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white text-lg">Hi, {displayName}!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate w-full text-center">{email}</p>
            
            <Link 
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="mt-4 px-4 py-2 text-sm font-medium border border-black/10 dark:border-white/10 rounded-full text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors inline-block"
            >
              Manage your Account
            </Link>
          </div>
          
          <div className="p-2 border-b border-black/5 dark:border-white/5">
            <Link 
              href="/dashboard/favorites"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <Heart size={18} className="text-rose-500" />
              Favourite Bundles
            </Link>
          </div>
          
          <div className="p-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
