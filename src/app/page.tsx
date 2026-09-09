import { getPlatformActivity } from '@/server/data/admin';
import PageHeader from '@/components/layout/PageHeader';
import { ActivityFeed } from '@/components/shared';

export default async function AdminActivityPage() {
  const logs = JSON.parse(JSON.stringify(await getPlatformActivity()));
  return (
    <>
      <PageHeader title="Activity" subtitle="Platform-wide audit log" />
      <ActivityFeed logs={logs} />
    </>
  );
}
