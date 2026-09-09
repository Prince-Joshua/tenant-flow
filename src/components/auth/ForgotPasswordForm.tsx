'use client';

import { useActionState } from 'react';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { forgotPasswordAction } from '@/server/actions/auth';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { inputStyle } from '@/lib/inputStyles';

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, undefined);

  if (state?.success) {
    return (
      <Box bg="rgba(16,185,129,0.08)" border="1px solid" borderColor="emerald.500" borderRadius="lg" px="4" py="3">
        <Text fontSize="sm" color="emerald.400">{state.success}</Text>
      </Box>
    );
  }

  return (
    <form action={formAction}>
      <Stack gap="4">
        {state?.error && <Text fontSize="sm" color="rose.400">{state.error}</Text>}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Email</Text>
          <Input name="email" type="email" placeholder="you@company.com" required {...inputStyle} />
        </Box>
        <SubmitButton w="full" bg="violet.600" color="white" borderRadius="lg" _hover={{ bg: 'violet.500' }}>
          Send reset link
        </SubmitButton>
      </Stack>
    </form>
  );
}
