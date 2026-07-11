'use client';

import { useState } from 'react';
import { deleteBundle } from './actions';
import { Trash2 } from 'lucide-react';
import { ConfirmModal } from '@/components/confirm-modal';

export default function DeleteBundleButton({ bundle }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsModalOpen(false);
    setIsDeleting(true);
    try {
      const res = await deleteBundle(bundle.shortId);
      if (res?.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={isDeleting}
        className="btn btn-danger"
        style={{ padding: '0.6rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
      >
        <Trash2 size={16} />
        <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
      </button>

      <ConfirmModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Bundle"
        message="Are you sure you want to delete this bundle? This action cannot be undone."
        confirmText="Delete"
        isDestructive={true}
      />
    </>
  );
}
