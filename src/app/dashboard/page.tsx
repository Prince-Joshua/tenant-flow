import { Grid, Box, Flex, Text } from '@chakra-ui/react';
import { requireTenant } from '@/server/data/tenant';
import { getBillingInfo } from '@/server/data/billing';
import { getDocuments } from '@/server/data/documents';
import { getOrgMembers, getOrgActivity } from '@/server/data/org';
import PageHeader from '@/components/layout/PageHeader';
import { StatCard, UsageBar, ActivityFeed } from '@/components/shared';
import { ChakraLink } from '@/components/shared/ChakraLink';

export default async function DashboardOverviewPage() {
  const { user, org } = await requireTenant();

  const [billing, { pagination: docPagination }, members, activity] = await Promise.all([
    getBillingInfo(org),
    getDocuments(org, { limit: 1 }),
    getOrgMembers(org),
    getOrgActivity(org, 8),
  ]);

  const logs = JSON.parse(JSON.stringify(activity));

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(' ')[0]}`} subtitle={org.name} />

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="4" mb="8">
        <StatCard label="Documents" value={docPagination.total} icon="✦" />
        <StatCard label="Members" value={`${members.length} / ${org.limits.membersAllowed >= 999999 ? '∞' : org.limits.membersAllowed}`} icon="◈" />
        <StatCard label="Plan" value={billing.plan} icon="◇" accent />
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
        <Box bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="6">
          <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="4">Usage this cycle</Text>
          <UsageBar label="Documents generated" used={billing.usage.documentsGenerated} total={billing.limits.documentsPerCycle} />
          <ChakraLink href="/dashboard/billing" fontSize="xs" color="violet.400" mt="4" display="inline-block">Manage billing →</ChakraLink>
        </Box>

        <Box>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="semibold" color="text.primary">Recent activity</Text>
            <ChakraLink href="/dashboard/documents" fontSize="xs" color="violet.400">View documents →</ChakraLink>
          </Flex>
          <Box bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="2">
            <ActivityFeed logs={logs} emptyMessage="No activity yet — generate your first document to get started." />
          </Box>
        </Box>
      </Grid>
    </>
  );
}
