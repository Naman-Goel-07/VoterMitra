import { NextResponse } from 'next/server';
import { GnaniError } from './gnani';

export function errorResponse(err: unknown): NextResponse {
  if (err instanceof GnaniError) {
    console.error('[voice provider] Request failed', { status: err.status, type: err.type });
    return NextResponse.json({ error: 'Voice service unavailable.' }, { status: 502 });
  }

  console.error('[api] Request failed', err instanceof Error ? err.name : typeof err);
  return NextResponse.json({ error: 'Request failed.' }, { status: 500 });
}
