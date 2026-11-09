import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { env } from '@/lib/env';
import { synthesize } from '@/lib/gnani';
import { clientIp, rateLimit } from '@/lib/rate-limit';
import { errorResponse } from '@/lib/route-helpers';
import { BOT_LANGUAGES } from '@/lib/telegram/i18n';

const speechInput = z.object({
  text: z.string().trim().min(1).max(400),
  language: z.enum(BOT_LANGUAGES),
});

export async function POST(req: NextRequest) {
  if (!env().GNANI_API_KEY) {
    return NextResponse.json({ error: 'Voice service unavailable.' }, { status: 503 });
  }

  if (!rateLimit(`speech:${clientIp(req)}`, 10, 60_000) || !rateLimit('speech', 90, 60_000)) {
    return NextResponse.json({ error: 'Too many speech requests.' }, { status: 429 });
  }

  const input = speechInput.safeParse(await req.json().catch(() => null));
  if (!input.success) {
    return NextResponse.json({ error: 'Send text of up to 400 characters and a supported language.' }, { status: 400 });
  }

  try {
    const result = await synthesize(input.data.text, { language: input.data.language, format: 'wav' });
    return new NextResponse(new Uint8Array(result.audio), {
      headers: { 'Content-Type': result.contentType, 'Cache-Control': 'no-store' },
    });
  } catch (err) {
    return errorResponse(err);
  }
}
