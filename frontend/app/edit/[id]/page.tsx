import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import BundleEditorClient from './BundleEditorClient';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserMenu } from '@/components/user-menu';

export default async function EditBundlePage({ params }) {
  const { id } = await params;
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const headersList = await headers();
  const cookieHeader = headersList.get('cookie') || '';

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';
  
  // Fetch user's bundles to verify ownership and get data
  const res = await fetch(`${backendUrl}/api/bundles`, {
    headers: { cookie: cookieHeader },
    cache: 'no-store',
  });
  
  const bundles = res.ok ? await res.json() : [];
  const bundle = bundles.find(b => b.shortId === id);

  if (!bundle) {
    redirect("/dashboard");
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
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 transition-colors shadow-sm outline-none">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white transition-colors">URL Bundle Creator</h1>
              <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider transition-colors">Learning Hub</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 animate-fade-in">
        <BundleEditorClient bundle={bundle} />
      </main>
    </div>
  );
}
