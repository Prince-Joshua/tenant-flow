import { Box, Flex, Text } from "@chakra-ui/react";
import { requireTenant } from "@/server/data/tenant";
import PageHeader from "@/components/layout/PageHeader";
import { RoleBadge } from "@/components/shared";
import OrgSettingsForm from "@/components/settings/OrgSettingsForm";

export default async function SettingsPage() {
  const { user, org, membership } = await requireTenant();
  const canEdit = ["owner", "admin"].includes(membership.role);

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Organization and account details"
      />

      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p="6"
        mb="6"
      >
        <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="4">
          Organization
        </Text>
        {canEdit ? (
          <OrgSettingsForm name={org.name} />
        ) : (
          <Text fontSize="sm" color="text.muted">
            {org.name}
          </Text>
        )}
      </Box>

      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="xl"
        p="6"
      >
        <Text fontSize="sm" fontWeight="semibold" color="text.primary" mb="4">
          Your account
        </Text>
        <Flex justify="space-between" mb="2">
          <Text fontSize="sm" color="text.muted">
            Name
          </Text>
          <Text fontSize="sm" color="text.secondary">
            {user.name}
          </Text>
        </Flex>
        <Flex justify="space-between" mb="2">
          <Text fontSize="sm" color="text.muted">
            Email
          </Text>
          <Text fontSize="sm" color="text.secondary">
            {user.email}
          </Text>
        </Flex>
        <Flex justify="space-between">
          <Text fontSize="sm" color="text.muted">
            Role in {org.name}
          </Text>
          <RoleBadge role={membership.role} />
        </Flex>
      </Box>
    </>
  );
}
