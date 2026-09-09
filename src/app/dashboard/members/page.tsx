import { Box, Flex, Text } from '@chakra-ui/react';
import { requireTenant } from '@/server/data/tenant';
import { getOrgMembers } from '@/server/data/org';
import PageHeader from '@/components/layout/PageHeader';
import { RoleBadge } from '@/components/shared';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { removeMemberAction } from '@/server/actions/org';
import InviteForm from '@/components/members/InviteForm';
import RoleUpdateForm from '@/components/members/RoleUpdateForm';

export default async function MembersPage() {
  const { org, membership } = await requireTenant();
  const members = JSON.parse(JSON.stringify(await getOrgMembers(org)));
  const canManage = ['owner', 'admin'].includes(membership.role);
  const isOwner = membership.role === 'owner';

  return (
    <>
      <PageHeader title="Members" subtitle={`${members.length} of ${org.limits.membersAllowed} seats used`} />

      {canManage && (
        <Box as="details" mb="6">
          <Box as="summary" listStyleType="none" cursor="pointer" fontSize="sm" fontWeight="semibold" color="text.primary" bg="bg.surface" border="1px solid" borderColor="brand.border" borderRadius="xl" px="6" py="3">
            + Invite a teammate
          </Box>
          <Box bg="bg.surface" border="1px solid" borderColor="brand.border" borderTop="none" borderRadius="0 0 12px 12px" p="6">
            <InviteForm />
          </Box>
        </Box>
      )}

      <Flex direction="column" gap="2">
        {members.map((m: any) => (
          <Flex key={m._id} justify="space-between" align="center" bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="xl" p="4">
            <Flex align="center" gap="3">
              <Box w="9" h="9" borderRadius="full" bg="violet.700" display="flex" alignItems="center" justifyContent="center" fontSize="sm" fontWeight="bold" color="white">
                {m.user?.name?.[0]?.toUpperCase()}
              </Box>
              <Box>
                <Text fontSize="sm" fontWeight="semibold" color="text.primary">{m.user?.name}</Text>
                <Text fontSize="xs" color="text.muted">{m.user?.email}</Text>
              </Box>
            </Flex>

            <Flex align="center" gap="3">
              {isOwner && m.role !== 'owner' ? (
                <RoleUpdateForm memberId={m._id} role={m.role} />
              ) : (
                <RoleBadge role={m.role} />
              )}

              {canManage && m.role !== 'owner' && (
                <form action={removeMemberAction}>
                  <input type="hidden" name="memberId" value={m._id} />
                  <SubmitButton size="xs" variant="ghost" color="text.muted" _hover={{ color: 'rose.400', bg: 'transparent' }}>Remove</SubmitButton>
                </form>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </>
  );
}
