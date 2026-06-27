import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import crypto from 'crypto';

// Alphabet that avoids confusing characters
const nanoid = customAlphabet('346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnopqrstuvwxyz', 5);

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, links, password } = body;

    if (!name || !links || !Array.isArray(links) || links.length === 0) {
      return NextResponse.json({ error: 'Bundle name and at least one link are required.' }, { status: 400 });
    }

    const shortId = nanoid();

    let hashedPassword = null;
    if (password && password.trim() !== '') {
      hashedPassword = crypto.createHash('sha256').update(password.trim()).digest('hex');
    }

    const bundle = await prisma.bundle.create({
      data: {
        shortId,
        name,
        description: description || null,
        password: hashedPassword,
        links: {
          create: links.map((link, index) => ({
            url: link.url,
            title: link.title || null,
            description: link.description || null,
            favicon: link.favicon || null,
            note: link.note || null,
            order: index
          }))
        }
      },
      include: {
        links: true
      }
    });

    return NextResponse.json(bundle, { status: 201 });
  } catch (error) {
    console.error('Error creating bundle:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
