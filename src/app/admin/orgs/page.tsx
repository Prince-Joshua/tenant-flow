import { Box, Flex, Input, Text } from '@chakra-ui/react';
import { ChakraLink } from '@/components/shared/ChakraLink';
import { getAllOrgs } from '@/server/data/admin';
import PageHeader from '@/components/layout/PageHeader';
import { PlanBadge, EmptyState } from '@/components/shared';
import OrgAdminControls from '@/components/admin/OrgAdminControls';
import { inputStyle } from '@/lib/inputStyles';

export default async function AdminOrgsPage({ searchParams }: { searchParams: Promise<{ page?: string; search?: string; plan?: string }> }) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const search = resolvedSearchParams.search || '';
  const { organizations, pagination } = await getAllOrgs({ page, search, plan: resolvedSearchParams.plan || '' });
  const orgs = JSON.parse(JSON.stringify(organizations));

  return (
    <>
      <PageHeader title="Organizations" subtitle={`${pagination.total} total`} />

      <form method="get" action="/admin/orgs">
        <Input name="search" defaultValue={search} placeholder="Search organizations..." maxW="320px" mb="5" {...inputStyle} />
      </form>

      {!orgs.length ? (
        <EmptyState icon="◈" title="No organizations found" />
      ) : (
        <Flex direction="column" gap="2">
          {orgs.map((org: any) => (
            <Flex key={org._id} justify="space-between" align="center" bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="4" wrap="wrap" gap="3">
              <Box>
                <Flex align="center" gap="2" mb="1">
                  <Text fontSize="sm" fontWeight="semibold" color="text.primary">{org.name}</Text>
                  <PlanBadge plan={org.plan} />
                </Flex>
                <Text fontSize="xs" color="text.muted">{org.owner?.email} · {org.memberCount} members · {org.documentCount} docs</Text>
              </Box>
              <OrgAdminControls orgId={org._id} plan={org.plan} />
            </Flex>
          ))}
          {pagination.pages > 1 && (
            <Flex justify="space-between" align="center" mt="2">
              <ChakraLink href={`/admin/orgs?page=${Math.max(1, page - 1)}${search ? `&search=${search}` : ''}`} fontSize="sm" color="text.secondary">← Prev</ChakraLink>
              <Text fontSize="xs" color="text.muted">{page} / {pagination.pages}</Text>
              <ChakraLink href={`/admin/orgs?page=${Math.min(pagination.pages, page + 1)}${search ? `&search=${search}` : ''}`} fontSize="sm" color="text.secondary">Next →</ChakraLink>
            </Flex>
          )}
        </Flex>
      )}
    </>
  );
}
