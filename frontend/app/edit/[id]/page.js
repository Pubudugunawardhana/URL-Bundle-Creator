import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import BundleEditorClient from './BundleEditorClient';

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
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div className="grid-pattern-bg"></div>
      <main className="container animate-fade-in" style={{ padding: '4rem 1rem', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <BundleEditorClient bundle={bundle} />
      </main>
    </div>
  );
}
