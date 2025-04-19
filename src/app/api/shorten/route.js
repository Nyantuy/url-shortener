import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { customAlphabet } from 'nanoid';
import formSchema from '@/lib/schema';

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const generateHash = customAlphabet(chars, 6);

export async function GET() {
  return NextResponse.json({ message: 'Hello from the GET route!' });
}

export async function POST(request) {
  try {
    const { url, alias, duration, 'cf-turnstile-response': token } = await request.json();

    const validationResult = formSchema.safeParse({ url, alias, duration });
    if (!validationResult.success) {
      return NextResponse.json({ errors: validationResult.error.flatten().fieldErrors }, { status: 400 });
    }

    if (!url) {
      return NextResponse.json({ error: 'Origin url is required.' }, { status: 400 });
    }

    const existingUrl = await prisma.urlInfo.findFirst({
      where: { url },
    });

    const finalAlias = alias || generateHash();
    const shortUrl = `${process.env.HOST}/${finalAlias}`;

    let expiresAt = new Date('9999-12-31T23:59:59.999Z');
    if (duration) {
      const durationMs = convertDurationToMilliseconds(duration);
      if (!durationMs) {
        return NextResponse.json({ error: 'Duration must be in a valid format like "1h" or "1d".' }, { status: 400 });
      }
      expiresAt = new Date(Date.now() + durationMs);
    }

    if (!existingUrl) {
      await prisma.urlInfo.create({
        data: {
          url,
          uid: finalAlias,
          shortUrl,
          expiredAt: expiresAt,
        },
      });
    }

    return NextResponse.json({ shortUrl: existingUrl?.shortUrl || shortUrl }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

function convertDurationToMilliseconds(durationStr) {
  // Supports "h" (hours), "d" (days), and "w" (weeks)
  const regex = /^(\d+)([hdw])$/i;
  const match = durationStr.match(regex);
  if (!match) return null;

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  switch (unit) {
    case 'h':
      return value * 3600 * 1000;
    case 'd':
      return value * 24 * 3600 * 1000;
    case 'w':
      return value * 7 * 24 * 3600 * 1000;
    default:
      return null;
  }
}
