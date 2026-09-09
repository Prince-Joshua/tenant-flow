import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { ChakraLink } from '@/components/shared/ChakraLink';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.canvas" px="4">
      <Box bg="bg.surface" border="1px solid" borderColor="border.subtle" borderRadius="2xl" p="10" w="full" maxW="420px">
        <Stack gap="6">
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="1">Set new password</Text>
            <Text fontSize="sm" color="text.muted">Choose a strong password for your account.</Text>
          </Box>
          <ResetPasswordForm token={searchParams.token || ''} />
          <Text fontSize="sm" color="text.muted" textAlign="center">
            <ChakraLink href="/login" color="violet.400" fontWeight="medium">← Back to login</ChakraLink>
          </Text>
        </Stack>
      </Box>
    </Flex>
  );
}
