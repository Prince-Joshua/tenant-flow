'use client';

import { useFormState } from 'react-dom';
import { Box, Input, Stack, Text } from '@chakra-ui/react';
import { updateOrgAction } from '@/server/actions/org';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { inputStyle } from '@/lib/inputStyles';

export default function OrgSettingsForm({ name }: { name: string }) {
  const [state, formAction] = useFormState(updateOrgAction, undefined);

  return (
    <form action={formAction}>
      <Stack gap="4" maxW="400px">
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text.secondary" mb="1.5">Organization name</Text>
          <Input name="name" defaultValue={name} required {...inputStyle} />
        </Box>
        {state?.error && <Text fontSize="sm" color="rose.400">{state.error}</Text>}
        {state?.success && <Text fontSize="sm" color="emerald.400">{state.success}</Text>}
        <SubmitButton alignSelf="flex-start" bg="violet.600" color="white" borderRadius="lg" _hover={{ bg: 'violet.500' }}>Save changes</SubmitButton>
      </Stack>
    </form>
  );
}
