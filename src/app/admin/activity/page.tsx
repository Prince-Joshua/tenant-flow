import { getPlatformActivityPage } from "@/server/data/admin";
import { loadMorePlatformActivityAction } from "@/server/actions/pagination";
import PageHeader from "@/components/layout/PageHeader";
import PagedActivityFeed from "@/components/shared/PagedActivityFeed";

export default async function AdminActivityPage() {
  const { logs, nextCursor } = await getPlatformActivityPage();
  return (
    <>
      <PageHeader title="Activity" subtitle="Platform-wide audit log" />
      <PagedActivityFeed
        initialLogs={logs}
        initialCursor={nextCursor}
        loadMore={loadMorePlatformActivityAction}
      />
    </>
  );
}
