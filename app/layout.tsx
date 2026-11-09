import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { env } from '@/lib/env';
import { LanguageProvider } from '@/components/language-context';

export const metadata: Metadata = {
  metadataBase: new URL(env().PUBLIC_BASE_URL ?? 'http://localhost:3000'),
  title: 'VoterMitra · Electoral Roll Transparency & Anomaly Auditing',
  description: 'Independent prototype for electoral-roll comparison and anomaly review.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen bg-slate-50 text-slate-900 antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
