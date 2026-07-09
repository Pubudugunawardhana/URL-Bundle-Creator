'use server';

import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function verifyPassword(bundleId, formData) {
  const password = formData.get('password');
  
  if (!password) {
    return { error: 'Password is required' };
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3002";
    const res = await fetch(`${backendUrl}/api/bundles/${bundleId}/verify-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || 'Incorrect password' };
    }

    const hashedPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');

    const cookieStore = await cookies();
    cookieStore.set(`bundle_pass_${bundleId}`, hashedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    return { success: true };
  } catch (error) {
    console.error('Error verifying password:', error);
    return { error: 'Failed to verify password' };
  }
}
