'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { destroySession, signInReviewer } from '@/lib/auth';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export interface LoginState {
  error?: string;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const ip = clientIp({ headers: await headers() });
  if (!rateLimit('reviewer-login', 60, 60_000) || !rateLimit('reviewer-login:' + ip, 8, 60_000)) {
    return { error: 'Too many sign-in attempts. Try again in a minute.' };
  }

  const passcode = formData.get('passcode');
  if (typeof passcode !== 'string' || passcode.length > 256 || !(await signInReviewer(passcode))) {
    return { error: 'Unable to sign in with that passcode.' };
  }
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/');
}
