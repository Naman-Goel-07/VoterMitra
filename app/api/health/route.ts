import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/db';
import { env } from '@/lib/env';

export const dynamic = 'force-dynamic';

export async function GET() {
  const databaseConfigured = Boolean(env().DATABASE_URL);
  const databaseOk = databaseConfigured && (await healthCheck()).ok;
  return NextResponse.json({
    status: !databaseConfigured || databaseOk ? 'ok' : 'degraded',
    mode: databaseOk ? 'database' : 'demo',
  });
}
