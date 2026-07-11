"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import api from '@/lib/axios';
import Link from 'next/link';
import { Folder, Plus, Loader2, PlaySquare, ArrowRight, LayoutGrid, X, Heart } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';
import { IconRenderer, ICON_OPTIONS } from '@/lib/icons';

interface BundleProgress {
  percentage: number;
  totalLinks: number;
  watchedLinks: number;
}

interface Bundle {
  shortId: string;
  name: string;
  category?: string;
  isFavorite?: boolean;
  icon?: string;
  progress?: BundleProgress;
}

export default function Dashboard() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newBundleName, setNewBundleName] = useState('');
  const [newBundleCategory, setNewBundleCategory] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('Folder');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  const fetchBundles = async () => {
    try {
      const res = await api.get('/bundles');
      const bundlesWithProgress = res.data.map((c) => {
        const totalLinks = c.links ? c.links.length : 0;
        return { 
          ...c, 
          progress: { percentage: 0, totalLinks, watchedLinks: 0 } 
        };
      });
      setBundles(bundlesWithProgress);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated') {
      const timer = setTimeout(() => {
        fetchBundles();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  const handleCreateBundle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBundleName.trim() || isCreating) return;
    
    setIsCreating(true);
    try {
      await api.post('/bundles', { 
        name: newBundleName, 
        icon: selectedIcon, 
        category: newBundleCategory.trim() || undefined 
      } )
      setShowModal(false);
      setNewBundleName('');
      setNewBundleCategory('');
      setSelectedIcon('Folder');
      fetchBundles();
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleFavorite = async (e: React.MouseEvent, bundleId: string, currentStatus: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistic UI update
    setBundles(bundles.map(c => 
      c.shortId === bundleId ? { ...c, isFavorite: !currentStatus } : c
    ));
    
    try {
      await api.put(`/bundles/${bundleId}`, { isFavorite: !currentStatus } )
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert on failure
      setBundles(bundles.map(c => 
        c.shortId === bundleId ? { ...c, isFavorite: currentStatus } : c
      ));
    }
  };


  if (loading) {
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
          <Link href="/" className="flex items-center gap-3 group outline-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 dark:from-emerald-600 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <PlaySquare size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">URL Bundle Creator</h1>
              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider group-hover:text-emerald-500/70 transition-colors">Learning Hub</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all flex items-center gap-2 shadow-md hidden sm:flex"
            >
              <Plus size={16} /> New Bundle
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
              <LayoutGrid size={24} className="text-emerald-500" />
              Your Bundles
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Organize and track your YouTube tutorials</p>
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl px-4 py-2.5 transition-all flex items-center justify-center gap-2 shadow-md sm:hidden w-full"
          >
            <Plus size={16} /> New Bundle
          </button>
        </div>

        {bundles.length === 0 ? (
          <div className="w-full bg-white dark:bg-black/50 border border-black/10 dark:border-white/10 rounded-3xl p-12 shadow-xl flex flex-col items-center justify-center backdrop-blur-xl transition-colors duration-300 min-h-[400px]">
            <div className="w-20 h-20 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-6 shadow-inner">
              <Folder size={32} className="text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">No bundles yet</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-sm text-center">Create your first bundle to start organizing your YouTube links and tracking your learning progress.</p>
            <button 
              onClick={() => setShowModal(true)} 
              className="bg-zinc-900 dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-semibold rounded-xl px-6 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={16} /> Create First Bundle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bundles.map(c => (
              <Link href={`/edit/${c.shortId}`} key={c.shortId} className="group outline-none">
                <div className="h-full bg-white dark:bg-black/40 border border-black/10 dark:border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500/30 dark:hover:border-emerald-500/30 transition-all duration-300 backdrop-blur-xl flex flex-col relative overflow-hidden">
                  {/* Subtle top highlight on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-black/5 dark:border-white/5 flex items-center justify-center mb-1 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 transition-colors">
                      <IconRenderer iconName={c.icon || 'Folder'} size={22} className="text-zinc-600 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <button 
                      onClick={(e) => handleToggleFavorite(e, c.shortId, !!c.isFavorite)}
                      className={`p-2 rounded-full transition-colors ${c.isFavorite ? 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10'}`}
                    >
                      <Heart size={20} className={c.isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>
                  
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 truncate" title={c.name}>{c.name}</h3>
                  {c.category ? (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 w-fit">
                      {c.category}
                    </span>
                  ) : (
                    <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-500 w-fit">
                      Uncategorized
                    </span>
                  )}
                  
                  <div className="mt-auto pt-8">
                    <div className="flex justify-between items-end mb-2 text-sm font-medium">
                      <span className="text-zinc-500 dark:text-zinc-400">Progress</span>
                      <span className="text-zinc-900 dark:text-white text-lg">{c.progress?.percentage || 0}%</span>
                    </div>
                    <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2.5 mb-3 overflow-hidden shadow-inner border border-black/5 dark:border-white/5">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                        style={{ width: `${c.progress?.percentage || 0}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }}
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                      <PlaySquare size={13} />
                      <span>{c.progress?.watchedLinks || 0} of {c.progress?.totalLinks || 0} links watched</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 fade-in duration-200">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5 border border-emerald-200 dark:border-emerald-500/20">
              <IconRenderer iconName={selectedIcon} size={24} />
            </div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Create Bundle</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Give your new bundle a descriptive name and icon.</p>
            
            <form onSubmit={handleCreateBundle}>
              <div className="space-y-1.5 mb-6">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Icon</label>
                <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 p-2 bg-zinc-50 dark:bg-black/30 border border-black/5 dark:border-white/5 rounded-xl max-h-32 overflow-y-auto custom-scrollbar">
                  {ICON_OPTIONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setSelectedIcon(iconName)}
                      className={`p-2 rounded-lg flex items-center justify-center transition-all ${selectedIcon === iconName ? 'bg-emerald-500 text-white shadow-md scale-110' : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'}`}
                      title={iconName}
                    >
                      <IconRenderer iconName={iconName} size={18} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5 mb-5">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Bundle Name</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                  value={newBundleName}
                  onChange={(e) => setNewBundleName(e.target.value)}
                  placeholder="e.g. React Mastery, Finance 101"
                  autoFocus
                  required
                />
              </div>
              <div className="space-y-1.5 mb-8">
                <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 ml-1">Category (Optional)</label>
                <input 
                  type="text" 
                  className="w-full bg-zinc-50 dark:bg-black border border-black/10 dark:border-white/10 text-zinc-900 dark:text-white text-sm rounded-xl px-4 py-3 outline-none focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-300 shadow-sm dark:shadow-inner" 
                  value={newBundleCategory}
                  onChange={(e) => setNewBundleCategory(e.target.value)}
                  placeholder="e.g. Programming, Music, Gaming"
                />
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  disabled={isCreating}
                  className="flex-1 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 text-zinc-700 dark:text-zinc-300 text-sm font-semibold rounded-xl px-4 py-3 transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-70 text-white text-sm font-semibold rounded-xl px-4 py-3 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  {isCreating ? (
                    <><Loader2 size={16} className="animate-spin" /> Creating...</>
                  ) : (
                    <>Create <ArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
