import { Box, Flex, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { verifyEmailToken } from "@/server/actions/auth";

// A GET link click from an email — verified directly during render via a
// server-only function, no client-side useVerifyEmailQuery() involved.
export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { ok } = await verifyEmailToken(token || "");
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
        textAlign="center"
      >
        <Text fontSize="3xl" mb="4">
          {ok ? "✓" : "✕"}
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="2">
          {ok ? "Email verified" : "Verification failed"}
        </Text>
        <Text fontSize="sm" color="text.muted" mb="6">
          {ok
            ? "Your email has been verified. You can now sign in."
            : "This link is invalid or has expired."}
        </Text>
        <ChakraLink
          href="/login"
          display="block"
          bg="violet.600"
          color="white"
          borderRadius="lg"
          py="2.5"
          fontWeight="semibold"
          _hover={{ bg: "violet.500" }}
        >
          Go to login
        </ChakraLink>
      </Box>
    </Flex>
  );
}
