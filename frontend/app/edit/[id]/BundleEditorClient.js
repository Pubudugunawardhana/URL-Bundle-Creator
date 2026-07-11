'use client';
import { useRouter } from 'next/navigation';
import BundleManager from '@/components/BundleManager';

export default function BundleEditorClient({ bundle }) {
  return (
    <BundleManager initialBundle={bundle} />
  );
}
