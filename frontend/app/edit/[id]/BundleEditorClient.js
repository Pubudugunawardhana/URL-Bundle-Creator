'use client';
import { useRouter } from 'next/navigation';
import BundleEditor from '@/components/BundleEditor';

export default function BundleEditorClient({ bundle }) {
  const router = useRouter();

  return (
    <BundleEditor 
      mode="edit"
      initialBundle={bundle}
      onSave={() => {
        router.refresh();
        router.push('/dashboard');
      }} 
      onCancel={() => router.push('/dashboard')} 
    />
  );
}
