import { Box, Flex, Text } from "@chakra-ui/react";
import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { HomeLink } from "@/components/shared/HomeLink";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const { registered, reset } = await searchParams;
  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.canvas" px="4">
      <Box
        bg="bg.surface"
        border="1px solid"
        borderColor="border.subtle"
        borderRadius="2xl"
        p="10"
        w="full"
        maxW="420px"
      >
        <Box display="flex" flexDirection="column" gap="6">
          <HomeLink />

          <Box>
            <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="1">
              Welcome back
            </Text>
            <Text fontSize="sm" color="text.muted">
              Sign in to your account
            </Text>
          </Box>
          {registered && (
            <Box
              bg="rgba(16,185,129,0.08)"
              border="1px solid"
              borderColor="emerald.500"
              borderRadius="lg"
              px="4"
              py="3"
            >
              <Text fontSize="sm" color="emerald.400">
                Account created. Check your email to verify, then sign in.
              </Text>
            </Box>
          )}
          {reset && (
            <Box
              bg="rgba(16,185,129,0.08)"
              border="1px solid"
              borderColor="emerald.500"
              borderRadius="lg"
              px="4"
              py="3"
            >
              <Text fontSize="sm" color="emerald.400">
                Password reset. Sign in with your new password.
              </Text>
            </Box>
          )}
          <LoginForm />
        </Box>
      </Box>
    </Flex>
  );
}
