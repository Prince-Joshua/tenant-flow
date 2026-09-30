import { requireTenant } from "@/server/data/tenant";
import { getOrgActivityPage } from "@/server/data/org";
import { loadMoreOrgActivityAction } from "@/server/actions/pagination";
import PageHeader from "@/components/layout/PageHeader";
import PagedActivityFeed from "@/components/shared/PagedActivityFeed";
import { cardProps } from "@/lib/cardStyles";
import { Box } from "@chakra-ui/react";

export default async function DashboardActivityPage() {
  const { org } = await requireTenant();
  const { logs, nextCursor } = await getOrgActivityPage(org);
  return (
    <>
      <PageHeader title="Activity" subtitle={`Audit log for ${org.name}`} />
      <Box {...cardProps} p="2">
        <PagedActivityFeed
          initialLogs={logs}
          initialCursor={nextCursor}
          loadMore={loadMoreOrgActivityAction}
          emptyMessage="No activity yet — generate your first document to get started."
        />
      </Box>
    </>
  );
}
