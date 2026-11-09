import { NextRequest, NextResponse } from 'next/server';
import { after } from 'next/server';
import { env } from '@/lib/env';
import { getTelegramBot } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Up to 60s for STT -> Reasoning -> TTS on Vercel Fluid Compute

export async function POST(req: NextRequest) {
  const secret = env().TELEGRAM_SECRET_TOKEN;

  if (!secret) {
    return NextResponse.json({ error: 'Webhook unavailable' }, { status: 503 });
  }

  if (req.headers.get('x-telegram-bot-api-secret-token') !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const bot = getTelegramBot();
  if (!bot) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 503 });
  }

  let update: Parameters<typeof bot.handleUpdate>[0];
  try {
    update = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  // Next.js after() ensures we return HTTP 200 immediately so Telegram does not retry duplicates,
  // while processing voice / text messages in the background on Fluid compute.
  after(async () => {
    try {
      await bot.handleUpdate(update);
    } catch (err) {
      console.error('[telegram webhook] update handling error:', err);
    }
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'VoterMitra Telegram Bot Webhook',
    timestamp: new Date().toISOString(),
  });
}
