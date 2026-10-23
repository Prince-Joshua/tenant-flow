import { Box, Flex, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { acceptInviteToken } from "@/server/actions/auth";
import { backdropProps, cardProps } from "@/lib/cardStyles";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const { ok, reason } = await acceptInviteToken(token || "");
  const title = ok
    ? "Invite accepted"
    : reason === "login"
      ? "Sign in to accept"
      : reason === "wrong_user"
        ? "Wrong account"
        : "Invite invalid";
  const message = ok
    ? "You\u2019ve joined the organization. Sign in to get started."
    : reason === "login"
      ? "Sign in with the account this invite was sent to, then open the link from your email again."
      : reason === "wrong_user"
        ? "This invite was issued to a different account. Sign in with the invited account and try again."
        : "This invite link is invalid or has expired.";
  return (
    <Flex minH="100vh" align="center" justify="center" {...backdropProps} px="4">
      <Box
        {...cardProps}
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
          {title}
        </Text>
        <Text fontSize="sm" color="text.muted" mb="6">
          {message}
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
