'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function deleteBundle(bundleId) {
  try {
    const headersList = await headers();
    const cookieHeader = headersList.get('cookie') || '';

    const res = await fetch(`http://localhost:3002/api/bundles/${bundleId}`, {
      method: 'DELETE',
      headers: {
        cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || 'Failed to delete bundle' };
    }

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete bundle:', error);
    return { error: 'Failed to delete bundle' };
  }
}
