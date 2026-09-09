'use client';

import { useActionState } from 'react';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { resetPasswordAction } from '@/server/actions/auth';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { inputStyle } from '@/lib/inputStyles';

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="6">
        <input type="hidden" name="token" value={token} />
        {state?.error && (
          <Box bg="rgba(244,63,94,0.08)" border="1px solid" borderColor="rose.500" borderRadius="lg" px="4" py="3">
            <Text fontSize="sm" color="rose.400">{state.error}</Text>
          </Box>
        )}
        <Stack gap="4">
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">New password</Text>
            <Input name="password" type="password" placeholder="Min. 6 characters" required minLength={6} {...inputStyle} />
          </Box>
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Confirm password</Text>
            <Input name="confirm" type="password" placeholder="Repeat password" required {...inputStyle} />
          </Box>
        </Stack>
        <SubmitButton w="full" bg="violet.600" color="white" borderRadius="lg" _hover={{ bg: 'violet.500' }}>
          Reset password
        </SubmitButton>
      </Stack>
    </form>
  );
}
