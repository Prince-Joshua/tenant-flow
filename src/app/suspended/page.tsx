import { Box, Flex, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";
import { requireUser } from "@/server/data/tenant";
import { backdropProps, cardProps } from "@/lib/cardStyles";

export default async function SuspendedPage() {
  await requireUser();
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
          ⏸
        </Text>
        <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="2">
          Workspace suspended
        </Text>
        <Text fontSize="sm" color="text.muted" mb="6">
          This workspace has been suspended by a platform administrator.
          Contact support if you think this is a mistake.
        </Text>
        <ChakraLink
          href="/org-select"
          display="block"
          bg="violet.600"
          color="white"
          borderRadius="lg"
          py="2.5"
          fontWeight="semibold"
          _hover={{ bg: "violet.500" }}
        >
          Switch workspace
        </ChakraLink>
      </Box>
    </Flex>
  );
}
