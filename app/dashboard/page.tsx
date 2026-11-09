import { requireReviewer } from '@/lib/auth';
import { getBenchmark, getOverview } from '@/lib/dashboard';
import { DashboardOverviewView } from '@/components/dashboard-overview-view';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  await requireReviewer();
  const [o, b] = await Promise.all([getOverview(), getBenchmark()]);
  return <DashboardOverviewView overview={o} benchmark={b} />;
}
