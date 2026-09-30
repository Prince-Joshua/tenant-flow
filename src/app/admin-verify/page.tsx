import { Box, Flex, Text } from "@chakra-ui/react";
import { requireSuperAdminNoElevation } from "@/server/data/tenant";
import AdminVerifyForm from "@/components/admin/AdminVerifyForm";
import { HomeLink } from "@/components/shared/HomeLink";
import { backdropProps, cardProps } from "@/lib/cardStyles";

export default async function AdminVerifyPage() {
  await requireSuperAdminNoElevation();

  return (
    <Flex minH="100vh" align="center" justify="center" {...backdropProps} px="4">
      <Box
        {...cardProps}
        borderRadius="2xl"
        p="10"
        w="full"
        maxW="420px"
      >
        <Box display="flex" flexDirection="column" gap="6">
          <HomeLink />
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="1">
              Confirm your password
            </Text>
            <Text fontSize="sm" color="text.muted">
              Re-enter your password to open the admin panel.
            </Text>
          </Box>
          <AdminVerifyForm />
        </Box>
      </Box>
    </Flex>
  );
}
