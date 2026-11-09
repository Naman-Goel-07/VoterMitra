import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getClaimAudit } from '@/lib/dashboard';
import { VerdictCard } from '@/components/verdict-card';
import { fromTelegramCode, strings } from '@/lib/telegram/i18n';
import { formatDateTime } from '@/lib/labels';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const audit = await getClaimAudit(id);
  if (!audit) return { title: 'VoterMitra · Audit Result' };

  const lang = fromTelegramCode(audit.language_code ?? undefined);
  const label = audit.verdict ? strings[lang].verdicts[audit.verdict] : 'VoterMitra';
  return {
    title: `${label} · VoterMitra`,
    description: audit.official_explanation,
    openGraph: { title: `${label} · VoterMitra`, description: audit.official_explanation },
  };
}

export default async function SharedVerdictPage({ params }: Props) {
  const { id } = await params;
  const audit = await getClaimAudit(id);
  if (!audit) notFound();

  const lang = fromTelegramCode(audit.language_code ?? undefined);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Banner */}
      <div className="bg-[#0F2C59] text-white py-3 px-4 border-b border-[#0A1E3F]">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="font-serif font-black text-amber-400">⚖</span>
            <span className="text-sm font-black tracking-wide">मतदाता मित्र (VoterMitra)</span>
          </Link>
          <span className="text-[11px] text-slate-300 font-medium hidden sm:inline">
            मतदाता सूची विश्लेषण प्रोटोटाइप
          </span>
        </div>
      </div>

      <main className="max-w-3xl mx-auto space-y-4 px-4 py-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-[#0F2C59] hover:underline inline-flex items-center gap-1">
            <span>←</span>
            <span>नागरिक मुख्य पृष्ठ पर लौटें (Return to Portal)</span>
          </Link>
          <span className="text-[11px] text-slate-500 font-mono">
            सत्यापन तिथि: {formatDateTime(audit.created_at)}
          </span>
        </div>

        <VerdictCard
          lang={lang}
          answer={{
            verdict: audit.verdict,
            confidence: audit.confidence,
            summary: audit.official_explanation,
            reasoning: audit.reasoning,
            sources: [],
          }}
        />

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-[#0F2C59] px-5 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#0A1E3F] transition w-full sm:w-auto"
          >
            नवीन मतदाता सत्यापन करें (Check Another Claim)
          </Link>

          <p className="text-[11px] text-slate-500 text-center sm:text-right">
            VoterMitra independent prototype
          </p>
        </div>
      </main>
    </div>
  );
}
