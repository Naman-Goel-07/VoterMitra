import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { env } from './env';
import type { Role } from './labels';

export interface Reviewer {
  name: string;
  role: Role;
}

const COOKIE = 'vm_reviewer_session';
const MAX_AGE_S = 12 * 60 * 60;

function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());
}

function reviewerAccount() {
  const { DASHBOARD_REVIEWER_NAME: name, DASHBOARD_REVIEWER_ROLE: role,
    DASHBOARD_PASSCODE: passcode, SESSION_SECRET: secret } = env();
  if (!name || !role || !passcode || !secret) return null;
  return { name, role, passcode, secret };
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export async function signInReviewer(passcode: string): Promise<boolean> {
  const account = reviewerAccount();
  if (!account || !safeEqual(account.passcode, passcode)) return false;
  const payload = Buffer.from(
    JSON.stringify({ name: account.name, role: account.role, exp: Date.now() + MAX_AGE_S * 1000 }),
  ).toString('base64url');

  (await cookies()).set(COOKIE, `${payload}.${sign(payload, account.secret)}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE_S,
  });
  return true;
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function getReviewer(): Promise<Reviewer | null> {
  const account = reviewerAccount();
  if (!account) return null;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const [payload, signature] = raw.split('.');
  if (!payload || !signature || !safeEqual(signature, sign(payload, account.secret))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Record<string, unknown>;
    if (typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    if (data.name !== account.name || data.role !== account.role) return null;
    return { name: account.name, role: account.role };
  } catch {
    return null;
  }
}

export async function requireReviewer(): Promise<Reviewer> {
  const reviewer = await getReviewer();
  if (!reviewer) redirect('/login');
  return reviewer;
}
