import { Box, Flex, Text } from "@chakra-ui/react";
import { ChakraLink } from "./ChakraLink";

export function HomeLink() {
  return (
    <ChakraLink href="/">
      <Flex align="center" gap="2.5">
        <Box
          w="9"
          h="9"
          bg="violet.600"
          borderRadius="lg"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontWeight="bold"
          color="white"
          style={{ boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}
        >
          T
        </Box>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          TenantFlow
        </Text>
      </Flex>
    </ChakraLink>
  );
}
