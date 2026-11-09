// Simple per-instance sliding window. Enough to stop casual abuse of the paid
// speech APIs during a demo; use a shared store (e.g. Redis) for real traffic.
const hits = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  if (!hits.has(key) && hits.size >= 10_000) {
    for (const [candidate, times] of hits) {
      if (times.at(-1)! <= now - 60_000) hits.delete(candidate);
    }
    if (hits.size >= 10_000) return false;
  }
  recent.push(now);
  hits.set(key, recent);
  return true;
}

export function clientIp(req: Pick<Request, 'headers'>): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
}
