'use client';

import { useFormState } from 'react-dom';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { registerAction } from '@/server/actions/auth';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { ChakraLink } from '@/components/shared/ChakraLink';
import { inputStyle } from '@/lib/inputStyles';

const fields: [string, string, string, string][] = [
  ['name', 'text', 'Full name', 'Your name'],
  ['email', 'email', 'Work email', 'you@company.com'],
  ['password', 'password', 'Password', 'Min. 6 characters'],
  ['orgName', 'text', 'Organization name', 'Acme Inc.'],
];

export default function RegisterForm() {
  const [state, formAction] = useFormState(registerAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="6">
        {state?.error && (
          <Box bg="rgba(244,63,94,0.08)" border="1px solid" borderColor="rose.500" borderRadius="lg" px="4" py="3">
            <Text fontSize="sm" color="rose.400">{state.error}</Text>
          </Box>
        )}
        <Stack gap="4">
          {fields.map(([name, type, label, placeholder]) => (
            <Box key={name}>
              <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">{label}</Text>
              <Input name={name} type={type} placeholder={placeholder} required minLength={name === 'password' ? 6 : undefined} {...inputStyle} />
            </Box>
          ))}
        </Stack>
        <SubmitButton w="full" bg="violet.600" color="white" borderRadius="lg" fontWeight="semibold" _hover={{ bg: 'violet.500' }}>
          Create account
        </SubmitButton>
        <Text fontSize="sm" color="text.muted" textAlign="center">
          Already have an account? <ChakraLink href="/login" color="violet.400" fontWeight="medium">Sign in</ChakraLink>
        </Text>
      </Stack>
    </form>
  );
}
