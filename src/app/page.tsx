import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { ChakraLink } from "@/components/shared/ChakraLink";

const features = [
  {
    icon: "✦",
    title: "AI document generation",
    body: "Draft contracts, proposals, and reports in seconds with Gemini-powered writing.",
  },
  {
    icon: "◈",
    title: "Per-tenant isolation",
    body: "Every organization gets its own scoped data, members, and usage limits.",
  },
  {
    icon: "◇",
    title: "Built-in billing",
    body: "Stripe subscriptions, usage metering, and self-serve plan upgrades out of the box.",
  },
];

export default function HomePage() {
  return (
    <Box minH="100vh" bg="bg.canvas">
      <Flex
        as="nav"
        justify="space-between"
        align="center"
        px={{ base: "5", md: "10" }}
        py="5"
        borderBottom="1px solid"
        borderColor="border.subtle"
      >
        <Flex align="center" gap="2.5">
          <Box
            w="8"
            h="8"
            bg="violet.600"
            borderRadius="lg"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="bold"
            color="white"
            style={{ boxShadow: "0 0 16px rgba(139,92,246,0.4)" }}
          >
            T
          </Box>
          <Text fontSize="sm" fontWeight="bold" color="text.primary">
            TenantFlow
          </Text>
        </Flex>
        <Flex align="center" gap="3">
          <ChakraLink
            href="/login"
            fontSize="sm"
            color="text.secondary"
            px="3"
            py="2"
          >
            Sign in
          </ChakraLink>
          <ChakraLink
            href="/register"
            fontSize="sm"
            fontWeight="semibold"
            color="white"
            bg="violet.600"
            borderRadius="lg"
            px="4"
            py="2"
            _hover={{ bg: "violet.500" }}
          >
            Get started
          </ChakraLink>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        align="center"
        textAlign="center"
        px="5"
        pt={{ base: "16", md: "24" }}
        pb={{ base: "16", md: "20" }}
      >
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="violet.400"
          bg="brand.subtle"
          border="1px solid"
          borderColor="brand.border"
          borderRadius="full"
          px="3"
          py="1"
          mb="6"
          letterSpacing="wide"
          textTransform="uppercase"
        >
          Multi-tenant SaaS platform
        </Text>
        <Text
          as="h1"
          fontSize={{ base: "3xl", md: "5xl" }}
          fontWeight="bold"
          color="text.primary"
          letterSpacing="tight"
          maxW="720px"
          lineHeight="1.15"
          mb="5"
        >
          Run your organization on one workspace, not ten tools
        </Text>
        <Text
          fontSize={{ base: "md", md: "lg" }}
          color="text.secondary"
          maxW="560px"
          mb="8"
        >
          TenantFlow gives every team its own tenant with role-based access,
          AI-assisted document generation, and billing that just works.
        </Text>
        <Flex gap="3">
          <ChakraLink
            href="/register"
            fontSize="sm"
            fontWeight="semibold"
            color="white"
            bg="violet.600"
            borderRadius="lg"
            px="6"
            py="3"
            _hover={{ bg: "violet.500" }}
          >
            Create your workspace
          </ChakraLink>
          <ChakraLink
            href="/login"
            fontSize="sm"
            fontWeight="semibold"
            color="text.secondary"
            border="1px solid"
            borderColor="border.default"
            borderRadius="lg"
            px="6"
            py="3"
            _hover={{ bg: "bg.elevated" }}
          >
            Sign in
          </ChakraLink>
        </Flex>
      </Flex>

      <Grid
        templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
        gap="4"
        px={{ base: "5", md: "10" }}
        pb={{ base: "16", md: "24" }}
        maxW="1100px"
        mx="auto"
      >
        {features.map((f) => (
          <Box
            key={f.title}
            bg="bg.surface"
            border="1px solid"
            borderColor="border.subtle"
            borderRadius="xl"
            p="6"
          >
            <Box
              bg="brand.subtle"
              borderRadius="lg"
              p="2.5"
              fontSize="lg"
              display="inline-flex"
              mb="4"
            >
              {f.icon}
            </Box>
            <Text
              fontSize="md"
              fontWeight="semibold"
              color="text.primary"
              mb="2"
            >
              {f.title}
            </Text>
            <Text fontSize="sm" color="text.muted">
              {f.body}
            </Text>
          </Box>
        ))}
      </Grid>

      <Flex
        as="footer"
        justify="center"
        align="center"
        gap="6"
        px="5"
        py="6"
        borderTop="1px solid"
        borderColor="border.subtle"
      >
        <Text fontSize="xs" color="text.muted">
          © {new Date().getFullYear()} TenantFlow LLC
        </Text>
        <ChakraLink
          href="/terms"
          fontSize="xs"
          color="text.muted"
          _hover={{ color: "text.secondary" }}
        >
          Terms of Service
        </ChakraLink>
      </Flex>
    </Box>
  );
}
