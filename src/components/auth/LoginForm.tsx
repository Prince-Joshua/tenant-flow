'use client';

import { useActionState } from 'react';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { loginAction } from '@/server/actions/auth';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { ChakraLink } from '@/components/shared/ChakraLink';
import { inputStyle } from '@/lib/inputStyles';

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="6">
        {state?.error && (
          <Box bg="rgba(244,63,94,0.08)" border="1px solid" borderColor="rose.500" borderRadius="lg" px="4" py="3">
            <Text fontSize="sm" color="rose.400">{state.error}</Text>
          </Box>
        )}
        <Stack gap="4">
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Email</Text>
            <Input name="email" type="email" placeholder="you@company.com" required {...inputStyle} />
          </Box>
          <Box>
            <Box display="flex" justifyContent="space-between" mb="1.5">
              <Text fontSize="sm" fontWeight="medium" color="text.secondary">Password</Text>
              <ChakraLink href="/forgot-password" fontSize="xs" color="violet.400">Forgot password?</ChakraLink>
            </Box>
            <Input name="password" type="password" placeholder="••••••••" required {...inputStyle} />
          </Box>
        </Stack>
        <SubmitButton w="full" bg="violet.600" color="white" borderRadius="lg" fontWeight="semibold" _hover={{ bg: 'violet.500' }}>
          Sign in
        </SubmitButton>
        <Text as="div" fontSize="sm" color="text.muted" textAlign="center">
          Don&apos;t have an account? <ChakraLink href="/register" color="violet.400" fontWeight="medium">Create one</ChakraLink>
        </Text>
      </Stack>
    </form>
  );
}
