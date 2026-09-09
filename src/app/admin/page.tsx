import { Box, Flex, Grid, Text } from '@chakra-ui/react';
import { getAdminStats } from '@/server/data/admin';
import PageHeader from '@/components/layout/PageHeader';
import { StatCard, PlanBadge, EmptyState } from '@/components/shared';
import { ChakraLink } from '@/components/shared/ChakraLink';

export default async function AdminOverviewPage() {
  const { stats, recentOrgs, recentUsers } = JSON.parse(JSON.stringify(await getAdminStats()));

  return (
    <>
      <PageHeader title="Platform" subtitle="Overview across every tenant" />

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="4" mb="8">
        <StatCard label="Total users" value={stats.totalUsers} icon="✦" />
        <StatCard label="Total organizations" value={stats.totalOrgs} icon="◈" />
        <StatCard label="Total documents" value={stats.totalDocuments} icon="◇" accent />
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="4" mb="8">
        {Object.entries(stats.plans as Record<string, number>).map(([plan, count]) => (
          <Box key={plan} bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="5">
            <Flex align="center" justify="space-between" mb="2">
              <PlanBadge plan={plan} />
              <Text fontSize="xs" color="text.muted" textTransform="uppercase" letterSpacing="wider">Plan</Text>
            </Flex>
            <Text fontSize="2xl" fontWeight="bold" color="text.primary">{count}</Text>
            <Text fontSize="xs" color="text.muted">organizations</Text>
          </Box>
        ))}
      </Grid>

      <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap="6">
        <Box>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="semibold" color="text.primary">Recent organizations</Text>
            <ChakraLink href="/admin/orgs" fontSize="xs" color="violet.400">View all →</ChakraLink>
          </Flex>
          {!recentOrgs.length ? (
            <EmptyState icon="◈" title="No organizations yet" />
          ) : (
            <Flex direction="column" gap="2">
              {recentOrgs.map((org: any) => (
                <Flex key={org._id} justify="space-between" align="center" bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="4">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="text.primary">{org.name}</Text>
                    <Text fontSize="xs" color="text.muted">{org.owner?.email}</Text>
                  </Box>
                  <PlanBadge plan={org.plan} />
                </Flex>
              ))}
            </Flex>
          )}
        </Box>

        <Box>
          <Flex justify="space-between" align="center" mb="4">
            <Text fontSize="sm" fontWeight="semibold" color="text.primary">Recent users</Text>
            <ChakraLink href="/admin/users" fontSize="xs" color="violet.400">View all →</ChakraLink>
          </Flex>
          {!recentUsers.length ? (
            <EmptyState icon="✦" title="No users yet" />
          ) : (
            <Flex direction="column" gap="2">
              {recentUsers.map((u: any) => (
                <Flex key={u._id} justify="space-between" align="center" bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="4">
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" color="text.primary">{u.name}</Text>
                    <Text fontSize="xs" color="text.muted">{u.email}</Text>
                  </Box>
                  <Text fontSize="xs" color={u.isEmailVerified ? 'emerald.400' : 'text.muted'}>{u.isEmailVerified ? 'Verified' : 'Unverified'}</Text>
                </Flex>
              ))}
            </Flex>
          )}
        </Box>
      </Grid>
    </>
  );
}
