import { Box, Flex, Text } from "@chakra-ui/react";
import RegisterForm from "@/components/auth/RegisterForm";
import { HomeLink } from "@/components/shared/HomeLink";
import { backdropProps, cardProps } from "@/lib/cardStyles";

export default function RegisterPage() {
  return (
    <Flex minH="100vh" align="center" justify="center" {...backdropProps} px="4">
      <Box
        {...cardProps}
        borderRadius="2xl"
        p="10"
        w="full"
        maxW="440px"
      >
        <Box display="flex" flexDirection="column" gap="6">
          <HomeLink />
          <Box>
            <Text fontSize="xl" fontWeight="bold" color="text.primary" mb="1">
              Create your account
            </Text>
            <Text fontSize="sm" color="text.muted">
              Start your 14-day free trial. No credit card required.
            </Text>
          </Box>
          <RegisterForm />
        </Box>
      </Box>
    </Flex>
  );
}
