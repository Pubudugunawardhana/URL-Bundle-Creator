'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyPassword(bundleId, formData) {
  const password = formData.get('password');
  
  if (!password) {
    return { error: 'Password is required' };
  }

  const bundle = await prisma.bundle.findUnique({
    where: { shortId: bundleId }
  });

  if (!bundle || !bundle.password) {
    return { error: 'Invalid bundle or no password required' };
  }

  const hashedPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');

  if (bundle.password === hashedPassword) {
    const cookieStore = await cookies();
    cookieStore.set(`bundle_pass_${bundleId}`, hashedPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    });
    return { success: true };
  } else {
    return { error: 'Incorrect password' };
  }
}
